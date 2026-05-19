#!/usr/bin/env node
// 使い方: FIREFLY_TOKEN=xxx node debug-executions.mjs <batchId>

const TOKEN = process.env.FIREFLY_TOKEN;
const BATCH_ID = process.argv[2];

if (!TOKEN || !BATCH_ID) {
  console.error('使い方: FIREFLY_TOKEN=xxx node debug-executions.mjs <batchId>');
  process.exit(1);
}

const res = await fetch(
  `https://run-workflow.adobe.io/batches/${BATCH_ID}/executions`,
  { headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'x-api-key': 'bulk-automation-web',
    'x-gw-ims-org-id': 'EE9332B3547CC74E0A4C98A1@AdobeOrg',
    'x-gw-ims-user-id': 'C0F657EB5489DE240A4C98A5@adobe.com'
  }}
);
const data = await res.json();
const ex = data.executions?.[0];
if (!ex) { console.log('no executions'); process.exit(1); }

console.log('inputAsset.url:', ex.inputAsset?.url?.slice(0,60));
console.log();
let success=0, failed=0;
ex.outputs?.forEach((a,i) => {
  const mark = a.status==='failed' ? '❌' : (a.metadata?.skippedActivity ? '⏭ ' : '✅');
  console.log(`[${String(i+1).padStart(2,'0')}] ${mark} [${a.actionType}] ${a.error||''}`);
  a.status==='failed' ? failed++ : success++;
});
console.log(`\n✅${success} / ❌${failed} / 全${ex.outputs?.length}ノード`);
