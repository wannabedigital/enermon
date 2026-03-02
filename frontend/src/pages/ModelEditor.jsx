import { useEffect, useState } from 'react';
import { getBuildings, getRooms, getConsumers } from '../api/enermonApi';
import BuildingForm from '../components/BuildingForm';
import BuildingList from '../components/BuildingList';
import RoomForm from '../components/RoomForm';
import RoomList from '../components/RoomList';
import ConsumerForm from '../components/ConsumerForm';
import ConsumerList from '../components/ConsumerList';
import styles from '../styles/ModelEditor.module.css';

export default function ModelEditor({ onNavigateToSimulation }) {
  const [buildings, setBuildings] = useState([]);
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [consumers, setConsumers] = useState([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      const data = await getBuildings();
      setBuildings(data);
    };
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (!activeBuilding) return;
    const fetchRooms = async () => {
      const data = await getRooms(activeBuilding.id);
      setRooms(data);
      setActiveRoom(null);
      setConsumers([]);
    };
    fetchRooms();
  }, [activeBuilding]);

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
  };

  const totalConsumers = consumers.length;
  const canSimulate = totalConsumers > 0;

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
          onSelect={setActiveBuilding}
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
