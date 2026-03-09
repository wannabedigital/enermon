import { useState } from 'react';
import { createBuilding } from '../api/enermonApi';
import styles from '../styles/BuildingForm.module.css';

export default function BuildingForm({ onCreated }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [workStart, setWorkStart] = useState(8);
  const [workEnd, setWorkEnd] = useState(22);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const building = await createBuilding({
        name,
        address: address || null,
        area: area ? Number(area) : null,
        work_start_hour: Number(workStart),
        work_end_hour: Number(workEnd),
      });
      onCreated(building);
      setName('');
      setAddress('');
      setArea('');
      setWorkStart(8);
      setWorkEnd(22);
    } finally {
      setLoading(false);
    }
  };

  // Генерация опций для часов (00–23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => (
    <option key={i} value={i}>
      {i.toString().padStart(2, '0')}:00
    </option>
  ));

  return (
    <form onSubmit={submit} className={styles.form}>
      <h3>Создание здания</h3>

      <div className={styles.formGroup}>
        <label>Название здания *</label>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder='Например: Офисный центр'
        />
      </div>

      <div className={styles.formGroup}>
        <label>Адрес</label>
        <input
          type='text'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='Например: ул. Примерная, 1'
        />
      </div>

      <div className={styles.formGroup}>
        <label>Площадь, м²</label>
        <input
          type='number'
          value={area}
          onChange={(e) => setArea(e.target.value)}
          min='1'
          placeholder='Например: 1500'
        />
      </div>

      {/* Поля для рабочих часов */}
      <div className={styles.formGroup}>
        <div className={styles.workHoursGroup}>
          <label>Режим работы здания</label>
          <div className={styles.workHoursRow}>
            <select
              value={workStart}
              onChange={(e) => setWorkStart(Number(e.target.value))}
            >
              {hourOptions}
            </select>
            <span>—</span>
            <select
              value={workEnd}
              onChange={(e) => setWorkEnd(Number(e.target.value))}
            >
              {hourOptions}
            </select>
          </div>
          <span className={styles.workHoursHint}>
            Влияет на график потребления в симуляции
          </span>
        </div>
      </div>

      <button type='submit' disabled={loading || !name}>
        {loading ? 'Создание...' : 'Добавить здание'}
      </button>
    </form>
  );
}
