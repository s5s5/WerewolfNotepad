import { useEffect } from 'react';
import { setPosition } from '../../utils/position';
import { useGame } from '../../context/GameContext';
import { DAY_COUNT } from '../../types/game';
import { DaySection } from './DaySection';

export const FlatTimeline = () => {
  const { state } = useGame();

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = main.getBoundingClientRect().top + 60;
      let best: Element | null = null;
      document.querySelectorAll('[data-stage]').forEach((el) => {
        if (el.getBoundingClientRect().top <= line) best = el;
      });
      const first = document.querySelector('[data-day]');
      const target = best ?? first;
      const dayEl = (target as Element | null)?.closest('[data-day]');
      if (!dayEl) return;
      const stage = best ? (best as Element).getAttribute('data-stage') : '';
      setPosition({
        day: Number(dayEl.getAttribute('data-day')),
        stage: stage ?? '',
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    main.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      main.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-3.5">
      {Array.from({ length: DAY_COUNT }, (_, i) => i + 1).map((day) => (
        <DaySection key={day} day={day} dayData={state.days[day]} />
      ))}
    </div>
  );
};
