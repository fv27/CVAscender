import 'server-only';
// Who may trigger paid AI calls?
//  * Accounts enabled (Supabase set up) → only signed-in students. Everyone
//    else still gets the free rule-based matching.
//  * Demo mode (no accounts) → anyone, but limited per IP so a bot can't run
//    up your AI bill.
import { aiConfigured } from '@/lib/ai';
import { getUser } from './supabase';
import { supabaseConfig } from './env';
import { rateLimit, clientIp } from './security';

export async function aiAllowed(req) {
  if (!aiConfigured()) return false;
  if (supabaseConfig) {
    const { user } = await getUser();
    if (!user) return false;
    return (await rateLimit(`ai-user:${user.id}`, 60, 3600)).ok;
  }
  return (await rateLimit(`ai-ip:${clientIp(req)}`, 30, 3600)).ok;
}
