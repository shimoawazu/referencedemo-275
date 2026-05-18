const WORKFLOW_ID = '341d116f-4c45-4585-b635-8c0c938c63be';
// presigned URLs expire in 4 hours — update when expired
const TEMPLATE1_URL = 'https://acp-aep-cs-blobstore-prod-jpn3-data.adobe.io/7ae06770-c32d-4644-bb48-4be6253bba54?response-content-disposition=attachment%3B%20filename%3D%22819575c4ca5c4feebbaf24a09c669c59.indd%22&response-content-type=application%2Fx-indesign&x-user-client-id=clio-playground-web&x-region=jpn3&x-version-id=2&x-partition-prefix=21c1f4508dd461944043aa452c00f1047e9d127fd2488509c431ea86def8add9f9a3&x-resource-length=1163264&x-resource-id=5ac4d4548ad440b25815f74a0968f7097ee80b04d213a011b360ef8d8aa8b6d8a6aa6808&x-key-id=BN5JZ&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0xIkYwRAIgaHNuOJce6BMyjfn7mYgNxYWAYZIrxbJaRnEtiUsro8ACIGe3m0KqoSZoFSVz5Ws1TjobVXGd5iz8DjhVEuo2qJ8CKvQBCLL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMNzY2OTY5ODQ0MDc4Igwx6iw2D%2Fu%2FKTvTMToqyAESxD5CFTP%2FfVx%2F33oX%2BTyVDJGNxicOWS4SbSwUExOFVIVaPLVkd4syj1w%2F7qoDY88xXlJZHds%2B5NuQm6NStqvT7gEgBCqSyMcVudPbvTkDJO2PKZf4as6GrEqqlSQG2EuqMQn8E3JFmkivHekhjwFK4i1A2fdvARYUHt6TBeZ%2BYrF0JS%2F3ywWDPDhq5%2FQXIM%2Br3d01u3k4YFqrG68o2w%2Fy8BXLyh8ezEbaY3dQoD8uLVrlfI8CyaL3DqSsJEXMEpfvZypA8xDqCDCUzanQBjqZAbBWL0PD5iRxNBEUzQLYFV74ZMPhCqKcj730sgWtUqLeBrLDfkOfiVI7g59330%2BsV1d%2FLBFmR9qmmWJCPpsdF2R4SoKWTrTsPsJFPyMvkKYcz8wUqLm9QXAsrfTjBgZXKsGWb9laoMSx44GVNY7ndh0VdHi%2F9dniX%2B9QmXGCZ7ksoEZR5LwxVfe1FvN%2Btx%2B8%2BIf9J63VXJkAMQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260518T013304Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIA3FEXXCFXF3C3FHN5%2F20260518%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Expires=14400&X-Amz-Signature=630d5685d22c275bd617000eefaeb2e1ceb13ba704bb299362ccac39b6dc24f1';
const TEMPLATE2_URL = 'https://acp-aep-cs-blobstore-prod-jpn3-data.adobe.io/e23d7d16-4055-44ea-8c08-f14511976cf0?response-content-disposition=attachment%3B%20filename%3D%22c20918f1cb9648d6952493e7120e03ab.indd%22&response-content-type=application%2Fx-indesign&x-user-client-id=clio-playground-web&x-region=jpn3&x-version-id=2&x-partition-prefix=5e30ce09a3f257e45ea77ee48cdcd16a41e86d1a5dac071e6c69c516d2ecc6a9c36e&x-resource-length=1146880&x-resource-id=2c66b05df5f12b9246a171b8a9b4d73f489c746100f672061a6dc340d4ba8efb9f3be198&x-key-id=BN5JZ&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0xIkcwRQIhAI%2FM%2F2kvmb1jI8oRCPiAMwXFMYrIrBSxtNy7QJEI1gmkAiB7UFHqlkgzeQO8tpVimT3yL8hpx7dthxx6fdzgRXg4Uir0AQiy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAIaDDc2Njk2OTg0NDA3OCIMDZvZCcnZEU9NROjtKsgBFHIxxUGYhPnzOhu2JSOYfbTJGlhsLAEcn%2FWUmVrqXe8IhawwSZ8ynr9SIo4RmufGoRysSHgKwKd8ngfqOPysDF5gqPO7QlohMYdxbdON6ZXmDsgtFM9Pq%2Bbn2UQMbWtdc%2B%2B9TU5hlPPORH9jqNmUcIbYvABxJbY3t3a%2BjkdD%2Fr6V74Zj9w2%2FJ3RRAN5KBUCb0x3ZkXYP2XOW1Ge3V084eWWhUdnLONb1S2YOysShU9yjmMQdKWlyI3ue4ZkQK1hB49Zy%2F6BoAxQw8Mqp0AY6mAHo4A9csFpm%2By0vvF1iMKkxfeH%2FmGl9i%2BtCRK%2BAha9uoTx5r%2F8uqPshjBThN0Gejx66QbQpuvXqv6m4rd%2BiW6pNW2L5Mf9R7jQS%2BIWmu8%2FFA7otiD%2F4z63OvdcYcjA6aNHVMU06funexjwEhXaVegKOf4zxvXcET1Y89x9FfIZ7wWxcuvAT8qqbeQ9eQLobEA5WNAiO3J4sGQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260518T013304Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIA3FEXXCFXBS6BNWM5%2F20260518%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Expires=14400&X-Amz-Signature=fcb93cb7006d3254e53f7b525924370f5e17c53716f516e6a3269d1265306e62';
const EXECUTE_URL = 'https://run-workflow.adobe.io/batch/execute';
const STATUS_URL = 'https://run-workflow.adobe.io/batch/status';
const API_KEY = 'bulk-automation-web';
const IMS_ORG_ID = 'EE9332B3547CC74E0A4C98A1@AdobeOrg';
const IMS_USER_ID = 'C0F657EB5489DE240A4C98A5@adobe.com';
const POLL_INTERVAL_MS = 3000;
// 【デバッグ用 — 問題1の切り分け】空でない場合はフォーム入力より優先される
// 実際のAEM DAM画像URLを設定して動作確認後 '' に戻す
// 例: 'https://author-p154442-e1620921.adobeaemcloud.com/content/dam/referencedemo-275/image.jpg'
const DEBUG_ASSET_URL = 'https://author-p154442-e1620921.adobeaemcloud.com/content/dam/referencedemo-275/dunlop-tire.jpg';

const CONNECTIONS = [
  { connectionId: 'xy-edge__node_1773092259_4401688f_outputs-node_1773092259_d8b8daa5_input-images', connectionSource: 'node_1773092259_4401688f', connectionTarget: 'node_1773092259_d8b8daa5', sourcePort: 'outputs', targetPort: 'input-images' },
  { connectionId: 'xy-edge__node_1773092804901_gqlz8f6sb_15_q82prgoutputs-node_1773095380471_3md5k3sji_17_5bvvzsinput-images', connectionSource: 'node_1773092804901_gqlz8f6sb_15_q82prg', connectionTarget: 'node_1773095380471_3md5k3sji_17_5bvvzs', sourcePort: 'outputs', targetPort: 'input-images' },
  { connectionId: 'xy-edge__node_1773092259_b389e634outputs-node_1773092542293_z6xhiceq7_10_ryzolkinput-images', connectionSource: 'node_1773092259_b389e634', connectionTarget: 'node_1773092542293_z6xhiceq7_10_ryzolk', sourcePort: 'outputs', targetPort: 'input-images' },
  { connectionId: 'xy-edge__node_1773092259_5cb8c7d8outputs-node-1773096710497-fe9mlcafpprompt', connectionSource: 'node_1773092259_5cb8c7d8', connectionTarget: 'node-1773096710497-fe9mlcafp', sourcePort: 'outputs', targetPort: 'prompt' },
  { connectionId: 'xy-edge__node_1773092731405_0yy3d3iyl_12_7tz1yzoutputs-node-1773096749614-ogoqdrnplprompt', connectionSource: 'node_1773092731405_0yy3d3iyl_12_7tz1yz', connectionTarget: 'node-1773096749614-ogoqdrnpl', sourcePort: 'outputs', targetPort: 'prompt' },
  { connectionId: 'xy-edge__node_1773092259_d8b8daa5outputs-node-1773096710497-fe9mlcafpinput-images', connectionSource: 'node_1773092259_d8b8daa5', connectionTarget: 'node-1773096710497-fe9mlcafp', sourcePort: 'outputs', targetPort: 'input-images' },
  { connectionId: 'xy-edge__node-1773206538730-vcjv8azwtoutputs-node_1773092259_b389e634input-images', connectionSource: 'node-1773206538730-vcjv8azwt', connectionTarget: 'node_1773092259_b389e634', sourcePort: 'outputs', targetPort: 'input-images' },
  { connectionId: 'xy-edge__node-1773096710497-fe9mlcafpoutputs-node-1773206538730-vcjv8azwtinput-images', connectionSource: 'node-1773096710497-fe9mlcafp', connectionTarget: 'node-1773206538730-vcjv8azwt', sourcePort: 'outputs', targetPort: 'input-images' },
  { connectionId: 'xy-edge__node_1773092259_d8b8daa5outputs-node-1773096749614-ogoqdrnplinput-images', connectionSource: 'node_1773092259_d8b8daa5', connectionTarget: 'node-1773096749614-ogoqdrnpl', sourcePort: 'outputs', targetPort: 'input-images' },
  { connectionId: 'xy-edge__node-1773096749614-ogoqdrnploutputs-node_1773092721585_3xdjskbj2_11_luqyiginput-images', connectionSource: 'node-1773096749614-ogoqdrnpl', connectionTarget: 'node_1773092721585_3xdjskbj2_11_luqyig', sourcePort: 'outputs', targetPort: 'input-images' },
  { connectionId: 'xy-edge__node_1773092721585_3xdjskbj2_11_luqyigoutputs-node_1773092804901_gqlz8f6sb_15_q82prginput-images', connectionSource: 'node_1773092721585_3xdjskbj2_11_luqyig', connectionTarget: 'node_1773092804901_gqlz8f6sb_15_q82prg', sourcePort: 'outputs', targetPort: 'input-images' },
  { connectionId: 'xy-edge__node_1773092259_b389e634outputs-node-1773470661819-ta5z8k4klbackground', connectionSource: 'node_1773092259_b389e634', connectionTarget: 'node-1773470661819-ta5z8k4kl', sourcePort: 'outputs', targetPort: 'background' },
  { connectionId: 'xy-edge__node-1773092472186-j1e8zgjogoutputs-node-1773470661819-ta5z8k4klsub-heading', connectionSource: 'node-1773092472186-j1e8zgjog', connectionTarget: 'node-1773470661819-ta5z8k4kl', sourcePort: 'outputs', targetPort: 'sub-heading' },
  { connectionId: 'xy-edge__node_1773092491358_7di1in5h1_9_k2gyjzoutputs-node-1773470661819-ta5z8k4klheading', connectionSource: 'node_1773092491358_7di1in5h1_9_k2gyjz', connectionTarget: 'node-1773470661819-ta5z8k4kl', sourcePort: 'outputs', targetPort: 'heading' },
  { connectionId: 'xy-edge__node_1773092804901_gqlz8f6sb_15_q82prgoutputs-node-1773470732553-pxcrvw7f4background', connectionSource: 'node_1773092804901_gqlz8f6sb_15_q82prg', connectionTarget: 'node-1773470732553-pxcrvw7f4', sourcePort: 'outputs', targetPort: 'background' },
  { connectionId: 'xy-edge__node_1773207589592_a1g95pe6x_18_nq3u4koutputs-node-1773470732553-pxcrvw7f4sub-heading', connectionSource: 'node_1773207589592_a1g95pe6x_18_nq3u4k', connectionTarget: 'node-1773470732553-pxcrvw7f4', sourcePort: 'outputs', targetPort: 'sub-heading' },
  { connectionId: 'xy-edge__node-1773470732553-pxcrvw7f4output-node_1773092883378_vgxanpe1i_16_qabxluinput-images', connectionSource: 'node-1773470732553-pxcrvw7f4', connectionTarget: 'node_1773092883378_vgxanpe1i_16_qabxlu', sourcePort: 'output', targetPort: 'input-images' },
  { connectionId: 'xy-edge__node-1773470661819-ta5z8k4kloutput-node_1773092259_7ad98bc5input-images', connectionSource: 'node-1773470661819-ta5z8k4kl', connectionTarget: 'node_1773092259_7ad98bc5', sourcePort: 'output', targetPort: 'input-images' },
  { connectionId: 'xy-edge__node_1773207613701_hb43tfsgx_19_dmfuefoutputs-node-1773470732553-pxcrvw7f4heading', connectionSource: 'node_1773207613701_hb43tfsgx_19_dmfuef', connectionTarget: 'node-1773470732553-pxcrvw7f4', sourcePort: 'outputs', targetPort: 'heading' },
];

const FIELDS = [
  { id: 'bearer-token', label: 'Bearer Token', type: 'password', placeholder: 'eyJhbGci...' },
  { id: 'asset-url', label: 'Input画像（AEM Assets URL）', type: 'url', placeholder: 'https://author-p154442-e1620921.adobeaemcloud.com/content/dam/...', preview: true },
  { id: 'prompt-1', label: 'Prompt 1', type: 'textarea', placeholder: 'テキストを入力...', nodeId: 'node_1773092259_5cb8c7d8' },
  { id: 'prompt-2', label: 'Prompt 2', type: 'textarea', placeholder: 'テキストを入力...', nodeId: 'node-1773092472186-j1e8zgjog' },
  { id: 'heading-1', label: 'Heading Text 1', type: 'text', placeholder: 'メインタイトル', nodeId: 'node_1773092491358_7di1in5h1_9_k2gyjz' },
  { id: 'sub-heading-1', label: 'Sub-Heading Text 1', type: 'text', placeholder: 'サブタイトル', nodeId: 'node_1773092731405_0yy3d3iyl_12_7tz1yz' },
  { id: 'heading-2', label: 'Heading Text 2', type: 'text', placeholder: 'メインタイトル 2', nodeId: 'node_1773207589592_a1g95pe6x_18_nq3u4k' },
  { id: 'sub-heading-2', label: 'Sub-Heading Text 2', type: 'text', placeholder: 'サブタイトル 2', nodeId: 'node_1773207613701_hb43tfsgx_19_dmfuef' },
];

function buildPayload(values) {
  const assetUrl = DEBUG_ASSET_URL || values['asset-url'];
  // eslint-disable-next-line no-console
  console.log(
    '[ad-creation] assetUrl used:',
    assetUrl || '(EMPTY — input-images will be skipped)',
    DEBUG_ASSET_URL ? '← HARDCODED (DEBUG_ASSET_URL)' : '← from form input',
  );
  const payload = {
    workflowId: WORKFLOW_ID,
    actions: [
      { actionId: 'node_1773092259_4401688f', actionType: 'input-images', name: 'Input Images', inputs: { images: [{ source: { url: assetUrl, storageType: 'AEM' } }] } },
      { actionId: 'node_1773092259_d8b8daa5', actionType: 'remove-background', name: 'Remove Background' },
      { actionId: 'node_1773092259_5cb8c7d8', actionType: 'input-text', name: 'Input Text', parameters: { text: values['prompt-1'] } },
      { actionId: 'node_1773092259_b389e634', actionType: 'apply-edits', name: 'Apply Edits' },
      { actionId: 'node_1773092259_7ad98bc5', actionType: 'preview-images', name: 'preview-images' },
      { actionId: 'node-1773092472186-j1e8zgjog', actionType: 'input-text', name: 'Input Text', parameters: { text: values['prompt-2'] } },
      { actionId: 'node_1773092491358_7di1in5h1_9_k2gyjz', actionType: 'input-text', name: 'Input text', parameters: { text: values['heading-1'] } },
      { actionId: 'node_1773092542293_z6xhiceq7_10_ryzolk', actionType: 'preview-images', name: 'preview-images' },
      { actionId: 'node_1773092721585_3xdjskbj2_11_luqyig', actionType: 'crop', name: 'Crop Image' },
      { actionId: 'node_1773092731405_0yy3d3iyl_12_7tz1yz', actionType: 'input-text', name: 'Input text', parameters: { text: values['sub-heading-1'] } },
      { actionId: 'node_1773092804901_gqlz8f6sb_15_q82prg', actionType: 'apply-edits', name: 'Apply Edits' },
      { actionId: 'node_1773092883378_vgxanpe1i_16_qabxlu', actionType: 'preview-images', name: 'preview-images' },
      { actionId: 'node_1773095380471_3md5k3sji_17_5bvvzs', actionType: 'preview-images', name: 'preview-images' },
      { actionId: 'node-1773096710497-fe9mlcafp', actionType: 'gen-object-composite' },
      { actionId: 'node-1773096749614-ogoqdrnpl', actionType: 'gen-object-composite' },
      { actionId: 'node-1773206538730-vcjv8azwt', actionType: 'crop', name: 'Crop Image' },
      { actionId: 'node_1773207589592_a1g95pe6x_18_nq3u4k', actionType: 'input-text', name: 'Input Text', parameters: { text: values['heading-2'] } },
      { actionId: 'node_1773207613701_hb43tfsgx_19_dmfuef', actionType: 'input-text', name: 'Input Text', parameters: { text: values['sub-heading-2'] } },
      {
        actionId: 'node-1773470661819-ta5z8k4kl',
        actionType: 'merge-data',
        name: 'Merge InDesign data',
        parameters: {
          fileName: '1080x1080_Dunlop.indd',
          title: '1080x1080_Dunlop.indd',
          templates: [{ name: '1080x1080_Dunlop.indd', mimeType: 'application/x-indesign', storageType: 'external', url: TEMPLATE1_URL }],
          output: { storageType: 'Azure', type: 'image/png' },
          outputMediaType: 'image/png',
          outputFileBaseString: '1080x1080_Dunlop',
          recordRange: 'All',
          removeBlankLines: false,
          allowMultipleRecordsPerPage: false,
          convertUrlToHyperlink: true,
          imagePlacementOptions: { centerImage: false, fittingOption: 'proportional', linkImages: false },
          exportSettings: { quality: 'medium' },
          fontDirectories: [],
          hyphenationSettings: { zone: 0 },
          // heading port ← heading-1, sub-heading port ← prompt-2 (per WFB connections)
          records: [{ heading: values['heading-1'] || '', 'sub-heading': values['prompt-2'] || '' }],
        },
      },
      {
        actionId: 'node-1773470732553-pxcrvw7f4',
        actionType: 'merge-data',
        name: 'Merge InDesign data',
        parameters: {
          fileName: '300x600_Dunlop.indd',
          title: '300x600_Dunlop.indd',
          templates: [{ name: '300x600_Dunlop.indd', mimeType: 'application/x-indesign', storageType: 'external', url: TEMPLATE2_URL }],
          output: { storageType: 'Azure', type: 'image/png' },
          outputMediaType: 'image/png',
          outputFileBaseString: '300x600_Dunlop',
          recordRange: 'All',
          removeBlankLines: false,
          allowMultipleRecordsPerPage: false,
          convertUrlToHyperlink: true,
          imagePlacementOptions: { centerImage: false, fittingOption: 'proportional', linkImages: false },
          exportSettings: { quality: 'medium' },
          fontDirectories: [],
          hyphenationSettings: { zone: 0 },
          // heading port ← sub-heading-2, sub-heading port ← heading-2 (per WFB connections)
          records: [{ heading: values['sub-heading-2'] || '', 'sub-heading': values['heading-2'] || '' }],
        },
      },
    ],
    connections: CONNECTIONS,
    debug: false,
    extract_images: true,
    metadata: {
      workflowId: WORKFLOW_ID,
      name: 'Ad Creation May 16',
      version: '2.0.0',
    },
  };
  // eslint-disable-next-line no-console
  console.log('[ad-creation] workflowId:', payload.workflowId);
  // eslint-disable-next-line no-console
  console.log('[ad-creation] payload:', JSON.stringify(payload, null, 2));
  return payload;
}

async function executeWorkflow(token, payload) {
  const res = await fetch(EXECUTE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-api-key': API_KEY,
      'x-gw-ims-org-id': IMS_ORG_ID,
      'x-gw-ims-user-id': IMS_USER_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // レスポンスのデバッグ情報を出力
  const headersObj = {};
  res.headers.forEach((v, k) => { headersObj[k] = v; });
  // eslint-disable-next-line no-console
  console.log('[ad-creation] execute status:', res.status);
  // eslint-disable-next-line no-console
  console.log('[ad-creation] execute headers:', headersObj);

  const bodyText = await res.text();
  // eslint-disable-next-line no-console
  console.log('[ad-creation] execute body:', bodyText || '(empty)');

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${bodyText}`);
  }

  const raw = { _raw: { status: res.status, headers: headersObj } };

  // 202 Accepted: ボディがあればJSONパースしてlinks.status.hrefを取得
  if (res.status === 202) {
    if (bodyText.trim()) {
      try {
        return { ...JSON.parse(bodyText), ...raw };
      } catch (e) { /* パース失敗は無視してrawのみ返す */ }
    }
    return raw;
  }

  if (!bodyText.trim()) {
    return raw;
  }

  // 200 OK: JSONをパース
  try {
    return JSON.parse(bodyText);
  } catch (e) {
    throw new Error(`JSONパースエラー: ${bodyText}`);
  }
}

async function pollStatus(token, statusUrl) {
  const res = await fetch(statusUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-api-key': API_KEY,
      'x-gw-ims-org-id': IMS_ORG_ID,
    },
  });
  if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
  return res.json();
}

function createFormField(field) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ad-creation-field';

  const label = document.createElement('label');
  label.htmlFor = field.id;
  label.textContent = field.label;
  if (field.nodeId) {
    const hint = document.createElement('span');
    hint.className = 'ad-creation-node-id';
    hint.textContent = field.nodeId;
    label.append(hint);
  }

  let input;
  if (field.type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 3;
  } else {
    input = document.createElement('input');
    input.type = field.type;
  }
  input.id = field.id;
  input.name = field.id;
  input.placeholder = field.placeholder || '';

  wrapper.append(label, input);

  if (field.preview) {
    const preview = document.createElement('img');
    preview.className = 'ad-creation-image-preview';
    preview.hidden = true;
    preview.alt = 'プレビュー';
    input.addEventListener('input', () => {
      const val = input.value.trim();
      preview.hidden = !val;
      if (val) preview.src = val;
    });
    wrapper.append(preview);
  }

  return wrapper;
}

function setStatus(statusEl, message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = `ad-creation-status ad-creation-status--${type}`;
  statusEl.hidden = !message;
}

function renderOutputImages(outputEl, outputs, resultUrl) {
  outputEl.innerHTML = '';

  // resultUrl へのリンクを表示
  if (resultUrl) {
    const resultLink = document.createElement('p');
    resultLink.className = 'ad-creation-result-link';
    const anchor = document.createElement('a');
    anchor.href = resultUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = '結果を確認する（プレビューURL）';
    resultLink.append(anchor);
    outputEl.append(resultLink);
  }

  const sizes = [
    { key: 'image_300x600', label: '300 × 600', w: 300, h: 600 },
    { key: 'image_1080x1080', label: '1080 × 1080', w: 1080, h: 1080 },
  ];

  sizes.forEach(({ key, label, w, h }) => {
    const url = outputs?.[key] || outputs?.outputs?.[key];
    if (!url) return;

    const card = document.createElement('div');
    card.className = 'ad-creation-output-card';

    const title = document.createElement('p');
    title.className = 'ad-creation-output-label';
    title.textContent = label;

    const img = document.createElement('img');
    img.src = url;
    img.alt = label;
    img.width = w;
    img.height = h;
    img.loading = 'lazy';

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'ダウンロード';
    link.className = 'ad-creation-download';

    card.append(title, img, link);
    outputEl.append(card);
  });

  if (!outputEl.children.length) {
    outputEl.textContent = '出力画像が見つかりませんでした。';
  }
}

async function startPolling(token, jobId, statusUrl, resultUrl, statusEl, outputEl, submitBtn) {
  let attempts = 0;
  const maxAttempts = 60;

  const poll = async () => {
    attempts += 1;
    if (attempts > maxAttempts) {
      setStatus(statusEl, 'タイムアウト: ジョブが完了しませんでした。', 'error');
      submitBtn.disabled = false;
      return;
    }
    try {
      const data = await pollStatus(token, statusUrl);
      // eslint-disable-next-line no-console
      console.log('[ad-creation] poll response:', data);
      const status = (data.status || data.state || '').toLowerCase();

      if (status === 'completed' || status === 'succeeded' || status === 'success') {
        setStatus(statusEl, '完了しました！', 'success');
        renderOutputImages(outputEl, data.outputs || data, resultUrl);
        submitBtn.disabled = false;
      } else if (status === 'failed' || status === 'error') {
        setStatus(statusEl, `エラー: ${data.error || data.message || '不明なエラー'}`, 'error');
        submitBtn.disabled = false;
      } else {
        setStatus(statusEl, `処理中... (${status || 'pending'}) [${attempts}/${maxAttempts}]`, 'pending');
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    } catch (err) {
      // TypeError: Failed to fetch はCORSまたはネットワークエラー
      if (err instanceof TypeError) {
        setStatus(
          statusEl,
          `処理中です。数分後に結果を確認してください。バッチID: ${jobId}`,
          'pending',
        );
        submitBtn.disabled = false;
      } else {
        setStatus(statusEl, `ポーリングエラー: ${err.message}`, 'error');
        submitBtn.disabled = false;
      }
    }
  };

  setTimeout(poll, POLL_INTERVAL_MS);
}

export default function decorate(block) {
  // component-models.json field name → form field ID mapping
  const AUE_PROP_TO_FIELD_ID = {
    inputImage: 'asset-url',
    assetUrl: 'asset-url',
    prompt1: 'prompt-1',
    prompt2: 'prompt-2',
    headingText1: 'heading-1',
    subHeadingText1: 'sub-heading-1',
    headingText2: 'heading-2',
    subHeadingText2: 'sub-heading-2',
  };

  const authoredValues = {};

  // Primary: data-aue-prop attributes (Universal Editor editor context)
  block.querySelectorAll('[data-aue-prop]').forEach((el) => {
    const prop = el.getAttribute('data-aue-prop');
    const fieldId = AUE_PROP_TO_FIELD_ID[prop];
    if (!fieldId) return;
    const link = el.querySelector('a');
    const img = el.querySelector('img') || (el.tagName === 'IMG' ? el : null);
    let val;
    if (link) val = link.href || link.textContent.trim();
    else if (img) val = img.src.split('?')[0]; // strip EDS image optimization params
    else val = el.textContent.trim();
    if (val) authoredValues[fieldId] = val;
  });

  // Fallback: row/cell table structure (published page without UE attributes)
  // model fields order: inputImage, prompt1, prompt2, headingText1, subHeadingText1, headingText2, subHeadingText2
  if (Object.keys(authoredValues).length === 0) {
    const fieldOrder = ['asset-url', 'prompt-1', 'prompt-2', 'heading-1', 'sub-heading-1', 'heading-2', 'sub-heading-2'];
    [...block.children].forEach((row, i) => {
      if (i >= fieldOrder.length) return;
      const cells = [...row.children];
      const cell = cells[cells.length - 1];
      if (!cell) return;
      const link = cell.querySelector('a');
      const img = cell.querySelector('img') || (cell.tagName === 'IMG' ? cell : null);
      let val;
      if (link) val = link.href || link.textContent.trim();
      else if (img) val = img.src.split('?')[0];
      else val = cell.textContent.trim();
      if (val) authoredValues[fieldOrder[i]] = val;
    });
  }

  // eslint-disable-next-line no-console
  console.log('[ad-creation] authoredValues:', authoredValues);
  // eslint-disable-next-line no-console
  console.log('[ad-creation] asset-url from block:', authoredValues['asset-url'] || '(not found in block)');
  // eslint-disable-next-line no-console
  console.log('[ad-creation] DEBUG_ASSET_URL:', DEBUG_ASSET_URL ? `ACTIVE → ${DEBUG_ASSET_URL}` : 'inactive (using form input)');

  block.innerHTML = '';

  const form = document.createElement('form');
  form.className = 'ad-creation-form';
  form.noValidate = true;

  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = 'Ad Creation — Firefly Workflow';
  fieldset.append(legend);

  FIELDS.forEach((field) => fieldset.append(createFormField(field)));

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = '生成する';
  submitBtn.className = 'ad-creation-submit';

  const statusEl = document.createElement('p');
  statusEl.className = 'ad-creation-status';
  statusEl.hidden = true;

  const outputEl = document.createElement('div');
  outputEl.className = 'ad-creation-output';

  fieldset.append(submitBtn);
  form.append(fieldset, statusEl, outputEl);
  block.append(form);

  // Pre-populate form fields with values authored in Universal Editor
  Object.entries(authoredValues).forEach(([id, val]) => {
    const el = form.querySelector(`#${id}`);
    if (el && val) {
      el.value = val;
      // Trigger input event for fields with preview (e.g. asset-url)
      el.dispatchEvent(new Event('input'));
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    outputEl.innerHTML = '';

    const values = {};
    FIELDS.forEach(({ id }) => {
      const el = form.querySelector(`#${id}`);
      values[id] = el?.value?.trim() || '';
    });

    if (!values['bearer-token']) {
      setStatus(statusEl, 'Bearer Token を入力してください。', 'error');
      return;
    }
    if (!DEBUG_ASSET_URL && !values['asset-url']) {
      setStatus(statusEl, 'AEM Assets URL を入力してください。', 'error');
      return;
    }
    submitBtn.disabled = true;
    setStatus(statusEl, 'ワークフローを開始しています...', 'pending');

    try {
      const payload = buildPayload(values);
      const result = await executeWorkflow(values['bearer-token'], payload);
      // eslint-disable-next-line no-console
      console.log('[ad-creation] parsed result:', result);
      // eslint-disable-next-line no-console
      console.log('[ad-creation] result.links:', result.links || '(none)');

      const rawHeaders = (result._raw && result._raw.headers) ? result._raw.headers : {};
      const jobId = rawHeaders['x-session-id']
        || rawHeaders['x-batch-id']
        || result.jobId
        || result.id
        || result.batchId;

      if (!jobId) {
        setStatus(statusEl, `バッチIDが取得できませんでした。レスポンス: ${JSON.stringify(result)}`, 'error');
        submitBtn.disabled = false;
        return;
      }

      const linksStatusHref = result.links && result.links.status && result.links.status.href;
      const statusUrl = linksStatusHref || `https://run-workflow.adobe.io/batches/${jobId}`;
      const resultUrl = `https://run-workflow.adobe.io/batches/${jobId}?format=preview`;
      // eslint-disable-next-line no-console
      console.log('[ad-creation] jobId:', jobId);
      // eslint-disable-next-line no-console
      console.log('[ad-creation] statusUrl:', statusUrl, linksStatusHref ? '(from links.status.href)' : '(fallback from x-session-id)');
      // eslint-disable-next-line no-console
      console.log('[ad-creation] resultUrl:', resultUrl);

      setStatus(statusEl, `ジョブ開始: ${jobId} — ステータスを確認中...`, 'pending');
      startPolling(values['bearer-token'], jobId, statusUrl, resultUrl, statusEl, outputEl, submitBtn);
    } catch (err) {
      setStatus(statusEl, `エラー: ${err.message}`, 'error');
      submitBtn.disabled = false;
    }
  });
}
