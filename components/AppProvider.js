'use client';

// ---------------------------------------------------------------------------
// App-wide state: the student's profile, what they saved/applied/completed,
// and custom activities. Always cached in localStorage (so demo mode works
// with zero setup). When Supabase is configured and the student is signed in,
// the same state is synced to their row in the `student_data` table.
// ---------------------------------------------------------------------------

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { studentDataSchema } from '@/lib/schemas';
import { getOpportunity } from '@/lib/opportunities';
import { LEGACY_SCHOOL_IDS } from '@/lib/schools';

// The browser never holds database keys or talks to Supabase directly.
// It calls our own API routes; the session is an httpOnly cookie.
// The Origin header (sent automatically by the browser) is what our API checks.
const api = (path, method = 'GET', body) =>
  fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (r) => ({ ok: r.ok, status: r.status, data: await r.json().catch(() => ({})) }));

const KEY = 'cva:v1';
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const empty = { profile: null, tracks: {}, custom: [] };

// Anything read from storage is untrusted: validate it, fall back safely.
function sanitize(raw) {
  // Listings and schools can be renamed between versions: drop progress on
  // listings that no longer exist and map old school IDs, instead of
  // rejecting the whole saved record.
  if (raw && typeof raw === 'object') {
    if (raw.tracks && typeof raw.tracks === 'object') {
      raw = { ...raw, tracks: Object.fromEntries(Object.entries(raw.tracks).filter(([id]) => getOpportunity(id))) };
    }
    const sid = raw.profile?.schoolId;
    if (sid && LEGACY_SCHOOL_IDS[sid]) raw = { ...raw, profile: { ...raw.profile, schoolId: LEGACY_SCHOOL_IDS[sid] } };
  }
  const r = studentDataSchema.safeParse({ ...empty, ...raw });
  if (r.success) return r.data;
  const profileOnly = studentDataSchema.safeParse({ ...empty, profile: raw?.profile ?? null });
  return profileOnly.success ? profileOnly.data : empty;
}
function readLocal() {
  try { return sanitize(JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { return empty; }
}
function writeLocal(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export default function AppProvider({ children }) {
  const [state, setState] = useState(empty);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [hasSupabase, setHasSupabase] = useState(false); // true when accounts are on (Supabase or local)
  const [accountsMode, setAccountsMode] = useState(null);
  const [toast, setToast] = useState(null);
  const syncTimer = useRef(null);
  const userRef = useRef(null);

  const refreshUser = useCallback(async () => {
    const r = await api('/api/auth/me');
    setHasSupabase(!!r.data.enabled);
    setAccountsMode(r.data.mode || null);
    userRef.current = r.data.user || null;
    setUser(r.data.user || null);
    return r.data.user || null;
  }, []);

  // Load local data, then (if signed in) the account's data from the server.
  const loadCloud = useCallback(async () => {
    const r = await api('/api/data');
    if (!r.ok) return null;
    if (r.data.data?.profile) {
      const s = sanitize(r.data.data);
      setState(s); writeLocal(s);
      return s.profile;
    }
    const local = readLocal();
    await api('/api/data', 'PUT', local); // first sign-in: keep the progress made before signing up
    return local.profile;
  }, []);

  useEffect(() => {
    setState(readLocal());
    setReady(true);
    refreshUser().then((u) => u && loadCloud()).catch(() => {});
  }, [refreshUser, loadCloud]);

  const commit = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      writeLocal(next);
      if (userRef.current) {
        clearTimeout(syncTimer.current);
        syncTimer.current = setTimeout(() => { api('/api/data', 'PUT', next).catch(() => {}); }, 700);
      }
      return next;
    });
  }, []);

  const notify = useCallback((msg) => {
    setToast({ msg, k: Date.now() });
    setTimeout(() => setToast((t) => (t && Date.now() - t.k > 2200 ? null : t)), 2400);
  }, []);

  const actions = useMemo(() => ({
    saveProfile: (profile) => commit((s) => ({ ...s, profile })),
    toggleSave: (id) => commit((s) => {
      const t = s.tracks[id] || {};
      const saved = !t.saved;
      notify(saved ? 'Saved to your list' : 'Removed from saved');
      return { ...s, tracks: { ...s.tracks, [id]: { ...t, saved, savedAt: saved ? Date.now() : t.savedAt } } };
    }),
    setStatus: (id, status, extra = {}) => commit((s) => {
      const t = s.tracks[id] || {};
      const stamp = status === 'applied' ? { appliedAt: Date.now() } : status === 'completed' ? { completedAt: Date.now() } : {};
      notify(status === 'applied' ? 'Marked as applied' : status === 'completed' ? 'Added to your CV' : 'Status cleared');
      return { ...s, tracks: { ...s.tracks, [id]: { ...t, status, ...stamp, ...extra } } };
    }),
    addCustom: (item) => commit((s) => ({ ...s, custom: [...s.custom, { ...item, id: `c-${Date.now()}`, completedAt: Date.now() }] })),
    removeCustom: (id) => commit((s) => ({ ...s, custom: s.custom.filter((c) => c.id !== id) })),
    resetAll: () => { commit(empty); },
    signUp: (creds) => api('/api/auth/signup', 'POST', creds),
    signIn: async (creds) => {
      const r = await api('/api/auth/login', 'POST', creds);
      if (r.ok) { await refreshUser(); r.profile = await loadCloud(); }
      return r;
    },
    deleteAccount: async () => {
      const r = await api('/api/auth/me', 'DELETE');
      if (r.ok) {
        userRef.current = null; setUser(null);
        try { localStorage.removeItem(KEY); } catch {}
        setState(empty);
      }
      return r;
    },
    signOut: async () => {
      await api('/api/auth/logout', 'POST');
      userRef.current = null; setUser(null);
      try { localStorage.removeItem(KEY); } catch {}   // don't leave data on shared computers
      setState(empty);
    },
    notify,
  }), [commit, notify, refreshUser, loadCloud]);

  return (
    <Ctx.Provider value={{ ...state, ready, user, hasSupabase, accountsMode, ...actions }}>
      {children}
      {toast && (
        <div key={toast.k} className="pointer-events-none fixed left-1/2 top-5 z-[80] -translate-x-1/2 animate-rise rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper shadow-lift">
          {toast.msg}
        </div>
      )}
    </Ctx.Provider>
  );
}
