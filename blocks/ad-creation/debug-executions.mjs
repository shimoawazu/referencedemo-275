#!/usr/bin/env node
// 使い方: FIREFLY_TOKEN=xxx node debug-executions.mjs <batchId> [--download]

const TOKEN = process.env.FIREFLY_TOKEN;
const BATCH_ID = process.argv[2];
const DOWNLOAD = process.argv.includes('--download');

if (!TOKEN || !BATCH_ID) {
  console.error('使い方: FIREFLY_TOKEN=xxx node debug-executions.mjs <batchId> [--download]');
  process.exit(1);
}

const HEADERS = {
  'Authorization': `Bearer ${TOKEN}`,
  'x-api-key': 'bulk-automation-web',
  'x-gw-ims-org-id': 'EE9332B3547CC74E0A4C98A1@AdobeOrg',
  'x-gw-ims-user-id': 'C0F657EB5489DE240A4C98A5@adobe.com',
};

// ---- executions ----
const res = await fetch(
  `https://run-workflow.adobe.io/batches/${BATCH_ID}/executions`,
  { headers: HEADERS }
);
const data = await res.json();
const ex = data.executions?.[0];
if (!ex) { console.log('no executions (data expired or batchId wrong)'); process.exit(1); }

console.log('inputAsset.url:', ex.inputAsset?.url?.slice(0, 60));
console.log();

let success = 0, failed = 0;
ex.outputs?.forEach((a, i) => {
  const mark = a.status === 'failed' ? '❌' : (a.metadata?.skippedActivity ? '⏭ ' : '✅');
  const statusDetail = a.status !== 'completed' && a.status !== 'failed' ? ` [${a.status}]` : '';
  console.log(`[${String(i + 1).padStart(2, '0')}] ${mark}${statusDetail} [${a.actionType}] ${a.error || ''}`);
  if (a.status === 'failed') failed++; else success++;
});
console.log(`\n✅${success} / ❌${failed} / 全${ex.outputs?.length}ノード`);

// ---- preview で中間画像URLを取得 ----
console.log('\n--- 中間ノード出力URL ---');
const previewRes = await fetch(
  `https://run-workflow.adobe.io/batches/${BATCH_ID}?format=preview`,
  { headers: HEADERS }
);
const previewData = await previewRes.json();
const nodeOutputs = previewData?.outputs?.[0]?.outputs;

if (!Array.isArray(nodeOutputs)) {
  console.log('preview outputs not found');
  process.exit(0);
}

const KEY_NODES = {
  'remove-bg     ': 'node_1773092259_d8b8daa5',
  'gen-comp-1080 ': 'node-1773096710497-fe9mlcafp',
  'gen-comp-300  ': 'node-1773096749614-ogoqdrnpl',
  'crop-1080     ': 'node-1773206538730-vcjv8azwt',
  'crop-300      ': 'node_1773092721585_3xdjskbj2_11_luqyig',
  'apply-1080    ': 'node_1773092259_b389e634',
  'apply-300     ': 'node_1773092804901_gqlz8f6sb_15_q82prg',
  'MERGE-1080    ': 'node-1773470661819-ta5z8k4kl',
  'MERGE-300     ': 'node-1773470732553-pxcrvw7f4',
};

const downloads = [];
for (const [label, nodeId] of Object.entries(KEY_NODES)) {
  const entry = nodeOutputs.find(o => o.node_id === nodeId);
  const url = entry?.content?.presignedUrl;
  const status = entry?.status || '(not found)';
  console.log(`${label} [${status}]: ${url ? url.slice(0, 90) : '(no url)'}`);
  if (url && DOWNLOAD) downloads.push({ label: label.trim(), url });
}

// ---- --download 指定時は画像をローカル保存 ----
if (DOWNLOAD && downloads.length) {
  console.log('\n--- ダウンロード中 ---');
  const { writeFileSync } = await import('node:fs');
  for (const { label, url } of downloads) {
    const fname = `/tmp/wfb_${label.replace(/\s+/g, '_')}.png`;
    try {
      const r = await fetch(url);
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        writeFileSync(fname, buf);
        console.log(`  ${label}: saved ${buf.length} bytes → ${fname}`);
      } else {
        console.log(`  ${label}: HTTP ${r.status}`);
      }
    } catch (e) {
      console.log(`  ${label}: error ${e.message}`);
    }
  }
  console.log('\nopen ' + downloads.map(() => `/tmp/wfb_*.png`)[0].replace('*', ''));
}
