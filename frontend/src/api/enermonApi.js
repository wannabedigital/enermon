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

export async function getBuildings() {
  const res = await fetch(`${API_URL}/buildings`);
  return res.json();
}

export async function createBuilding(data) {
  const res = await fetch(`${API_URL}/buildings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteBuilding(id) {
  const res = await fetch(`${API_URL}/buildings/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function getRooms(buildingId) {
  const res = await fetch(`${API_URL}/rooms?building_id=${buildingId}`);
  return res.json();
}

export async function createRoom(data) {
  const res = await fetch(`${API_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteRoom(id) {
  const res = await fetch(`${API_URL}/rooms/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function getConsumers(roomId) {
  const res = await fetch(`${API_URL}/consumers?room_id=${roomId}`);
  return res.json();
}

export async function createConsumer(data) {
  const res = await fetch(`${API_URL}/consumers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteConsumer(id) {
  const res = await fetch(`${API_URL}/consumers/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
