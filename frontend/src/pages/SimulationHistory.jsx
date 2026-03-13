import { useEffect, useState } from 'react';
import {
  getSimulationHistory,
  getResults,
  getSummary,
} from '../api/enermonApi';
import SimulationList from '../components/SimulationList';
import ResultsChart from '../components/ResultsChart';
import styles from '../styles/SimulationHistory.module.css';

export default function SimulationHistory() {
  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getSimulationHistory();
        setSimulations(data);
      } catch (err) {
        console.error('Failed to fetch simulation history:', err);
      }
    };
    fetchHistory();
  }, []);

  const handleSelectSimulation = async (sim) => {
    setLoading(true);
    setSelectedSimulation(sim);
    try {
      const [resultsData, summaryData] = await Promise.all([
        getResults(sim.id),
        getSummary(sim.id),
      ]);
      setResults(resultsData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to fetch simulation results:', err);
      setResults([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>История симуляций</h2>

      {/* Список симуляций — СВЕРХУ, горизонтальный скролл */}
      <div className={styles.listContainer}>
        <SimulationList
          simulations={simulations}
          onSelect={handleSelectSimulation}
        />
      </div>

      {/* Результаты — СНИЗУ, занимает всё оставшееся место */}
      <div className={styles.resultsContainer}>
        {loading && <p className={styles.loading}>Загрузка результатов...</p>}

        {!loading && selectedSimulation && results.length > 0 && (
          <ResultsChart results={results} summary={summary} />
        )}

        {!loading && selectedSimulation && results.length === 0 && (
          <p className={styles.empty}>Нет данных для этой симуляции</p>
        )}

        {!loading && !selectedSimulation && (
          <p className={styles.placeholder}>
            Выберите симуляцию из списка для просмотра результатов
          </p>
        )}
      </div>
    </div>
  );
}
