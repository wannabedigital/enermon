import { useEffect, useState } from 'react';
import {
  getBuildings,
  getRooms,
  getConsumers,
  getConsumersByBuilding,
  deleteBuilding,
  deleteRoom,
  deleteConsumer,
} from '../api/enermonApi';
import BuildingForm from '../components/BuildingForm';
import BuildingList from '../components/BuildingList';
import RoomForm from '../components/RoomForm';
import RoomList from '../components/RoomList';
import ConsumerForm from '../components/ConsumerForm';
import ConsumerList from '../components/ConsumerList';
import styles from '../styles/ModelEditor.module.css';

export default function ModelEditor({
  onNavigateToSimulation,
  onBuildingSelect,
}) {
  const [buildings, setBuildings] = useState([]);
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [consumers, setConsumers] = useState([]);
  const [buildingConsumers, setBuildingConsumers] = useState([]);

  // Загрузка зданий при монтировании
  useEffect(() => {
    const fetchBuildings = async () => {
      const data = await getBuildings();
      setBuildings(data);
    };
    fetchBuildings();
  }, []);

  // Загрузка помещений при выборе здания
  useEffect(() => {
    if (!activeBuilding) return;
    const fetchRooms = async () => {
      const data = await getRooms(activeBuilding.id);
      setRooms(data);
      setActiveRoom(null);
      setConsumers([]);
      // ← УДАЛЕНО: setBuildingConsumers([]) — не сбрасываем!
    };
    fetchRooms();
  }, [activeBuilding]);

  // Загрузка ВСЕХ потребителей здания (для проверки canSimulate)
  useEffect(() => {
    if (!activeBuilding) return;
    const fetchBuildingConsumers = async () => {
      try {
        const data = await getConsumersByBuilding(activeBuilding.id);
        setBuildingConsumers(data);
      } catch (err) {
        console.error('Failed to fetch building consumers:', err);
        setBuildingConsumers([]);
      }
    };
    fetchBuildingConsumers();
  }, [activeBuilding]);

  // Загрузка потребителей выбранного помещения (для отображения в списке)
  useEffect(() => {
    if (!activeRoom) return;
    const fetchConsumers = async () => {
      const data = await getConsumers(activeRoom.id);
      setConsumers(data);
    };
    fetchConsumers();
  }, [activeRoom]);

  const handleBuildingCreated = (b) => {
    setBuildings((prev) => [...prev, b]);
    setActiveBuilding(b);
  };

  const handleRoomCreated = (r) => {
    setRooms((prev) => [...prev, r]);
  };

  const handleConsumerCreated = (c) => {
    setConsumers((prev) => [...prev, c]);
    setBuildingConsumers((prev) => [...prev, c]);
  };

  // === Обработчики удаления ===

  const handleBuildingDeleted = async (id) => {
    try {
      await deleteBuilding(id);
      // Обновляем список зданий
      setBuildings((prev) => prev.filter((b) => b.id !== id));
      // Если удалили активное здание — сбрасываем всё
      if (activeBuilding?.id === id) {
        setActiveBuilding(null);
        setActiveRoom(null);
        setRooms([]);
        setConsumers([]);
        setBuildingConsumers([]);
      }
    } catch (err) {
      console.error('Failed to delete building:', err);
      alert('Ошибка при удалении здания');
    }
  };

  const handleRoomDeleted = async (id) => {
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      if (activeRoom?.id === id) {
        setActiveRoom(null);
        setConsumers([]);
      }
    } catch (err) {
      console.error('Failed to delete room:', err);
      alert('Ошибка при удалении помещения');
    }
  };

  const handleConsumerDeleted = async (id) => {
    try {
      await deleteConsumer(id);
      setConsumers((prev) => prev.filter((c) => c.id !== id));
      setBuildingConsumers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete consumer:', err);
      alert('Ошибка при удалении потребителя');
    }
  };

  const canSimulate = activeBuilding !== null && buildingConsumers.length > 0;

  return (
    <div className={styles.container}>
      <h2>Редактор модели здания</h2>

      <div className={styles.forms}>
        <BuildingForm onCreated={handleBuildingCreated} />

        {activeBuilding && (
          <>
            <RoomForm
              buildingId={activeBuilding.id}
              onCreated={handleRoomCreated}
            />

            {activeRoom && (
              <ConsumerForm
                roomId={activeRoom.id}
                onCreated={handleConsumerCreated}
              />
            )}
          </>
        )}
      </div>

      <div className={styles.lists}>
        <BuildingList
          buildings={buildings}
          activeId={activeBuilding?.id}
          onSelect={(building) => {
            setActiveBuilding(building);
            if (onBuildingSelect) onBuildingSelect(building);
          }}
          onDelete={handleBuildingDeleted}
        />

        {activeBuilding && (
          <RoomList
            rooms={rooms}
            activeId={activeRoom?.id}
            onSelect={setActiveRoom}
            onDelete={handleRoomDeleted}
          />
        )}

        {activeRoom && (
          <ConsumerList
            consumers={consumers}
            onDelete={handleConsumerDeleted}
          />
        )}
      </div>

      {canSimulate && onNavigateToSimulation && (
        <div className={styles.actions}>
          <button
            className={styles.simulateButton}
            onClick={onNavigateToSimulation}
          >
            Перейти к симуляции →
          </button>
        </div>
      )}
    </div>
  );
}
