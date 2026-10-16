// Vanilla client-side script proving static asset serving & API integration

async function runDiagnostics() {
  const healthEl = document.querySelector('#check-health .value');
  const dbEl = document.querySelector('#check-db .value');
  const archEl = document.querySelector('#check-arch .value');

  // Check /api/health
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    if (res.ok && data.ok) {
      healthEl.textContent = `${data.service}: ok`;
      healthEl.setAttribute('data-status', 'ok');
    } else {
      healthEl.textContent = 'failed';
      healthEl.setAttribute('data-status', 'error');
    }
  } catch (err) {
    healthEl.textContent = 'error';
    healthEl.setAttribute('data-status', 'error');
  }

  // Check /api/db-health
  try {
    const res = await fetch('/api/db-health');
    const data = await res.json();
    if (res.ok && data.ok) {
      dbEl.textContent = data.database;
      dbEl.setAttribute('data-status', 'ok');
    } else {
      dbEl.textContent = data.database || 'failed';
      dbEl.setAttribute('data-status', 'error');
    }
  } catch (err) {
    dbEl.textContent = 'error';
    dbEl.setAttribute('data-status', 'error');
  }

  // Check /api/architecture
  try {
    const res = await fetch('/api/architecture');
    const data = await res.json();
    if (res.ok && data.architecture) {
      archEl.textContent = `${data.architecture} (${data.style})`;
      archEl.setAttribute('data-status', 'ok');
    } else {
      archEl.textContent = 'failed';
      archEl.setAttribute('data-status', 'error');
    }
  } catch (err) {
    archEl.textContent = 'error';
    archEl.setAttribute('data-status', 'error');
  }
}

document.addEventListener('DOMContentLoaded', runDiagnostics);
