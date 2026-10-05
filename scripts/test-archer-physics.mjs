import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
const source = fs.readFileSync('app/games/faithful-archer/physics.ts', 'utf8');
const sandbox = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, sandbox);
const { stepFlight, releasePoint, roundOutcome, targetMotion } = sandbox.exports;
let checks = 0;
for (const gravity of [720, 880]) {
  const shot = { x: 100, y: 300, vx: 800, vy: -450 };
  const whole = stepFlight(shot, 1, gravity);
  for (const fps of [30, 60, 120]) {
    let p = shot;
    for (let i = 0; i < fps; i++) p = stepFlight(p, 1 / fps, gravity);
    assert.ok(Math.abs(p.x - whole.x) < 1e-8 && Math.abs(p.y - whole.y) < 1e-8);
    checks++;
  }
}
const p = releasePoint({x:100,y:300},{x:700,y:100},{x:580,y:160});
assert.equal(p.x,-20); assert.equal(p.y,360); checks++;
assert.equal(roundOutcome(0,false,0,true),'play'); checks++;
assert.equal(roundOutcome(0,false,0,false),'refill'); checks++;
for(let level=0;level<3;level++){ assert.equal(roundOutcome(level,true,0,false),'advance'); checks++; }
assert.equal(roundOutcome(3,true,0,false),'complete'); checks++;
assert.equal(targetMotion('shield',3).x,0); assert.equal(targetMotion('scroll',3).y,0); checks++;
assert.ok(targetMotion('bell',2).x>0 && targetMotion('bell',2).y===0); checks++;
assert.ok(targetMotion('lantern',2).y>0 && targetMotion('lantern',2).x===0); checks++;
const page = fs.readFileSync('app/games/faithful-archer/page.tsx','utf8');
assert.ok(!page.includes('if (modelRef.current.running) spawnTargets()')); checks++;
assert.ok(page.includes('if (target.hit || target.hitCooldown > 0) continue')); checks++;
console.log(`PASS ${checks} archer physics/progression/regression checks`);
