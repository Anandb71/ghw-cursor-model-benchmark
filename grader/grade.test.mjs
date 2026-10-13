import test from 'node:test'; import assert from 'node:assert/strict';
const { parseDuration: p, formatDuration: f } = await import(process.env.TARGET);
const cases=[["1h30m",5400000],["2d 4h",187200000],["45s",45000],["1.5h",5400000],["90m",5400000],["500ms",500],["1m500ms",60500],["1d",86400000]];
for (const [s,v] of cases) test(`parse ${s}`,()=>assert.equal(p(s),v));
for (const bad of ["","abc","5x","h1","  "]) test(`parse invalid "${bad}"`,()=>assert.throws(()=>p(bad),RangeError));
test('parse non-string',()=>assert.throws(()=>p(5),TypeError));
for (const [ms,s] of [[5400000,"1h30m"],[0,"0ms"],[60500,"1m500ms"],[187200000,"2d4h"],[45000,"45s"]]) test(`format ${ms}`,()=>assert.equal(f(ms),s));
for (const bad of [-1,Infinity,NaN]) test(`format invalid ${bad}`,()=>assert.throws(()=>f(bad),RangeError));
