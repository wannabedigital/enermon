import styles from '../styles/ConsumerList.module.css';

export default function ConsumerList({ consumers, onDelete }) {
  if (consumers.length === 0) {
    return <p className={styles.empty}>Потребителей пока нет</p>;
  }

  return (
    <div className={styles.list}>
      <h4>Энергопотребители</h4>
      <ul>
        {consumers.map((c) => (
          <li key={c.id}>
            <span>
              {c.name} — {c.nominal_power} кВт
            </span>
            {onDelete && (
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  if (window.confirm(`Удалить потребителя "${c.name}"?`)) {
                    onDelete(c.id);
                  }
                }}
                aria-label='Удалить потребителя'
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
