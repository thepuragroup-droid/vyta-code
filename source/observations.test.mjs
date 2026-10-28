import assert from 'node:assert/strict';import {validDate,timeKey,observationsFor} from './observations.mjs';import {getRecordResult} from './lookup.mjs';
assert(validDate('2024-02-29'));assert(!validDate('2026-02-29'));assert(!validDate('2026-02-30'));assert(!validDate('2026-99-99'));
assert(timeKey('12:00:00 AM')<timeKey('1:00:00 AM'));assert(timeKey('12:00:00 PM')<timeKey('1:00:00 PM'));assert(timeKey('11:59:59 AM')<timeKey('12:00:00 PM'));
const a={captureDate:'2026-10-27',captureTime:'3:20:24 PM',status:'screenshot-applied',screen:'Checkout summary'};
assert.equal(observationsFor('CHECK',a).length,1);assert.equal(observationsFor('CHECK',{...a,history:[a,a]}).length,1);
const conflict={...a,history:[{...a,status:'screenshot-not-applied'}]};assert.equal(observationsFor('CHECK',conflict).length,2);assert.equal(getRecordResult('CHECK',{CHECK:conflict}).verified,false);
assert.equal(observationsFor('CHECK',{...a,screen:'PRIVATE NOTE — never publish'} )[0].screen,'Supplied screenshot');
assert.throws(()=>observationsFor('CHECK',{...a,captureTime:'25:00:00 PM'}));assert.equal(getRecordResult('CHECK',{CHECK:{...a,captureDate:'2026-02-30'}}).verified,false);
console.log('PASS: calendar dates, noon/midnight ordering, deduplication, fallback, conflicts, screen whitelist and invalid capture times.');
