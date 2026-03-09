import { useState } from 'react';
import ModelEditor from './pages/ModelEditor';
import SimulationForm from './components/SimulationForm';
import ResultsChart from './components/ResultsChart';
import { getResults, getSummary } from './api/enermonApi';
import styles from './styles/App.module.css';

function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [lastSimulationId, setLastSimulationId] = useState(null);

  // ← Храним выбранное здание
  const [activeBuilding, setActiveBuilding] = useState(null);

  const handleSimulationStart = async (id) => {
    setLastSimulationId(id);
    const data = await getResults(id);
    const summ = await getSummary(id);
    setResults(data);
    setSummary(summ);
    setActiveTab('results');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>EnerMon</h1>
        <nav className={styles.nav}>
          <button
            className={activeTab === 'editor' ? styles.active : ''}
            onClick={() => setActiveTab('editor')}
          >
            Редактор модели
          </button>
          <button
            className={activeTab === 'simulation' ? styles.active : ''}
            onClick={() => setActiveTab('simulation')}
          >
            Симуляция
          </button>
          <button
            className={activeTab === 'results' ? styles.active : ''}
            onClick={() => setActiveTab('results')}
            disabled={!lastSimulationId}
          >
            Результаты
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        {activeTab === 'editor' && (
          // ← ПЕРЕДАЁМ ОБА ПРОПСА:
          <ModelEditor
            onNavigateToSimulation={() => setActiveTab('simulation')}
            onBuildingSelect={setActiveBuilding}
          />
        )}

        {activeTab === 'simulation' && (
          <SimulationForm
            buildingId={activeBuilding?.id}
            onSimulationStart={handleSimulationStart}
          />
        )}

        {activeTab === 'results' && results.length > 0 && (
          <ResultsChart results={results} summary={summary} />
        )}
      </main>
    </div>
  );
}

export default App;
