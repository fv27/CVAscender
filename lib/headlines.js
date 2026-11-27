// Explore page headlines — one is picked at random each time the page loads.
//  • *stars* mark the word shown in orange.
//  • {name} is replaced with the student's first name. If they didn't give a
//    name, ", {name}" is simply left out ("Time to ascend.").
// Add, remove or edit lines freely; keep each one short (it's a big heading).
export const HEADLINES = [
  'Ready to *collegemaxx*, {name}?',
  '*Collegemaxxing* awaits, {name}.',
  'Time to *ascend*, {name}.',
  'Time to *collegemaxx*, {name}.',
  'Time to *CVMaxx*, {name}.',
  'Ready to *ascend*, {name}?',
  'Ready to *CV mog* your friends, {name}?',
  'Your CV is still *ascending*, {name}.',
  'What do you want to *try*?',
  'What will you *build* next?',
  'Find your next *adventure*.',
  'What are you *curious* about?',
  'Your next big *step* starts here.',
  'Time to build your *CV*.',
];

/** Fill in the student's name (or drop it neatly when there isn't one). */
export function fillHeadline(line, name) {
  const n = (name || '').trim();
  return n ? line.replace(/\{name\}/g, n) : line.replace(/,?\s*\{name\}/g, '');
}
