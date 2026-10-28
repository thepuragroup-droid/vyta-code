import fs from 'node:fs';
// Review records for the lookup. On Vercel, VYTA_RECORDS_URL points at the VYTA admin's
// public records endpoint (https://www.vytabio.com/api/code-reviews), which is fed by
// Admin → VYTA Code. Without it (local builds) review-records.json is used.
// A failed or malformed fetch fails the build, so Vercel keeps serving the last good deploy.
const root=new URL('.',import.meta.url),resolved=new URL('.records.json',root);
function validate(raw,from){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error(`Records from ${from} are not an object`);
  const out={};
  for(const [code,r] of Object.entries(raw)){
    if(!/^[A-Z0-9_-]{1,64}$/.test(code))throw new Error(`Bad code ${JSON.stringify(code)} from ${from}`);
    if(!r||!/^\d{4}-\d{2}-\d{2}$/.test(r.captureDate))throw new Error(`Bad captureDate for ${code} from ${from}`);
    if(typeof r.status!=='string')throw new Error(`Bad status for ${code} from ${from}`);
    if(r.captureTime!==undefined&&!/^\d{1,2}:\d{2}:\d{2} (AM|PM)$/.test(r.captureTime))throw new Error(`Bad captureTime for ${code} from ${from}`);
    out[code]={captureDate:r.captureDate,status:r.status,...(r.captureTime?{captureTime:r.captureTime}:{})};
  }
  return out;
}
// Fetch (or read) once per build and pin the result in .records.json for check.mjs.
export async function resolveRecords(){
  const url=process.env.VYTA_RECORDS_URL;let records;
  if(url){
    const res=await fetch(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout(15000)});
    if(!res.ok)throw new Error(`Fetching records from ${url} failed: HTTP ${res.status}`);
    records=validate(await res.json(),url);
  }else records=validate(JSON.parse(fs.readFileSync(new URL('review-records.json',root),'utf8')),'review-records.json');
  fs.writeFileSync(resolved,JSON.stringify(records,null,2));
  console.log(`Records: ${Object.keys(records).length} from ${url||'review-records.json'}${Object.keys(records).length?'':' (none published — every lookup shows Not reviewed)'}`);
  return records;
}
export function builtRecords(){return JSON.parse(fs.readFileSync(resolved,'utf8'))}
