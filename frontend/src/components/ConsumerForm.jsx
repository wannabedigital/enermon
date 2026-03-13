import { useState } from 'react';
import { createConsumer } from '../api/enermonApi';
import styles from '../styles/ConsumerForm.module.css';

export default function ConsumerForm({ roomId, onCreated }) {
  const [name, setName] = useState('');
  const [power, setPower] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    const consumer = await createConsumer({
      name,
      nominal_power: Number(power),
      room_id: roomId,
    });

    onCreated(consumer);
    setName('');
    setPower('');
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <h4>Добавить энергопотребитель</h4>

      <input
        type='text'
        placeholder='Название'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type='number'
        placeholder='Мощность, кВт'
        value={power}
        onChange={(e) => setPower(e.target.value)}
        required
        min='0.001'
        step='0.01'
      />

      <button className={styles.addButton} type='submit'>
        Добавить
      </button>
    </form>
  );
}
