import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

import { aggregateResults } from '../utils/aggregateResults';
import { downsample } from '../utils/downsample';
import styles from '../styles/Chart.module.css';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  zoomPlugin,
);

export default function ResultsChart({ results }) {
  const [resolution, setResolution] = useState(1);

  const aggregated = aggregateResults(results);

  const sampled = downsample(aggregated, resolution);
  const data = {
    labels: sampled.map((r) => r.timestamp),
    datasets: [
      {
        label: 'Общее энергопотребление',
        data: sampled.map((r) => r.energy),
        borderColor: '#2563eb',
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.controls}>
        <label>
          Детализация:
          <select
            value={resolution}
            onChange={(e) => setResolution(Number(e.target.value))}
          >
            <option value={1}>Каждая точка</option>
            <option value={5}>Каждые 5 точек</option>
            <option value={10}>Каждые 10 точек</option>
          </select>
        </label>
      </div>

      <Line data={data} options={options} />
    </div>
  );
}
