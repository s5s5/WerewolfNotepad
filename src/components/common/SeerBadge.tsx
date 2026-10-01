import { useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { getSeerClaimers } from '../../utils/seer';

const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫';

export const SeerBadge = ({ player }: { player: number }) => {
  const { state } = useGame();
  const seers = useMemo(() => getSeerClaimers(state), [state]);
  const idx = seers.indexOf(player);
  if (idx < 0) return null;
  return (
    <span className="ml-1 flex-shrink-0 rounded bg-rose-600 px-1 text-[9px] font-bold text-white">
      预{seers.length >= 2 ? (CIRCLED[idx] ?? idx + 1) : ''}
    </span>
  );
};
