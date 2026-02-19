import { useState } from 'react';
import SimulationForm from './components/SimulationForm';
import ResultsChart from './components/ResultsChart';
import { getResults } from './api/enermonApi';
import styles from './styles/App.module.css';

function App() {
  const [results, setResults] = useState([]);

  const handleSimulationStart = async (id) => {
    const data = await getResults(id);
    setResults(data);
  };

  return (
    <div className={styles.container}>
      <h1>EnerMon</h1>
      <SimulationForm onSimulationStart={handleSimulationStart} />
      {results.length > 0 && <ResultsChart results={results} />}
    </div>
  );
}

export default App;
