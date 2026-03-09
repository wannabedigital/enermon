import { useEffect, useState } from 'react';
import {
  getBuildings,
  getRooms,
  getConsumers,
  getConsumersByBuilding,
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

  // Кнопка: здание выбрано И есть потребители в здании
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
        />

        {activeBuilding && (
          <RoomList
            rooms={rooms}
            activeId={activeRoom?.id}
            onSelect={setActiveRoom}
          />
        )}

        {activeRoom && <ConsumerList consumers={consumers} />}
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
