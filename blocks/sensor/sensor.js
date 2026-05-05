export default async function decorate(block) {
  const basePath = `${window.hlx?.codeBasePath ?? ''}`;

  let data = {};
  try {
    const resp = await fetch(`${basePath}/blocks/cards/sensor-data.json`);
    if (resp.ok) data = await resp.json();
  } catch (e) {
    // fallback: show empty state
  }

  const { timestamp = '--', co2 = '--', temperature = '--', humidity = '--' } = data;

  const co2Status  = typeof co2 === 'number'
    ? (co2 < 800 ? '良好' : co2 < 1200 ? '注意' : '換気推奨') : '--';
  const tempStatus = typeof temperature === 'number'
    ? (temperature < 18 ? '寒い' : temperature < 26 ? '快適' : '暑い') : '--';
  const humStatus  = typeof humidity === 'number'
    ? (humidity < 30 ? 'やや乾燥' : humidity < 60 ? '快適' : '多湿') : '--';

  block.innerHTML = `
    <div class="sensor-inner">
      <div class="sensor-header">
        <span class="sensor-title">室内環境モニター — Raspberry Pi Pico W</span>
        <span class="sensor-badge">自動更新 30分毎</span>
      </div>
      <div class="sensor-grid">
        <div class="sensor-card sensor-card--co2">
          <div class="sensor-card-icon"></div>
          <p class="sensor-card-label">CO₂ 濃度</p>
          <p class="sensor-card-value">${typeof co2 === 'number' ? co2 : '--'}</p>
          <p class="sensor-card-unit">ppm — ${co2Status}</p>
        </div>
        <div class="sensor-card sensor-card--temp">
          <div class="sensor-card-icon"></div>
          <p class="sensor-card-label">温度</p>
          <p class="sensor-card-value">${typeof temperature === 'number' ? temperature.toFixed(1) : '--'}</p>
          <p class="sensor-card-unit">°C — ${tempStatus}</p>
        </div>
        <div class="sensor-card sensor-card--hum">
          <div class="sensor-card-icon"></div>
          <p class="sensor-card-label">湿度</p>
          <p class="sensor-card-value">${typeof humidity === 'number' ? humidity.toFixed(1) : '--'}</p>
          <p class="sensor-card-unit">% — ${humStatus}</p>
        </div>
      </div>
      <p class="sensor-timestamp">最終更新: ${timestamp}</p>
    </div>
  `;
}
