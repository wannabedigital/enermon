import styles from '../styles/BuildingList.module.css';

export default function BuildingList({ buildings, activeId, onSelect }) {
  if (buildings.length === 0) {
    return <p>Здания не созданы</p>;
  }

  return (
    <div className={styles.list}>
      <h3>Список зданий</h3>

      <ul>
        {buildings.map((b) => (
          <li
            key={b.id}
            onClick={() => onSelect(b)}
            className={b.id === activeId ? styles.active : ''}
          >
            {b.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
