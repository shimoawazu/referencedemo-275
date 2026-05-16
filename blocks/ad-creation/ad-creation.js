const WORKFLOW_ID = '341d116f-4c45-4585-b635-8c0c938c63be';
const EXECUTE_URL = 'https://run-workflow.adobe.io/batch/execute';
const STATUS_URL = 'https://run-workflow.adobe.io/batch/status';
const API_KEY = 'bulk-automation-web';
const IMS_ORG_ID = 'EE9332B3547CC74E0A4C98A1@AdobeOrg';
const IMS_USER_ID = 'C0F657EB5489DE240A4C98A5@adobe.com';
const POLL_INTERVAL_MS = 3000;

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
  const payload = {
    workflowId: WORKFLOW_ID,
    actions: [
      { actionId: 'node_1773092259_4401688f', actionType: 'input-images', name: 'Input Images', inputs: { images: [{ url: values['asset-url'], storageType: 'AEM' }] } },
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
      { actionId: 'node-1773470661819-ta5z8k4kl', actionType: 'merge-data', name: 'Merge InDesign data' },
      { actionId: 'node-1773470732553-pxcrvw7f4', actionType: 'merge-data', name: 'Merge InDesign data' },
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

  // 202 Accepted: 非同期処理開始 — ヘッダーからIDを取得
  if (res.status === 202 || bodyText.trim() === '') {
    return { _raw: { status: res.status, headers: headersObj } };
  }

  // 200 OK またはボディありの場合はJSONをパース
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
    if (!values['asset-url']) {
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

      const statusUrl = (result.links && result.links.status && result.links.status.href)
        ? result.links.status.href
        : `https://run-workflow.adobe.io/batches/${jobId}`;
      const resultUrl = `https://run-workflow.adobe.io/batches/${jobId}?format=preview`;
      // eslint-disable-next-line no-console
      console.log('[ad-creation] jobId:', jobId);
      // eslint-disable-next-line no-console
      console.log('[ad-creation] statusUrl:', statusUrl);
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
