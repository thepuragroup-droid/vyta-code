export function getRecordResult(value, records) {
  const code = String(value || '').trim().toUpperCase();
  const record = Object.hasOwn(records, code) ? records[code] : null;
  if (!record) return {code, status:'unknown', title:'Not reviewed', verified:false, message:'No reviewed record is available here. This does not mean the code is invalid.'};
  const labels = {'screenshot-applied':'Code verified in cart', 'settings-reviewed':'Settings reviewed', 'needs-recheck':'Needs recheck', 'screenshot-not-applied':'Not applied in screenshot', expired:'Expired'};
  const conflict = Array.isArray(record.history) && record.history.some(h => h.captureDate === record.captureDate && (h.captureTime || null) === (record.captureTime || null) && h.status !== record.status);
  const status = !conflict && Object.hasOwn(labels, record.status) ? record.status : 'needs-recheck';
  const parsed = new Date((record.captureDate || '') + 'T00:00:00Z');
  const dated = /^\d{4}-\d{2}-\d{2}$/.test(record.captureDate || '') && Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0,10) === record.captureDate;
  if (!dated) return {code, status:'needs-recheck', title:'Needs recheck', verified:false, message:'The screenshot date needs review.'};
  return {code, status, title:labels[status], verified:status === 'screenshot-applied', message:`Based on screenshot dated ${record.captureDate}${record.captureTime ? ' at ' + record.captureTime : ''}.`, path:'/codes/'+code.toLowerCase()+'/'};
}
