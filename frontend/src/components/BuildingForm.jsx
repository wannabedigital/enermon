import { useState } from 'react';
import { createBuilding } from '../api/enermonApi';

import styles from '../styles/BuildingForm.module.css';

export default function BuildingForm({ onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const building = await createBuilding({
        name,
        description,
      });
      onCreated(building);
      setName('');
      setDescription('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <h3>Создание здания</h3>

      <input
        type='text'
        placeholder='Название здания'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type='text'
        placeholder='Описание (необязательно)'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type='submit' disabled={loading}>
        {loading ? 'Создание...' : 'Добавить здание'}
      </button>
    </form>
  );
}
