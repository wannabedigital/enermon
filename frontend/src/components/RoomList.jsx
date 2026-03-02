import styles from '../styles/RoomList.module.css';

export default function RoomList({ rooms, activeId, onSelect }) {
  if (rooms.length === 0) {
    return <p className={styles.empty}>В здании пока нет помещений</p>;
  }

  return (
    <div className={styles.list}>
      <h3>Помещения</h3>
      <ul>
        {rooms.map((room) => (
          <li
            key={room.id}
            className={room.id === activeId ? styles.active : ''}
            onClick={() => onSelect(room)}
          >
            {room.name} — {room.area} м²
          </li>
        ))}
      </ul>
    </div>
  );
}
