export function aggregateResults(results) {
  const map = {};

  results.forEach((r) => {
    if (!map[r.timestamp]) {
      map[r.timestamp] = 0;
    }
    map[r.timestamp] += Number(r.energy_value);
  });

  return Object.entries(map).map(([timestamp, energy]) => ({
    timestamp,
    energy,
  }));
}
