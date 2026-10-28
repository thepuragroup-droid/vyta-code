export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const parsed = new Date(value + 'T00:00:00Z');
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}
export function timeKey(value) {
  const match = /^(1[0-2]|[1-9]):([0-5]\d):([0-5]\d) (AM|PM)$/.exec(value || '');
  if (!match) return -1;
  return (Number(match[1]) % 12 + (match[4] === 'PM' ? 12 : 0)) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}
export function observationsFor(code, record) {
  const allowedScreens = new Set(['Cart summary', 'Checkout summary', 'Settings screen', 'Supplied screenshot']);
  const items = [...(Array.isArray(record.history) ? record.history : []), record];
  const seen = new Set(), results = [];
  for (const item of items) {
    if (!validDate(item.captureDate) || (item.captureTime && timeKey(item.captureTime) < 0)) throw Error('Invalid screenshot timestamp for ' + code);
    const key = [code, item.captureDate, item.captureTime || '', item.status].join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({code, captureDate:item.captureDate, captureTime:item.captureTime || null, status:item.status, screen:allowedScreens.has(item.screen) ? item.screen : 'Supplied screenshot'});
  }
  // This is reported filename order, not a claim about absolute time across unknown timezones.
  return results.sort((a,b) => b.captureDate.localeCompare(a.captureDate) || timeKey(b.captureTime) - timeKey(a.captureTime));
}
