// Builds a tiny .ics file so a deadline can be added to Apple / Google / Outlook calendars.
// Runs only in the browser; nothing is sent anywhere.
const esc = (s = '') => String(s).replace(/[\;,]/g, (c) => '\\' + c).replace(/\r?\n/g, '\\n').slice(0, 300);
const ymd = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

export function downloadDeadlineIcs(o, date) {
  const next = new Date(date); next.setDate(next.getDate() + 1);
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CVAscender//EN', 'BEGIN:VEVENT',
    `UID:${o.id}-deadline@cvascender`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${ymd(date)}`, `DTEND;VALUE=DATE:${ymd(next)}`,
    `SUMMARY:${esc('Deadline: ' + o.title)}`,
    `DESCRIPTION:${esc((o.url ? o.url + ' — ' : '') + 'Check the official page: dates can change.')}`,
    'BEGIN:VALARM', 'TRIGGER:-P3D', 'ACTION:DISPLAY', `DESCRIPTION:${esc('3 days left: ' + o.title)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = `${o.id}-deadline.ics`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
