const API_URL = 'http://127.0.0.1:8000';

export async function getScenarios() {
  const res = await fetch(`${API_URL}/scenarios`);
  return res.json();
}

export async function runSimulation(data) {
  const res = await fetch(`${API_URL}/simulation/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getResults(simulationId) {
  const res = await fetch(`${API_URL}/results/${simulationId}`);
  return res.json();
}

export async function getSummary(simulationId) {
  const res = await fetch(`${API_URL}/summary/${simulationId}`);
  return res.json();
}
