import { useEffect, useState } from 'react';
import { getScenarios, runSimulation } from '../api/enermonApi';
import styles from '../styles/Form.module.css';

export default function SimulationForm({ onSimulationStart }) {
  const [scenarios, setScenarios] = useState([]);
  const [scenarioId, setScenarioId] = useState('');
  const [duration, setDuration] = useState(3600);
  const [timeStep, setTimeStep] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getScenarios()
      .then(setScenarios)
      .catch(() => {
        setError('Не удалось загрузить сценарии');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const simulation = await runSimulation({
        scenario_id: Number(scenarioId),
        duration,
        time_step: timeStep,
      });
      onSimulationStart(simulation.id);
    } catch (err) {
      setError('Ошибка запуска симуляции: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Запуск симуляции</h2>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formGroup}>
        <label>Сценарий:</label>
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          required
        >
          <option value=''>Выберите сценарий</option>
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Длительность (сек):</label>
        <input
          type='number'
          value={duration}
          onChange={(e) => setDuration(+e.target.value)}
          min='60'
          step='60'
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Шаг времени (сек):</label>
        <input
          type='number'
          value={timeStep}
          onChange={(e) => setTimeStep(+e.target.value)}
          min='1'
          max='3600'
          required
        />
      </div>

      <button type='submit' disabled={loading || !scenarioId}>
        {loading ? 'Запуск...' : 'Запустить моделирование'}
      </button>
    </form>
  );
}
