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

export default function ResultsChart({ results, summary }) {
  const [resolution, setResolution] = useState(1);

  const aggregated = aggregateResults(results);
  const sampled = downsample(aggregated, resolution);

  const data = {
    labels: sampled.map((r) => {
      const date = new Date(r.timestamp);
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }),
    datasets: [
      {
        label: 'Общее энергопотребление (кВт·ч)',
        data: sampled.map((r) => r.energy),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.3,
        pointRadius: 0,
        fill: true,
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
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Время',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Энергия (кВт·ч)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      {summary && (
        <div className={styles.summary}>
          <h3>Сводка по симуляции</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Сценарий:</span>
              <span className={styles.value}>{summary.scenario_name}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Длительность:</span>
              <span className={styles.value}>{summary.duration} сек</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Всего энергии:</span>
              <span className={styles.value}>
                {Number(summary.total_energy).toFixed(2)} кВт·ч
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Среднее:</span>
              <span className={styles.value}>
                {Number(summary.average_energy).toFixed(2)} кВт·ч
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Минимум:</span>
              <span className={styles.value}>
                {Number(summary.min_energy).toFixed(2)} кВт·ч
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Максимум:</span>
              <span className={styles.value}>
                {Number(summary.max_energy).toFixed(2)} кВт·ч
              </span>
            </div>
          </div>
        </div>
      )}

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
            <option value={50}>Каждые 50 точек</option>
          </select>
        </label>
      </div>

      <div className={styles.chartWrapper}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
