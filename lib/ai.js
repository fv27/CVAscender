import 'server-only';
// SERVER-ONLY helper. Imported only by files in app/api/, which run on the
// server — so API keys in process.env never reach the browser.
//
// Supports Anthropic or OpenAI (whichever key you set). Returns parsed JSON,
// or null if no key is configured or anything fails — callers then fall back
// to the rule-based engine, so the app never breaks during a demo.

export const aiConfigured = () => !!(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);

export async function askJSON(system, user) {
  try {
    let text;
    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'claude-haiku-5-5',
          max_tokens: 1500,
          system,
          messages: [{ role: 'user', content: user }],
        }),
      });
      if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
      const data = await res.json();
      text = data.content?.map((c) => c.text || '').join('');
    } else if (process.env.OPENAI_API_KEY) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        }),
      });
      if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
      const data = await res.json();
      text = data.choices?.[0]?.message?.content;
    } else {
      return null;
    }
    const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
    return JSON.parse(json);
  } catch (err) {
    console.error('[ai] falling back to rules:', err.message);
    return null;
  }
}

// Keep only the profile fields the AI needs, with sane limits.
export function cleanProfile(p = {}) {
  const arr = (a) => (Array.isArray(a) ? a.slice(0, 15).map((x) => String(x).slice(0, 40)) : []);
  return {
    canton: String(p.canton || '').slice(0, 4),
    city: String(p.city || '').slice(0, 60),
    age: Number(p.age) || null,
    year: Number(p.year) || null,
    interests: arr(p.interests),
    skills: arr(p.skills),
    hasSchool: !!p.schoolId,
  };
}
