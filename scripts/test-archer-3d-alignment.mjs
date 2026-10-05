#!/usr/bin/env node
/** Validate actual browser observations, not a second implementation of projection.
 * Run AFTER test-archer-3d-browser.py, or pass its archer-3d-snapshots.json path.
 * Does not create a renderer, launch a browser, or replace the physics suite.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function assertAlignment(sample) {
  const { label, state, renderer, webgl, canvasCount } = sample;
  const prefix = `${label}: `;
  assert.equal(canvasCount, 1, prefix + 'one canvas');
  assert.equal(webgl, true, prefix + 'live WebGL context');
  assert.equal(renderer.kind, 'three-webgl', prefix + 'Three renderer');
  assert.equal(renderer.ready, true, prefix + 'renderer ready');
  for (const field of ['drawCalls', 'triangles', 'frames', 'alignmentError']) {
    assert.ok(Number.isFinite(renderer[field]), prefix + `finite ${field}`);
  }
  assert.ok(renderer.drawCalls > 0 && renderer.triangles >= 100,
    prefix + 'meaningful geometry, not a blank canvas or single textured quad');
  assert.ok(renderer.frames > 0, prefix + 'has rendered frames');
  assert.ok(renderer.alignmentError >= 0 && renderer.alignmentError <= 1,
    prefix + 'reported alignment error <= 1 CSS pixel');
  assert.ok(state.running, prefix + 'ordinary running gameplay');
  assert.ok(state.width > 0 && state.height > 0, prefix + 'positive physics viewport');
  assert.ok(Array.isArray(state.targets) && state.targets.length > 0, prefix + 'physics targets');
  assert.ok(Array.isArray(renderer.targets), prefix + 'projected targets');
  const ids = state.targets.map(t => t.id);
  assert.equal(new Set(ids).size, ids.length, prefix + 'unique physics IDs');
  const projected = new Map(renderer.targets.map(t => [t.id, t]));
  assert.equal(projected.size, renderer.targets.length, prefix + 'unique projected IDs');
  assert.equal(projected.size, ids.length, prefix + 'all targets projected');
  let maximum = 0;
  for (const target of state.targets) {
    const visual = projected.get(target.id);
    assert.ok(visual, prefix + `projected target ${target.id} exists`);
    for (const field of ['x', 'y', 'r']) {
      assert.ok(Number.isFinite(target[field]) && Number.isFinite(visual[field]),
        prefix + `target ${target.id}: finite ${field}`);
    }
    assert.ok(target.r > 0 && visual.r > 0, prefix + 'positive target radii');
    const error = Math.hypot(visual.x - target.x, visual.y - target.y);
    assert.ok(error <= 1, prefix + `target ${target.id}: ${error} CSS px > 1`);
    maximum = Math.max(maximum, error);
  }
  return { label, targets: ids.length, maximum, triangles: renderer.triangles };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const input = process.argv[2] || path.join(process.env.JD_EVIDENCE || 'evidence/archer-3d', 'archer-3d-snapshots.json');
  const evidence = JSON.parse(fs.readFileSync(input, 'utf8'));
  assert.equal(evidence.schema, 1, 'supported evidence schema');
  assert.ok(Array.isArray(evidence.samples), 'browser observations required');
  const required = ['landscape', 'portrait'].flatMap(mode =>
    ['gameplay', 'aim', 'flight', 'cancel', 'orientation', 'retry'].map(step => `${mode}-${step}`));
  const labels = evidence.samples.map(s => s.label);
  assert.equal(new Set(labels).size, labels.length, 'no duplicate observations');
  for (const label of required) assert.ok(labels.includes(label), `missing ${label}; run browser suite first`);
  const results = evidence.samples.map(assertAlignment);
  console.log(JSON.stringify({ passed: true, source: input, samples: results.length, results }, null, 2));
}
