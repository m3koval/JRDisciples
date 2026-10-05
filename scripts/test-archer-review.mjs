import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
const sandbox={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/games/faithful-archer/shot-review.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,sandbox);
const {beginReview,traceReview,finishReview,reviewCopy}=sandbox.exports;
let groups=0;
const point={x:10,y:20,trail:['not-a-review-field']};let r=beginReview(2,point);point.x=999;
assert.equal(r.points[0].x,10);assert.equal(r.points[0].trail,undefined);groups++;
assert.equal(traceReview(r,1,{x:20,y:40}),r);assert.equal(finishReview(r,1,'ground'),r);groups++;
assert.equal(traceReview(r,2,{x:NaN,y:0}),r);assert.equal(traceReview(r,2,{x:10,y:21}),r);groups++;
for(let i=1;i<2000;i++) {r=traceReview(r,2,{x:10+i*4,y:20+i*2});assert.ok(r.points.length<=160);}
assert.equal(r.points[0].x,10);assert.equal(r.points.at(-1).x,8006);groups++;
const done=finishReview(r,2,'blocked');assert.equal(done.outcome,'blocked');assert.equal(traceReview(done,2,{x:1,y:1}),done);assert.equal(finishReview(done,2,'target'),done);groups++;
const next=beginReview(3,{x:1,y:1});assert.equal(finishReview(next,2,'target'),next);assert.equal(next.points.length,1);groups++;
for(const outcome of ['flying','target','ground','blocked','outside']) {assert.ok(reviewCopy(outcome,false));assert.match(reviewCopy(outcome,true),/[А-Яа-я]/);}
assert.match(reviewCopy('blocked',false),/post/);assert.match(reviewCopy('ground',false),/ground/);groups++;
console.log(`PASS ${groups} shot-review groups: owned snapshots, latest-shot authority, finite input, bounded trace/endpoints, finalized freeze, replacement, EN/RU causes`);
