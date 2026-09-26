import { useGame } from '../../context/GameContext';
import { DAY_COUNT } from '../../types/game';
import { DaySection } from './DaySection';

export const FlatTimeline = () => {
  const { state } = useGame();

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-3.5">
      {Array.from({ length: DAY_COUNT }, (_, i) => i + 1).map((day) => (
        <DaySection key={day} day={day} dayData={state.days[day]} />
      ))}
    </div>
  );
};
