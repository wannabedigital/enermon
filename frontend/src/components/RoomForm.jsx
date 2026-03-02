import { useState } from 'react';
import { createRoom } from '../api/enermonApi';

import styles from '../styles/RoomForm.module.css';

export default function RoomForm({ buildingId, onCreated }) {
  const [name, setName] = useState('');
  const [area, setArea] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    const room = await createRoom({
      name,
      area: Number(area),
      building_id: buildingId,
    });

    onCreated(room);
    setName('');
    setArea('');
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <h3>Добавить помещение</h3>

      <input
        type='text'
        placeholder='Название помещения'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type='number'
        placeholder='Площадь, м²'
        value={area}
        onChange={(e) => setArea(e.target.value)}
        required
        min='1'
      />

      <button type='submit'>Добавить помещение</button>
    </form>
  );
}
