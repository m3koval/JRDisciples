import assert from 'node:assert/strict'
import { createJourney, stepJourney, retryJourney } from './mechanics.ts'
import { pickupEcho } from './feedback.ts'
const level = { orbs: [{id:1,x:18,y:82,found:false},{id:2,x:80,y:20,found:false}], hazards:[], lambStart:{x:80,y:80}, gate:{x:10,y:10}, requiredLight:2 }
const initial = createJourney(level)
assert.equal(pickupEcho(initial.orbs[0], 0), null)
const collected = stepJourney(initial, level, {}, .05)
assert.equal(initial.orbs[0].found, false)
assert.equal(collected.orbs[0].foundAt, .05)
assert.equal(collected.orbs[1].foundAt, undefined)
assert.deepEqual(pickupEcho(collected.orbs[0], collected.time), {radius:2,opacity:1})
const later = stepJourney(collected, level, {}, .05)
assert.equal(later.orbs[0].foundAt, .05)
assert.ok(pickupEcho(later.orbs[0], later.time).opacity < 1)
assert.equal(pickupEcho(later.orbs[0], 1), null)
assert.equal(pickupEcho(later.orbs[0], 0), null)
assert.equal(pickupEcho({...later.orbs[0],foundAt:undefined}, 1), null)
assert.deepEqual(pickupEcho(later.orbs[0], later.time), pickupEcho(later.orbs[0], later.time), 'paused time is stable')
assert.equal(retryJourney(later, level).orbs[0].foundAt, .05)
assert.equal(createJourney(level).orbs[0].foundAt, undefined)
assert.equal(later.hp, 3)
assert.deepEqual(later.lamb, initial.lamb)
console.log('PASS Shepherd pickup feedback: collision-only, no duplicate timestamp, expiry, pause, retry, reset, no premature escort')
