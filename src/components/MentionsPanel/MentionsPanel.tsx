import { useEffect, useMemo, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { getSheriffAt } from '../../utils/sheriff';
import { PLAYER_COUNT } from '../../constants/roles';
import type { MentionScene } from '../../types/game';
import {
  collectAllMentions,
  collectSpeeches,
  collectVoteLines,
  mentionTone,
  SCENE_LABELS,
} from '../../utils/mentions';

const PLAYERS = Array.from({ length: PLAYER_COUNT }, (_, i) => i + 1);

const TONE_CLASS = {
  support: 'text-emerald-600',
  oppose: 'text-orange-600',
  none: 'text-slate-800',
};

const when = (day: number, scene: MentionScene) =>
  `第${day}天 · ${SCENE_LABELS[scene]}`;

export const MentionsPanel = () => {
  const { state, dispatch } = useGame();
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    cardRefs.current[state.currentPlayer]?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [state.currentPlayer]);

  const mentionsByTarget = useMemo(() => {
    const map = new Map<number, ReturnType<typeof collectAllMentions>>();
    collectAllMentions(state).forEach((m) => {
      map.set(m.target, [...(map.get(m.target) || []), m]);
    });
    return map;
  }, [state]);

  const votesByVoter = useMemo(() => {
    const map = new Map<number, ReturnType<typeof collectVoteLines>>();
    collectVoteLines(state).forEach((v) => {
      map.set(v.voter, [...(map.get(v.voter) || []), v]);
    });
    return map;
  }, [state]);

  const currentSheriff = getSheriffAt(state, Object.keys(state.days).length);

  const speechesBySpeaker = useMemo(() => {
    const map = new Map<number, ReturnType<typeof collectSpeeches>>();
    collectSpeeches(state).forEach((e) => {
      map.set(e.speaker, [...(map.get(e.speaker) || []), e]);
    });
    return map;
  }, [state]);

  return (
    <aside className="hidden w-80 flex-shrink-0 flex-col border-l border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-200 px-3 py-2">
        <h3 className="text-xs font-bold text-slate-700">玩家记录</h3>
      </div>
      <div className="flex-1 space-y-2.5 overflow-y-auto p-2.5">
        {PLAYERS.map((num) => {
          const isMe = String(num) === state.mySeat;
          const isSelected = state.currentPlayer === num;
          const speeches = speechesBySpeaker.get(num) || [];
          const votes = votesByVoter.get(num) || [];
          const tags = state.players.find((pl) => pl.num === num)?.tags || [];
          const mentions = mentionsByTarget.get(num) || [];
          return (
            <div
              key={num}
              ref={(el) => {
                cardRefs.current[num] = el;
              }}
              onClick={() => dispatch({ type: 'SELECT_PLAYER', num })}
              className={`cursor-pointer rounded-lg border p-2 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-400'
                  : isMe
                    ? 'border-amber-300'
                    : 'border-slate-200'
              }`}
            >
              <span className="mb-1 block text-[11px] font-bold text-slate-800">
                {num}号{isMe && '（我）'}
                {currentSheriff === num && (
                  <span className="ml-1 rounded bg-amber-500 px-1 text-[9px] text-white">
                    警长
                  </span>
                )}
              </span>

              {tags.length > 0 && (
                <div className="mb-1.5 flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-indigo-200 bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {votes.length > 0 && (
                <div className="mb-1.5">
                  <span className="mb-0.5 block text-[10px] font-bold text-emerald-600">
                    投票
                  </span>
                  <ul className="space-y-0.5">
                    {votes.map((v, idx) => (
                      <li
                        key={idx}
                        className="text-[10.5px] leading-relaxed text-slate-600"
                      >
                        {when(v.day, v.scene)}
                        {v.round ? ` · 第${v.round}轮` : ''}
                        {' → '}
                        <span className="font-semibold text-slate-800">
                          投给 {v.target}号
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-1.5">
                <span className="mb-0.5 block text-[10px] font-bold text-indigo-600">
                  发言记录
                </span>
                {speeches.length === 0 ? (
                  <p className="text-[10.5px] text-slate-300">暂无</p>
                ) : (
                  <ul className="space-y-1">
                    {speeches.map((e, idx) => (
                      <li
                        key={idx}
                        className="text-[10.5px] leading-relaxed text-slate-600"
                      >
                        <span className="text-slate-400">
                          {when(e.day, e.scene)}
                          {e.round ? ` · 第${e.round}轮` : ''}
                        </span>
                        {e.lines.map((l, i) => (
                          <div
                            key={i}
                            className="pl-2 font-medium text-slate-800"
                          >
                            · {l}
                          </div>
                        ))}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-dashed border-slate-200 pt-1.5">
                <span className="mb-0.5 block text-[10px] font-bold text-rose-600">
                  被提及记录
                </span>
                {mentions.length === 0 ? (
                  <p className="text-[10.5px] text-slate-300">暂无</p>
                ) : (
                  <ul className="space-y-0.5">
                    {mentions.map((m, idx) => (
                      <li
                        key={idx}
                        className="text-[10.5px] leading-relaxed text-slate-600"
                      >
                        <span className="font-bold text-slate-800">
                          {m.speaker ? `${m.speaker}号` : '系统'}
                        </span>
                        {` · ${when(m.day, m.scene)}`}
                        {m.round ? ` · 第${m.round}轮` : ''}
                        {' · '}
                        <span
                          className={`font-semibold ${TONE_CLASS[mentionTone(m.action) ?? 'none']}`}
                        >
                          {m.action}
                        </span>
                        {m.reason && (
                          <span className="text-slate-400">（{m.reason}）</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
