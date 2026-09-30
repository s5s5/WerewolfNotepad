import { useGame } from '../../context/GameContext';
import { PLAYER_COUNT } from '../../constants/roles';
import { SpeechOrderControl } from './SpeechOrderControl';
import { PlayerSpeechCard } from './PlayerSpeechCard';
import { getSheriffAt } from '../../utils/sheriff';
import { getDeadBefore, getNightDead } from '../../utils/deaths';
import { computeSpeechOrder } from '../../utils/speechOrder';
import type { DayData } from '../../types/game';

interface Props {
  day: number;
  daytime: DayData['daytime'];
}

export const DaytimeSpeechSection = ({ day, daytime }: Props) => {
  const { state, dispatch } = useGame();
  const sheriff = getSheriffAt(state, day);

  const out = new Set([
    ...getDeadBefore(state, day),
    ...getNightDead(state, day),
  ]);
  const allPlayers = Array.from(
    { length: PLAYER_COUNT },
    (_, i) => i + 1,
  ).filter((p) => !out.has(p));
  const order = computeSpeechOrder(daytime.speechOrder, allPlayers, sheriff);

  return (
    <div
      data-stage="白天发言"
      className="space-y-2 rounded-lg border border-slate-200 bg-white p-2.5"
    >
      <span className="text-[11px] font-bold text-slate-700">白天正赛发言</span>

      <SpeechOrderControl
        order={daytime.speechOrder}
        sheriff={sheriff}
        disabledPlayers={[...out]}
        onSet={(o) =>
          dispatch({
            type: 'SET_SPEECH_ORDER',
            day,
            phase: 'daytime',
            order: o,
          })
        }
      />

      <div className="space-y-1.5">
        {order.map((p) => (
          <PlayerSpeechCard
            key={p}
            day={day}
            phase="daytime"
            playerNum={p}
            card={daytime.speeches[p] || {}}
          />
        ))}
      </div>
    </div>
  );
};
