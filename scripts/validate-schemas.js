#!/usr/bin/env node
/**
 * validate-schemas.js — v4
 *
 * Reads every workflow JSON, the tool index and the categories file,
 * and validates them against schemas/*.schema.json using Ajv.
 *
 * Exit code 1 on any validation failure, so it can gate PRs in CI.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

const workflowSchema = readJson(path.join(root, 'schemas/workflow.schema.json'));
const toolSchema     = readJson(path.join(root, 'schemas/tool.schema.json'));
const categorySchema = readJson(path.join(root, 'schemas/category.schema.json'));

const validateWorkflow = ajv.compile(workflowSchema);
const validateTool     = ajv.compile(toolSchema);
const validateCategory = ajv.compile(categorySchema);

let failed = 0;
const targets = process.argv.slice(2);

function report(label, errors) {
  console.error(`\n❌ ${label}`);
  for (const e of errors) {
    console.error(`   • ${e.instancePath || '(root)'} ${e.message}`);
  }
  failed++;
}

function validateWorkflowFile(file) {
  const data = readJson(file);
  if (!validateWorkflow(data)) return report(`workflow ${path.basename(file)}`, validateWorkflow.errors);
  const expectedId = path.basename(file, '.json');
  if (data.workflow !== expectedId) {
    return report(`workflow ${path.basename(file)}`, [{ message: `field 'workflow' (${data.workflow}) must match filename (${expectedId})` }]);
  }
  console.log(`✅ workflow: ${data.workflow} (${data.steps.length} step)`);
}

function validateIndex() {
  const file = path.join(root, 'orchestration/index.json');
  const arr = readJson(file);
  if (!Array.isArray(arr)) return report('orchestration/index.json', [{ message: 'must be an array' }]);
  let ok = 0;
  for (const tool of arr) {
    if (!validateTool(tool)) {
      report(`tool id=${tool.id ?? '?'} (${tool.name ?? 'unnamed'})`, validateTool.errors);
    } else {
      ok++;
    }
  }
  // duplicate id check
  const ids = arr.map((t) => t.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) report('orchestration/index.json', [{ message: `duplicate tool ids: ${[...new Set(dupes)].join(', ')}` }]);
  console.log(`✅ orchestration/index.json — ${ok}/${arr.length} tools valid`);
}

function validateCategories() {
  const file = path.join(root, 'orchestration/categories.json');
  const arr = readJson(file);
  let ok = 0;
  for (const cat of arr) {
    if (!validateCategory(cat)) report(`category id=${cat.id} (${cat.slug ?? '?'})`, validateCategory.errors);
    else ok++;
  }
  console.log(`✅ orchestration/categories.json — ${ok}/${arr.length} categories valid`);
}

if (targets.length) {
  for (const t of targets) validateWorkflowFile(path.resolve(t));
} else {
  const wfDir = path.join(root, 'orchestration/workflows');
  for (const f of fs.readdirSync(wfDir)) {
    if (f.endsWith('.json')) validateWorkflowFile(path.join(wfDir, f));
  }
  validateIndex();
  validateCategories();
}

if (failed) {
  console.error(`\n💥 ${failed} validation error(s).`);
  process.exit(1);
}
console.log('\n🎉 All schemas valid.');
