import { usePosition } from '../../utils/position';

export const CurrentPosition = () => {
  const { day, stage } = usePosition();
  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold whitespace-nowrap text-indigo-800">
      第 {day} 天{stage && ` · ${stage}`}
    </div>
  );
};
