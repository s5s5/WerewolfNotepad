import { useGame } from '../../context/GameContext';
import { getBoard } from '../../constants/boards';
import { ConfirmModal } from './ConfirmModal';

interface Props {
  targetBoardId: string | null;
  onClose: () => void;
}

export const BoardSwitchConfirmModal = ({ targetBoardId, onClose }: Props) => {
  const { dispatch, showToast } = useGame();
  const target = targetBoardId ? getBoard(targetBoardId) : null;

  return (
    <ConfirmModal
      open={!!target}
      title={`切换为「${target?.name ?? ''}」？`}
      description="切换板子将清空当前全部记录（座位号保留）。"
      confirmText="确认切换"
      onClose={onClose}
      onConfirm={() => {
        if (!target) return;
        dispatch({ type: 'SET_BOARD', boardId: target.id });
        onClose();
        showToast(`已切换为${target.name}`);
      }}
    />
  );
};
