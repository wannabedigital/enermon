import { useState } from 'react';
import styles from '../styles/SimulationList.module.css';

export default function SimulationList({ simulations, onSelect }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (sim) => {
    setSelectedId(sim.id);
    if (onSelect) onSelect(sim);
  };

  if (!simulations || simulations.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>История симуляций пуста</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {simulations.map((sim) => (
          <div
            key={sim.id}
            className={`${styles.item} ${selectedId === sim.id ? styles.active : ''}`}
            onClick={() => handleSelect(sim)}
          >
            <div className={styles.info}>
              <span className={styles.id}>#{sim.id}</span>
              <span className={styles.scenario}>
                Сценарий: {sim.scenario_id}
              </span>
            </div>
            <div className={styles.details}>
              <span className={styles.duration}>{sim.duration} сек</span>
              <span className={styles.time}>
                {new Date(sim.start_time).toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
