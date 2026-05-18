# Adobe Firefly Workflow API × AEM EDS 統合 知見まとめ

**作成日:** 2026-05-17  
**プロジェクト:** referencedemo-275 / Ad Creation Block

---

## 1. 全体構成

```
AEM Universal Editor
  └── EDS Block (blocks/ad-creation/)
        └── Firefly Workflow API
              └── Adobe Firefly Workflow Builder (Ad Creation May 16)
```

---

## 2. 認証

### トークン種別
- **方式:** ユーザーセッショントークン（OAuth）
- **取得方法:** `firefly.adobe.com` のブラウザセッションから取得
- **有効期限:** 約8時間（28,800秒）
- **client_id:** `clio-playground-web`（WFB内部）

### トークン取得手順（開発時）
1. `firefly.adobe.com` を開く
2. F12 → Networkタブ → フィルター `execute`
3. Workflow の Run ボタンを押す
4. executeリクエスト → ヘッダー → Authorization の Bearer値をコピー

### 必須ヘッダー
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
x-api-key: bulk-automation-web
x-gw-ims-org-id: EE9332B3547CC74E0A4C98A1@AdobeOrg
x-gw-ims-user-id: C0F657EB5489DE240A4C98A5@adobe.com
```

---

## 3. Workflow API仕様

### エンドポイント
```
POST https://run-workflow.adobe.io/batch/execute
```

### ワークフロー情報
| 項目 | 値 |
|------|-----|
| ワークフロー名 | Ad Creation May 16 |
| 公開用workflowId | `196e8b4a-f863-46fd-8e24-3d1169c47e25` |
| 内部workflowId | `341d116f-4c45-4585-b635-8c0c938c63be` |

### ⚠️ 重要：ペイロード構造

WFBのPublish後に表示されるcURLの `"workflow": { "inputs": [[...]] }` 形式は**動作しない**。

**正しいペイロード構造（WFB内部APIと同じ）：**

```json
{
  "workflowId": "341d116f-4c45-4585-b635-8c0c938c63be",
  "actions": [ ...全20ノード... ],
  "connections": [ ...全19接続... ],
  "debug": false,
  "extract_images": true,
  "metadata": {
    "workflowId": "341d116f-4c45-4585-b635-8c0c938c63be",
    "name": "Ad Creation May 16",
    "version": "2.0.0"
  }
}
```

---

## 4. Actionsノード一覧

| # | actionId | actionType | ユーザー入力 |
|---|----------|------------|-------------|
| 0 | `node_1773092259_4401688f` | input-images | **Input画像URL** |
| 1 | `node_1773092259_d8b8daa5` | remove-background | なし |
| 2 | `node_1773092259_5cb8c7d8` | input-text | **Prompt 1** |
| 3 | `node_1773092259_b389e634` | apply-edits | なし |
| 4 | `node_1773092259_7ad98bc5` | preview-images | なし |
| 5 | `node-1773092472186-j1e8zgjog` | input-text | **Prompt 2** |
| 6 | `node_1773092491358_7di1in5h1_9_k2gyjz` | input-text | **Heading Text 1** |
| 7 | `node_1773092542293_z6xhiceq7_10_ryzolk` | preview-images | なし |
| 8 | `node_1773092721585_3xdjskbj2_11_luqyig` | crop | なし |
| 9 | `node_1773092731405_0yy3d3iyl_12_7tz1yz` | input-text | **Sub-Heading Text 1** |
| 10 | `node_1773092804901_gqlz8f6sb_15_q82prg` | apply-edits | なし |
| 11 | `node_1773092883378_vgxanpe1i_16_qabxlu` | preview-images | なし |
| 12 | `node_1773095380471_3md5k3sji_17_5bvvzs` | preview-images | なし |
| 13 | `node-1773096710497-fe9mlcafp` | gen-object-composite | なし |
| 14 | `node-1773096749614-ogoqdrnpl` | gen-object-composite | なし |
| 15 | `node-1773206538730-vcjv8azwt` | crop | なし |
| 16 | `node_1773207589592_a1g95pe6x_18_nq3u4k` | input-text | **Heading Text 2** |
| 17 | `node_1773207613701_hb43tfsgx_19_dmfuef` | input-text | **Sub-Heading Text 2** |
| 18 | `node-1773470661819-ta5z8k4kl` | merge-data | テンプレート1 (1080x1080) |
| 19 | `node-1773470732553-pxcrvw7f4` | merge-data | テンプレート2 (300x600) |

---

## 5. 各ノードのinputs形式

### input-images（画像入力）
```json
{
  "actionId": "node_1773092259_4401688f",
  "actionType": "input-images",
  "name": "Input Images",
  "inputs": {
    "images": [{
      "source": {
        "url": "https://author-p154442-e1620921.adobeaemcloud.com/content/dam/...",
        "storageType": "AEM"
      }
    }]
  }
}
```

### input-text（テキスト入力）
```json
{
  "actionId": "node_1773092259_5cb8c7d8",
  "actionType": "input-text",
  "name": "Input Text",
  "parameters": {
    "text": "ユーザー入力テキスト"
  }
}
```

### merge-data（InDesignテンプレート結合）
```json
{
  "actionId": "node-1773470661819-ta5z8k4kl",
  "actionType": "merge-data",
  "name": "Merge InDesign data",
  "parameters": {
    "fileName": "1080x1080_Dunlop.indd",
    "title": "1080x1080_Dunlop.indd",
    "templates": [{
      "name": "1080x1080_Dunlop.indd",
      "mimeType": "application/x-indesign",
      "storageType": "external",
      "url": "{presigned_url}"
    }],
    "output": {"storageType": "Azure", "type": "image/png"},
    "outputMediaType": "image/png",
    "outputFileBaseString": "1080x1080_Dunlop",
    "recordRange": "All",
    "removeBlankLines": false,
    "allowMultipleRecordsPerPage": false,
    "convertUrlToHyperlink": true,
    "imagePlacementOptions": {
      "centerImage": false,
      "fittingOption": "proportional",
      "linkImages": false
    },
    "exportSettings": {"quality": "medium"},
    "fontDirectories": [],
    "hyphenationSettings": {"zone": 0}
  }
}
```

---

## 6. InDesignテンプレートのpresigned URL

### 特徴
- **storageType:** `"external"`
- **有効期限:** 4時間（`X-Amz-Expires=14400`）
- **取得方法:** WFBでRunボタン押下時のNetworkタブ → actions[18/19].parameters.templates[0].url

### URL形式
```
https://acp-aep-cs-blobstore-prod-jpn3-data.adobe.io/{uuid}?
  response-content-disposition=...
  &x-user-client-id=clio-playground-web
  &X-Amz-Algorithm=AWS4-HMAC-SHA256
  &X-Amz-Expires=14400
  ...
```

### ⚠️ 課題
presigned URLは4時間で期限切れとなるため、本番運用では以下が必要：
- WFB APIからテンプレートURLを動的取得する仕組み
- またはAEM DAM経由でのテンプレート管理

---

## 7. API実行フロー

### Step 1: execute（ジョブ投入）
```
POST https://run-workflow.adobe.io/batch/execute
→ 202 Accepted
→ レスポンスボディに batchId, links.status.href が含まれる
```

### Step 2: ポーリング（ステータス確認）
```
GET https://run-workflow.adobe.io/batches/{batchId}
→ status: "pending" → "running" → "completed" / "failed"
```

### ⚠️ statusURLの取得方法
- **正しい:** executeレスポンスの `links.status.href`
  ```
  https://run-workflow.adobe.io/batches/batch-341d116f-...
  ```
- **誤り:** レスポンスヘッダーの `x-session-id`
  ```
  https://run-workflow.adobe.io/batches/batch-orch-batch-341d116f-...（404になる）
  ```

### Step 3: 結果取得
```
GET https://run-workflow.adobe.io/batches/{batchId}?format=preview
→ 出力画像URLが含まれる
```

### Step 4: executions詳細（デバッグ用）
```
GET https://run-workflow.adobe.io/batches/{batchId}/executions
→ 各ノードの成功/失敗と詳細エラーが確認できる
```

---

## 8. Connections（全19件）

```json
[
  {"connectionId": "xy-edge__node_1773092259_4401688f_outputs-node_1773092259_d8b8daa5_input-images", "connectionSource": "node_1773092259_4401688f", "connectionTarget": "node_1773092259_d8b8daa5", "sourcePort": "outputs", "targetPort": "input-images"},
  {"connectionId": "xy-edge__node_1773092804901_gqlz8f6sb_15_q82prgoutputs-node_1773095380471_3md5k3sji_17_5bvvzsinput-images", "connectionSource": "node_1773092804901_gqlz8f6sb_15_q82prg", "connectionTarget": "node_1773095380471_3md5k3sji_17_5bvvzs", "sourcePort": "outputs", "targetPort": "input-images"},
  {"connectionId": "xy-edge__node_1773092259_b389e634outputs-node_1773092542293_z6xhiceq7_10_ryzolkinput-images", "connectionSource": "node_1773092259_b389e634", "connectionTarget": "node_1773092542293_z6xhiceq7_10_ryzolk", "sourcePort": "outputs", "targetPort": "input-images"},
  {"connectionId": "xy-edge__node_1773092259_5cb8c7d8outputs-node-1773096710497-fe9mlcafpprompt", "connectionSource": "node_1773092259_5cb8c7d8", "connectionTarget": "node-1773096710497-fe9mlcafp", "sourcePort": "outputs", "targetPort": "prompt"},
  {"connectionId": "xy-edge__node_1773092731405_0yy3d3iyl_12_7tz1yzoutputs-node-1773096749614-ogoqdrnplprompt", "connectionSource": "node_1773092731405_0yy3d3iyl_12_7tz1yz", "connectionTarget": "node-1773096749614-ogoqdrnpl", "sourcePort": "outputs", "targetPort": "prompt"},
  {"connectionId": "xy-edge__node_1773092259_d8b8daa5outputs-node-1773096710497-fe9mlcafpinput-images", "connectionSource": "node_1773092259_d8b8daa5", "connectionTarget": "node-1773096710497-fe9mlcafp", "sourcePort": "outputs", "targetPort": "input-images"},
  {"connectionId": "xy-edge__node-1773206538730-vcjv8azwtoutputs-node_1773092259_b389e634input-images", "connectionSource": "node-1773206538730-vcjv8azwt", "connectionTarget": "node_1773092259_b389e634", "sourcePort": "outputs", "targetPort": "input-images"},
  {"connectionId": "xy-edge__node-1773096710497-fe9mlcafpoutputs-node-1773206538730-vcjv8azwtinput-images", "connectionSource": "node-1773096710497-fe9mlcafp", "connectionTarget": "node-1773206538730-vcjv8azwt", "sourcePort": "outputs", "targetPort": "input-images"},
  {"connectionId": "xy-edge__node_1773092259_d8b8daa5outputs-node-1773096749614-ogoqdrnplinput-images", "connectionSource": "node_1773092259_d8b8daa5", "connectionTarget": "node-1773096749614-ogoqdrnpl", "sourcePort": "outputs", "targetPort": "input-images"},
  {"connectionId": "xy-edge__node-1773096749614-ogoqdrnploutputs-node_1773092721585_3xdjskbj2_11_luqyiginput-images", "connectionSource": "node-1773096749614-ogoqdrnpl", "connectionTarget": "node_1773092721585_3xdjskbj2_11_luqyig", "sourcePort": "outputs", "targetPort": "input-images"},
  {"connectionId": "xy-edge__node_1773092721585_3xdjskbj2_11_luqyigoutputs-node_1773092804901_gqlz8f6sb_15_q82prginput-images", "connectionSource": "node_1773092721585_3xdjskbj2_11_luqyig", "connectionTarget": "node_1773092804901_gqlz8f6sb_15_q82prg", "sourcePort": "outputs", "targetPort": "input-images"},
  {"connectionId": "xy-edge__node_1773092259_b389e634outputs-node-1773470661819-ta5z8k4klbackground", "connectionSource": "node_1773092259_b389e634", "connectionTarget": "node-1773470661819-ta5z8k4kl", "sourcePort": "outputs", "targetPort": "background"},
  {"connectionId": "xy-edge__node-1773092472186-j1e8zgjogoutputs-node-1773470661819-ta5z8k4klsub-heading", "connectionSource": "node-1773092472186-j1e8zgjog", "connectionTarget": "node-1773470661819-ta5z8k4kl", "sourcePort": "outputs", "targetPort": "sub-heading"},
  {"connectionId": "xy-edge__node_1773092491358_7di1in5h1_9_k2gyjzoutputs-node-1773470661819-ta5z8k4klheading", "connectionSource": "node_1773092491358_7di1in5h1_9_k2gyjz", "connectionTarget": "node-1773470661819-ta5z8k4kl", "sourcePort": "outputs", "targetPort": "heading"},
  {"connectionId": "xy-edge__node_1773092804901_gqlz8f6sb_15_q82prgoutputs-node-1773470732553-pxcrvw7f4background", "connectionSource": "node_1773092804901_gqlz8f6sb_15_q82prg", "connectionTarget": "node-1773470732553-pxcrvw7f4", "sourcePort": "outputs", "targetPort": "background"},
  {"connectionId": "xy-edge__node_1773207589592_a1g95pe6x_18_nq3u4koutputs-node-1773470732553-pxcrvw7f4sub-heading", "connectionSource": "node_1773207589592_a1g95pe6x_18_nq3u4k", "connectionTarget": "node-1773470732553-pxcrvw7f4", "sourcePort": "outputs", "targetPort": "sub-heading"},
  {"connectionId": "xy-edge__node-1773470732553-pxcrvw7f4output-node_1773092883378_vgxanpe1i_16_qabxluinput-images", "connectionSource": "node-1773470732553-pxcrvw7f4", "connectionTarget": "node_1773092883378_vgxanpe1i_16_qabxlu", "sourcePort": "output", "targetPort": "input-images"},
  {"connectionId": "xy-edge__node-1773470661819-ta5z8k4kloutput-node_1773092259_7ad98bc5input-images", "connectionSource": "node-1773470661819-ta5z8k4kl", "connectionTarget": "node_1773092259_7ad98bc5", "sourcePort": "output", "targetPort": "input-images"},
  {"connectionId": "xy-edge__node_1773207613701_hb43tfsgx_19_dmfuefoutputs-node-1773470732553-pxcrvw7f4heading", "connectionSource": "node_1773207613701_hb43tfsgx_19_dmfuef", "connectionTarget": "node-1773470732553-pxcrvw7f4", "sourcePort": "outputs", "targetPort": "heading"}
]
```

---

## 9. AEM / EDS環境情報

| 項目 | 値 |
|------|-----|
| AEM Author URL | `https://author-p154442-e1620921.adobeaemcloud.com` |
| Organization ID | `EE9332B3547CC74E0A4C98A1@AdobeOrg` |
| User ID | `C0F657EB5489DE240A4C98A5@adobe.com` |
| GitHub | `https://github.com/shimoawazu/referencedemo-275` |
| EDSブロック | `blocks/ad-creation/` |

---

## 10. Developer Consoleでのライセンス状況

| API | 状態 |
|-----|------|
| Firefly API - Firefly Services | ❌ ライセンスなし |
| Photoshop API - Firefly Services | ✅ AEM-p154442プロジェクトに含まれる |
| Lightroom API - Firefly Services | ✅ AEM-p154442プロジェクトに含まれる |
| Workflow Builder API | ✅ ユーザーセッショントークンで動作 |

---

## 11. AEM Universal Editor統合手順

### component-definition.jsonへの追加
```json
{
  "title": "Ad Creation",
  "id": "ad-creation",
  "plugins": {
    "xwalk": {
      "page": {
        "resourceType": "core/franklin/components/block/v1/block",
        "template": {
          "name": "Ad Creation",
          "model": "ad-creation"
        }
      }
    }
  }
}
```

### component-models.jsonへの追加（8フィールド）
- bearerToken, assetUrl, prompt1, prompt2
- headingText1, subHeadingText1, headingText2, subHeadingText2

### component-filters.jsonへの追加
```json
"ad-creation"
```

---

## 12. 残課題

1. **input-imagesノードへの画像渡し方** — `inputs.images[0].source.url` の形式で正しく渡す
2. **presigned URLの自動更新** — 4時間ごとにWFBから再取得が必要
3. **出力画像の表示** — completed後のpreview URLから画像をレンダリング
4. **ポーリング完了検知** — `status: "completed"` 後に `?format=preview` で画像取得
5. **本番トークン管理** — ユーザーセッショントークンでなくサービストークンへの移行（要Firefly Servicesライセンス）

## 2026-05-18 進捗

### 解決済み
- input-images: parameters.images[].sourceUrl + storageType:external
- crop: autocrop:true + targetDimension パラメータ追加
- merge-data: records フィールド削除

### 残課題
1. Failed to fetch (CORS) — run-workflow.adobe.ioへのアクセスがブロック
   → AEM Author / UE / aem.live すべてでブロックされる
   → 解決策: scripts/api-proxy.js を作成してAEM側でプロキシ経由にする
     または head.html に Content-Security-Policy で connect-src を追加

2. merge-data error 107013 未解決（cropが通れば次に出る可能性あり）
   → presigned URLの有効期限も要確認

3. テスト環境
   → aem.live でのページ公開フロー確立が必要