// Turns the raw tracking state into lists the CV, tracker and gap analysis use.
import { getOpportunity } from './opportunities';

export function progressLists(tracks = {}, custom = []) {
  const entries = Object.entries(tracks)
    .map(([id, t]) => ({ ...t, o: getOpportunity(id) }))
    .filter((x) => x.o);

  const done = [
    ...entries.filter((x) => x.status === 'completed').map((x) => ({
      id: x.o.id, title: x.o.title, org: x.o.org, type: x.o.type,
      skillsGained: x.skillsGained || x.o.skills, reflection: x.reflection, completedAt: x.completedAt, example: x.o.example,
    })),
    ...custom.map((c) => ({ ...c, custom: true })),
  ];
  const active = entries.filter((x) => x.status === 'applied').map((x) => ({ id: x.o.id, title: x.o.title, type: x.o.type }));
  const saved = entries.filter((x) => x.saved && !x.status);

  const skillCounts = {};
  done.forEach((d) => (d.skillsGained || []).forEach((s) => { skillCounts[s] = (skillCounts[s] || 0) + 1; }));

  return { entries, done, active, saved, skillCounts };
}
