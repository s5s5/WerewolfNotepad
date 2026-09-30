import { useGame } from '../../context/GameContext';
import { DayDeathSection } from './DayDeathSection';
import { NightSection } from './NightSection';
import { SheriffElection } from './SheriffElection';
import { DaytimeSpeechSection } from './DaytimeSpeechSection';
import { VoteSection } from './VoteSection';
import { PkRoundSection } from './PkRoundSection';
import { PlayerSpeechCard } from './PlayerSpeechCard';
import { BadgeHandling } from './BadgeHandling';
import { PLAYER_COUNT } from '../../constants/roles';
import { getDeadBefore } from '../../utils/deaths';
import { getBadgeStateAt } from '../../utils/sheriff';
import type { DayData } from '../../types/game';

interface Props {
  day: number;
  dayData: DayData;
}

const FirstNightDeathSpeech = ({ day, dayData }: Props) => {
  const deadPlayers =
    dayData.nightDeath?.type === 'deaths' ? dayData.nightDeath.players : [];

  if (deadPlayers.length === 0) return null;

  const sheriffResult = dayData.sheriff?.result?.type;
  const sheriffDone =
    day !== 1 ||
    sheriffResult === 'elected' ||
    sheriffResult === 'badge_lost' ||
    sheriffResult === 'aborted';

  if (!sheriffDone) {
    return (
      <p className="text-[11px] text-slate-400">警选结束后记录首夜死者遗言</p>
    );
  }

  return (
    <div data-stage="首夜遗言" className="space-y-1.5">
      {deadPlayers.map((p) => (
        <div
          key={p}
          className="space-y-1.5 rounded-lg border border-slate-200 bg-white p-2.5"
        >
          <span className="block text-[11px] font-bold text-slate-600">
            {p}号 首夜死者遗言
          </span>
          <PlayerSpeechCard
            day={day}
            phase="firstNightDeath"
            playerNum={p}
            card={dayData.firstNightDeathSpeeches?.[p] || {}}
          />
        </div>
      ))}
    </div>
  );
};

export const DaySection = ({ day, dayData }: Props) => {
  const { state, dispatch } = useGame();
  const badge = getBadgeStateAt(state, day);
  const nonCandidates = Array.from({ length: PLAYER_COUNT }, (_, i) => i + 1);

  return (
    <section
      data-day={day}
      className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3"
    >
      <h2 className="text-sm font-bold text-slate-800">
        第 {day} 天
        {badge.sheriff && (
          <span className="ml-2 text-[11px] text-amber-700">
            当前警长：{badge.sheriff}号
          </span>
        )}
      </h2>

      {day === 1 && <SheriffElection day={day} sheriff={dayData.sheriff} />}

      <NightSection
        day={day}
        nightDeath={dayData.nightDeath}
        onSet={(info) => dispatch({ type: 'SET_NIGHT_DEATH', day, info })}
      />

      <BadgeHandling
        key={`badge-${day}-${badge.sheriff ?? ''}`}
        badgeAction={dayData.badgeAction}
        currentSheriff={badge.sheriff}
        torn={badge.torn}
        onSet={(action, transferTo) =>
          dispatch({ type: 'SET_BADGE_ACTION', day, action, transferTo })
        }
      />

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
              dispatch({
                type: 'SET_DAY_VOTE',
                day,
                result: { type: 'tied_pk' },
              })
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

      <DayDeathSection
        key={`dayDeath-${day}-${(dayData.dayDeaths ?? []).join(',')}`}
        day={day}
        dayDeaths={dayData.dayDeaths}
        excluded={getDeadBefore(state, day)}
        onSet={(players) => dispatch({ type: 'SET_DAY_DEATHS', day, players })}
      />

      <ExitSpeech day={day} dayData={dayData} />
    </section>
  );
};

const ExitSpeech = ({ day, dayData }: Props) => {
  const exiled =
    dayData.dayVote?.result?.type === 'exiled'
      ? [dayData.dayVote.result.player]
      : [];
  const players = Array.from(
    new Set([...exiled, ...(dayData.dayDeaths ?? [])]),
  );

  if (players.length === 0) return null;

  return (
    <div data-stage="出局遗言" className="space-y-1.5">
      {players.map((p) => (
        <div
          key={p}
          className="space-y-1.5 rounded-lg border border-slate-200 bg-white p-2.5"
        >
          <span className="block text-[11px] font-bold text-slate-600">
            {p}号 出局遗言
          </span>
          <PlayerSpeechCard
            day={day}
            phase="exitSpeech"
            playerNum={p}
            card={dayData.exitSpeeches?.[p] || {}}
          />
        </div>
      ))}
    </div>
  );
};
