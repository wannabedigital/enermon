import styles from '../styles/Chart.module.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function ResultsChart({ results }) {
  const data = {
    labels: results.map((r) => r.timestamp),
    datasets: [
      {
        label: 'Энергопотребление',
        data: results.map((r) => r.energy_value),
        borderColor: '#2563eb',
        tension: 0.2,
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <Line data={data} />
    </div>
  );
}
