import { useEffect, useState } from 'react';
import { getScenarios, runSimulation } from '../api/enermonApi';
import styles from '../styles/Form.module.css';

export default function SimulationForm({ onSimulationStart }) {
  const [scenarios, setScenarios] = useState([]);
  const [scenarioId, setScenarioId] = useState('');
  const [duration, setDuration] = useState(3600);
  const [timeStep, setTimeStep] = useState(60);

  useEffect(() => {
    getScenarios().then(setScenarios);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const simulation = await runSimulation({
      scenario_id: Number(scenarioId),
      duration,
      time_step: timeStep,
    });
    onSimulationStart(simulation.id);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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

      <input
        type='number'
        value={duration}
        onChange={(e) => setDuration(+e.target.value)}
        placeholder='Длительность (сек)'
      />

      <input
        type='number'
        value={timeStep}
        onChange={(e) => setTimeStep(+e.target.value)}
        placeholder='Шаг (сек)'
      />

      <button type='submit'>Запустить моделирование</button>
    </form>
  );
}
