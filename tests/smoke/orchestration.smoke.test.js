/**
 * Smoke tests — node --test compatible (no extra deps needed for CI).
 * Validates the high-level invariants of the catalog.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('.', import.meta.url).pathname, '../..');
const index = JSON.parse(fs.readFileSync(path.join(root, 'orchestration/index.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(root, 'orchestration/categories.json'), 'utf8'));
const wfDir = path.join(root, 'orchestration/workflows');
const workflows = fs.readdirSync(wfDir).filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(wfDir, f), 'utf8')));

test('tool index has unique ids', () => {
  const ids = index.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate tool ids');
});

test('every category slug is unique', () => {
  const slugs = categories.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'duplicate category slugs');
});

test('every workflow step references an existing tool id', () => {
  const ids = new Set(index.map((t) => t.id));
  for (const wf of workflows) {
    for (const step of wf.steps) {
      assert.ok(ids.has(step.tool_id), `workflow ${wf.workflow} step ${step.order} → unknown tool_id=${step.tool_id}`);
    }
  }
});

test('every tool category exists in categories.json', () => {
  const slugs = new Set(categories.map((c) => c.slug));
  for (const t of index) {
    assert.ok(slugs.has(t.category), `tool ${t.id} (${t.name}) → unknown category slug=${t.category}`);
  }
});

test('no workflow references a deprecated tool', () => {
  const deprecated = new Set(index.filter((t) => t.lifecycle === 'deprecated').map((t) => t.id));
  for (const wf of workflows) {
    for (const step of wf.steps) {
      assert.ok(!deprecated.has(step.tool_id),
        `workflow ${wf.workflow} step ${step.order} uses deprecated tool ${step.tool_id}`);
    }
  }
});
