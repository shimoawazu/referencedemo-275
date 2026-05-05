function getCo2Status(co2) {
  if (co2 < 800) return '良好';
  if (co2 < 1200) return '注意';
  return '換気推奨';
}

function getTempStatus(temp) {
  if (temp < 18) return '寒い';
  if (temp < 26) return '快適';
  return '暑い';
}

function getHumStatus(hum) {
  if (hum < 30) return 'やや乾燥';
  if (hum < 60) return '快適';
  return '多湿';
}

export default async function decorate(block) {
  const basePath = window.hlx?.codeBasePath ?? '';

  let data = {};
  try {
    const resp = await fetch(`${basePath}/blocks/cards/sensor-data.json`);
    if (resp.ok) {
      data = await resp.json();
    }
  } catch (e) {
    // fallback: show empty state
  }

  const {
    timestamp = '--',
    co2 = null,
    temperature = null,
    humidity = null,
  } = data;

  const co2Value = co2 !== null ? co2 : '--';
  const tempValue = temperature !== null ? temperature.toFixed(1) : '--';
  const humValue = humidity !== null ? humidity.toFixed(1) : '--';

  const co2Status = co2 !== null ? getCo2Status(co2) : '--';
  const tempStatus = temperature !== null ? getTempStatus(temperature) : '--';
  const humStatus = humidity !== null ? getHumStatus(humidity) : '--';

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
          <p class="sensor-card-value">${co2Value}</p>
          <p class="sensor-card-unit">ppm — ${co2Status}</p>
        </div>
        <div class="sensor-card sensor-card--temp">
          <div class="sensor-card-icon"></div>
          <p class="sensor-card-label">温度</p>
          <p class="sensor-card-value">${tempValue}</p>
          <p class="sensor-card-unit">°C — ${tempStatus}</p>
        </div>
        <div class="sensor-card sensor-card--hum">
          <div class="sensor-card-icon"></div>
          <p class="sensor-card-label">湿度</p>
          <p class="sensor-card-value">${humValue}</p>
          <p class="sensor-card-unit">% — ${humStatus}</p>
        </div>
      </div>
      <p class="sensor-timestamp">最終更新: ${timestamp}</p>
    </div>
  `;
}
