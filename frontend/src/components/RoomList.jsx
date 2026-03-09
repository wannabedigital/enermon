import styles from '../styles/RoomList.module.css';

export default function RoomList({ rooms, activeId, onSelect, onDelete }) {
  if (rooms.length === 0) {
    return <p className={styles.empty}>В здании пока нет помещений</p>;
  }

  return (
    <div className={styles.list}>
      <h4>Помещения</h4>
      <ul>
        {rooms.map((room) => (
          <li
            key={room.id}
            className={room.id === activeId ? styles.active : ''}
            onClick={() => onSelect(room)}
          >
            <span>
              {room.name} — {room.area} м²
            </span>
            {onDelete && (
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Удалить помещение "${room.name}"?`)) {
                    onDelete(room.id);
                  }
                }}
                aria-label='Удалить помещение'
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
