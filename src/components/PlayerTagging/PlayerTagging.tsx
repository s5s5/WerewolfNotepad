import { useGame } from '../../context/GameContext';
import {
  ACTION_TAGS,
  ROLE_TAGS,
  STATUS_TAGS,
  type TagOption,
} from '../../constants/tags';

const TagGroup = ({
  label,
  options,
}: {
  label: string;
  options: TagOption[];
}) => {
  const { state, dispatch } = useGame();

  return (
    <div className="flex items-start gap-2">
      <span className="w-12 flex-shrink-0 pt-0.5 text-[11px] font-medium text-slate-400">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() =>
              dispatch({
                type: 'TOGGLE_PLAYER_TAG',
                num: state.currentPlayer,
                tag: opt.label,
              })
            }
            className={`rounded border px-2 py-0.5 text-xs ${opt.className}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const ActiveTags = () => {
  const { state, dispatch } = useGame();
  const current = state.players.find((p) => p.num === state.currentPlayer);

  return (
    <div
      id="currentPlayerActiveTags"
      className="mb-2.5 flex min-h-[28px] flex-wrap items-center gap-1.5 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-1.5"
    >
      {!current || current.tags.length === 0 ? (
        <span className="text-[11px] text-slate-400 italic">
          暂无标记，请点击下方词汇添加
        </span>
      ) : (
        current.tags.map((tag) => (
          <span
            key={tag}
            title="点击移除该标记"
            onClick={() =>
              dispatch({ type: 'REMOVE_PLAYER_TAG', num: current.num, tag })
            }
            className="badge-chip flex cursor-pointer items-center gap-1 rounded-full border border-indigo-200 bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-800"
          >
            <span>{tag}</span>
            <span className="text-xs text-indigo-500 hover:text-indigo-900">
              ×
            </span>
          </span>
        ))
      )}
    </div>
  );
};

export const PlayerTagging = () => {
  const { state } = useGame();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
      <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-bold text-slate-700">
            模块一：玩家标记与状态
          </span>
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
            {state.currentPlayer}号玩家
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          点一下打标签 · 点标签即可移除
        </div>
      </div>

      <ActiveTags />

      <div className="space-y-2">
        <TagGroup label="底牌标注:" options={ROLE_TAGS} />
        <TagGroup label="信誉定性:" options={STATUS_TAGS} />
        <TagGroup label="行为死因:" options={ACTION_TAGS} />
      </div>
    </div>
  );
};
