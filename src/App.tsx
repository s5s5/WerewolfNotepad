import { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header/Header';
import { FlatTimeline } from './components/FlatTimeline/FlatTimeline';
import { TimelineNav } from './components/FlatTimeline/TimelineNav';
import { MentionsPanel } from './components/MentionsPanel/MentionsPanel';

const KeyboardShortcuts = () => {
  const { dispatch } = useGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toUpperCase();
      const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

      if (e.ctrlKey && e.key === 'Enter') {
        return;
      }
      if (e.key === 'ArrowLeft' && !isTyping) {
        e.preventDefault();
        dispatch({ type: 'PREV_PLAYER' });
      } else if (e.key === 'ArrowRight' && !isTyping) {
        e.preventDefault();
        dispatch({ type: 'NEXT_PLAYER' });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return null;
};

const AppContent = () => {
  return (
    <>
      <KeyboardShortcuts />
      <Header />
      <div className="flex min-h-0 flex-1">
        <main className="relative flex min-w-0 flex-1 overflow-hidden bg-white">
          <TimelineNav />
          <div id="timeline-scroll" className="flex-1 overflow-y-auto">
            <FlatTimeline />
          </div>
        </main>
        <MentionsPanel />
      </div>
    </>
  );
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
