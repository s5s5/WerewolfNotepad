import { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { ModalProvider } from './context/ModalContext';
import { Header } from './components/Header/Header';
import { Timeline } from './components/Timeline/Timeline';
import { SeatsMatrix } from './components/SeatsMatrix/SeatsMatrix';
import { PlayerTagging } from './components/PlayerTagging/PlayerTagging';
import { SpeechComposer } from './components/SpeechComposer/SpeechComposer';
import { PlayerPickerModal } from './components/modals/PlayerPickerModal';
import { SeerCheckModal } from './components/modals/SeerCheckModal';
import { NightDeathModal } from './components/modals/NightDeathModal';
import { VoteModal } from './components/modals/VoteModal';

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
      <main className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        <Timeline />
        <section className="flex h-[60%] flex-1 flex-col overflow-hidden bg-white md:h-full">
          <SeatsMatrix />
          <div className="flex-1 space-y-3.5 overflow-y-auto p-3.5">
            <PlayerTagging />
            <SpeechComposer />
          </div>
        </section>
      </main>

      <PlayerPickerModal />
      <SeerCheckModal />
      <NightDeathModal />
      <VoteModal />
    </>
  );
};

function App() {
  return (
    <GameProvider>
      <ModalProvider>
        <AppContent />
      </ModalProvider>
    </GameProvider>
  );
}

export default App;
