import { useGame } from '../../../context/GameContext';
import {
  ACTION_TAGS,
  ROLE_TAGS,
  STATUS_TAGS,
  type TagOption,
} from '../../../constants/tags';

interface Props {
  playerNum: number;
}

const TagGroup = ({
  label,
  options,
  playerNum,
}: {
  label: string;
  options: TagOption[];
  playerNum: number;
}) => {
  const { state, dispatch } = useGame();
  const player = state.players.find((p) => p.num === playerNum);
  const tags = player?.tags || [];

  return (
    <div className="flex items-start gap-1.5">
      <span className="w-10 flex-shrink-0 pt-0.5 text-[10px] font-medium text-slate-400">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() =>
              dispatch({ type: 'TOGGLE_PLAYER_TAG', num: playerNum, tag: opt.label })
            }
            className={`rounded border px-1.5 py-0.5 text-[10px] transition ${opt.className} ${
              tags.includes(opt.label) ? 'ring-2 ring-offset-1' : 'opacity-70'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const PlayerStatusSection = ({ playerNum }: Props) => {
  const { state, dispatch } = useGame();
  const player = state.players.find((p) => p.num === playerNum);
  const tags = player?.tags || [];

  return (
    <div className="space-y-1.5 border-t border-dashed border-slate-200 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500">玩家标记</span>
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-end gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                onClick={() =>
                  dispatch({ type: 'REMOVE_PLAYER_TAG', num: playerNum, tag })
                }
                title="点击移除"
                className="cursor-pointer rounded-full border border-indigo-200 bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800"
              >
                {tag} ×
              </span>
            ))}
          </div>
        )}
      </div>
      <TagGroup label="底牌" options={ROLE_TAGS} playerNum={playerNum} />
      <TagGroup label="信誉" options={STATUS_TAGS} playerNum={playerNum} />
      <TagGroup label="行为" options={ACTION_TAGS} playerNum={playerNum} />
    </div>
  );
};
