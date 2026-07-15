import JobTracker from './JobTracker';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-bg-primary transition-colors duration-200">
      <JobTracker theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
