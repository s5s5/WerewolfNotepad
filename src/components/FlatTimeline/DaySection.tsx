import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NightSection } from './NightSection';
import { SheriffElection } from './SheriffElection';
import { DaytimeSpeechSection } from './DaytimeSpeechSection';
import { VoteSection } from './VoteSection';
import { PkRoundSection } from './PkRoundSection';
import { ExitSpeechSection } from './ExitSpeechSection';
import { BadgeHandling } from './BadgeHandling';
import { PLAYER_COUNT } from '../../constants/roles';
import type { DayData } from '../../types/game';

interface Props {
  day: number;
  dayData: DayData;
}

const FirstNightDeathSpeech = ({ day, dayData }: Props) => {
  const { dispatch } = useGame();
  const deadPlayer =
    dayData.nightDeath?.type === 'deaths' ? dayData.nightDeath.players[0] : undefined;
  const [notes, setNotes] = useState(dayData.firstNightDeathSpeech?.notes || '');

  if (!deadPlayer) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5">
      <span className="mb-1.5 block text-[11px] font-bold text-slate-600">
        {deadPlayer}号 首夜死者遗言
      </span>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() =>
          dispatch({
            type: 'SET_FIRST_NIGHT_DEATH_SPEECH',
            day,
            player: deadPlayer,
            notes,
          })
        }
        rows={2}
        placeholder="记录遗言要点"
        className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
      />
    </div>
  );
};

export const DaySection = ({ day, dayData }: Props) => {
  const { dispatch } = useGame();
  const nonCandidates = Array.from({ length: PLAYER_COUNT }, (_, i) => i + 1);

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <h2 className="text-sm font-bold text-slate-800">第 {day} 天</h2>

      <NightSection
        day={day}
        nightDeath={dayData.nightDeath}
        onSet={(info) => dispatch({ type: 'SET_NIGHT_DEATH', day, info })}
      />

      {day === 1 && (
        <SheriffElection day={day} sheriff={dayData.sheriff} />
      )}

      {day > 1 && (
        <BadgeHandling
          badgeAction={dayData.badgeAction}
          onSet={(action, transferTo) =>
            dispatch({ type: 'SET_BADGE_ACTION', day, action, transferTo })
          }
        />
      )}

      <FirstNightDeathSpeech day={day} dayData={dayData} />

      <DaytimeSpeechSection day={day} daytime={dayData.daytime} />

      <VoteSection
        title="白天放逐投票"
        eligibleVoters={nonCandidates}
        records={dayData.dayVote?.records || []}
        onChange={(records) => dispatch({ type: 'SET_DAY_VOTE', day, records })}
      />

      {dayData.dayVote?.result && (
        <p className="text-[11px] font-bold text-rose-700">
          结果：
          {dayData.dayVote.result.type === 'exiled'
            ? `${dayData.dayVote.result.player}号 出局${
                dayData.dayVote.result.skillTrigger
                  ? `（${dayData.dayVote.result.skillTrigger}）`
                  : ''
              }`
            : '平票，进入 PK'}
        </p>
      )}

      {(dayData.dayVote?.records?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {dayData.dayVote?.records?.map((r) => (
            <button
              key={r.target}
              type="button"
              onClick={() =>
                dispatch({
                  type: 'SET_DAY_VOTE',
                  day,
                  result: { type: 'exiled', player: r.target },
                })
              }
              className={`rounded border px-2 py-0.5 text-[11px] font-bold ${
                dayData.dayVote?.result?.type === 'exiled' &&
                dayData.dayVote.result.player === r.target
                  ? 'border-rose-500 bg-rose-100 text-rose-800'
                  : 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              判 {r.target}号 出局
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              dispatch({ type: 'SET_DAY_VOTE', day, result: { type: 'tied_pk' } })
            }
            className={`rounded border px-2 py-0.5 text-[11px] font-bold ${
              dayData.dayVote?.result?.type === 'tied_pk'
                ? 'border-slate-500 bg-slate-200 text-slate-800'
                : 'border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            平票
          </button>
        </div>
      )}

      <PkRoundSection day={day} scope="day" pkRounds={dayData.pkRounds || []} />

      <ExitSpeechSection
        exitSpeech={dayData.exitSpeech}
        candidatePlayer={
          dayData.dayVote?.result?.type === 'exiled'
            ? dayData.dayVote.result.player
            : undefined
        }
        onSet={(player, notes) =>
          dispatch({ type: 'SET_EXIT_SPEECH', day, player, notes })
        }
      />
    </section>
  );
};
