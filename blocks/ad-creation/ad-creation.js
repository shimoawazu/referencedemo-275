const WORKFLOW_ID = '4ab22ff7-afee-4b8b-afd4-06f3a7a668b1';
const EXECUTE_URL = 'https://run-workflow.adobe.io/batch/execute';
const STATUS_URL = 'https://run-workflow.adobe.io/batch/status';
const API_KEY = 'bulk-automation-web';
const IMS_ORG_ID = 'EE9332B3547CC74E0A4C98A1@AdobeOrg';
const POLL_INTERVAL_MS = 3000;

const FIELDS = [
  { id: 'bearer-token', label: 'Bearer Token', type: 'password', placeholder: 'eyJhbGci...' },
  { id: 'image-url-1', label: 'Input画像URL 1', type: 'url', placeholder: 'https://...' },
  { id: 'image-url-2', label: 'Input画像URL 2', type: 'url', placeholder: 'https://...' },
  { id: 'prompt-1', label: 'Prompt 1', type: 'textarea', placeholder: 'テキストを入力...', nodeId: 'node_1773092259_5cb8c7d8' },
  { id: 'prompt-2', label: 'Prompt 2', type: 'textarea', placeholder: 'テキストを入力...', nodeId: 'node-1773092472186-j1e8zgjog' },
  { id: 'heading-1', label: 'Heading Text 1', type: 'text', placeholder: 'メインタイトル', nodeId: 'node_1773092491358_7di1in5h1_9_k2gyjz' },
  { id: 'sub-heading-1', label: 'Sub-Heading Text 1', type: 'text', placeholder: 'サブタイトル', nodeId: 'node_1773092731405_0yy3d3iyl_12_7tz1yz' },
  { id: 'heading-2', label: 'Heading Text 2', type: 'text', placeholder: 'メインタイトル 2', nodeId: 'node_1773207589592_a1g95pe6x_18_nq3u4k' },
  { id: 'sub-heading-2', label: 'Sub-Heading Text 2', type: 'text', placeholder: 'サブタイトル 2', nodeId: 'node_1773207613701_hb43tfsgx_19_dmfuef' },
];

function buildPayload(values) {
  return {
    workflowId: WORKFLOW_ID,
    inputs: {
      image_url_1: values['image-url-1'],
      image_url_2: values['image-url-2'],
      [FIELDS.find((f) => f.id === 'prompt-1').nodeId]: values['prompt-1'],
      [FIELDS.find((f) => f.id === 'prompt-2').nodeId]: values['prompt-2'],
      [FIELDS.find((f) => f.id === 'heading-1').nodeId]: values['heading-1'],
      [FIELDS.find((f) => f.id === 'sub-heading-1').nodeId]: values['sub-heading-1'],
      [FIELDS.find((f) => f.id === 'heading-2').nodeId]: values['heading-2'],
      [FIELDS.find((f) => f.id === 'sub-heading-2').nodeId]: values['sub-heading-2'],
    },
  };
}

async function executeWorkflow(token, payload) {
  const res = await fetch(EXECUTE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-api-key': API_KEY,
      'x-gw-ims-org-id': IMS_ORG_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

async function pollStatus(token, jobId) {
  const res = await fetch(`${STATUS_URL}/${jobId}`, {
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
  return wrapper;
}

function setStatus(statusEl, message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = `ad-creation-status ad-creation-status--${type}`;
  statusEl.hidden = !message;
}

function renderOutputImages(outputEl, outputs) {
  outputEl.innerHTML = '';
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

async function startPolling(token, jobId, statusEl, outputEl, submitBtn) {
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
      const data = await pollStatus(token, jobId);
      const status = (data.status || data.state || '').toLowerCase();

      if (status === 'completed' || status === 'succeeded' || status === 'success') {
        setStatus(statusEl, '完了しました！', 'success');
        renderOutputImages(outputEl, data.outputs || data);
        submitBtn.disabled = false;
      } else if (status === 'failed' || status === 'error') {
        setStatus(statusEl, `エラー: ${data.error || data.message || '不明なエラー'}`, 'error');
        submitBtn.disabled = false;
      } else {
        setStatus(statusEl, `処理中... (${status || 'pending'}) [${attempts}/${maxAttempts}]`, 'pending');
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    } catch (err) {
      setStatus(statusEl, `ポーリングエラー: ${err.message}`, 'error');
      submitBtn.disabled = false;
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

    submitBtn.disabled = true;
    setStatus(statusEl, 'ワークフローを開始しています...', 'pending');

    try {
      const payload = buildPayload(values);
      const result = await executeWorkflow(values['bearer-token'], payload);
      const jobId = result.jobId || result.id || result.batchId;

      if (!jobId) {
        setStatus(statusEl, `予期しないレスポンス: ${JSON.stringify(result)}`, 'error');
        submitBtn.disabled = false;
        return;
      }

      setStatus(statusEl, `ジョブ開始: ${jobId} — ステータスを確認中...`, 'pending');
      startPolling(values['bearer-token'], jobId, statusEl, outputEl, submitBtn);
    } catch (err) {
      setStatus(statusEl, `エラー: ${err.message}`, 'error');
      submitBtn.disabled = false;
    }
  });
}
