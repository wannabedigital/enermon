import styles from '../styles/BuildingList.module.css';

export default function BuildingList({
  buildings,
  activeId,
  onSelect,
  onDelete,
}) {
  if (buildings.length === 0) {
    return <p className={styles.empty}>Здания не созданы</p>;
  }

  return (
    <div className={styles.list}>
      <h4>Список зданий</h4>
      <ul>
        {buildings.map((b) => (
          <li
            key={b.id}
            className={b.id === activeId ? styles.active : ''}
            onClick={() => onSelect(b)}
          >
            <div className={styles.buildingInfo}>
              <span className={styles.buildingName}>{b.name}</span>
              <span className={styles.workHours}>
                {b.work_start_hour?.toString().padStart(2, '0')}:00 —{' '}
                {b.work_end_hour?.toString().padStart(2, '0')}:00
              </span>
            </div>
            {onDelete && (
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Удалить здание "${b.name}"?`)) {
                    onDelete(b.id);
                  }
                }}
                aria-label='Удалить здание'
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
