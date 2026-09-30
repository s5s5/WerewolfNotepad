import { useGame } from '../../context/GameContext';
import { ConfirmModal } from './ConfirmModal';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ResetConfirmModal = ({ open, onClose }: Props) => {
  const { dispatch, showToast } = useGame();

  return (
    <ConfirmModal
      open={open}
      title="清空全场对局？"
      description="将清空所有玩家发言、席位标记、死者与票型记录，轮次回到第 1 天。"
      confirmText="确认清空"
      onClose={onClose}
      onConfirm={() => {
        dispatch({ type: 'RESET_ALL' });
        onClose();
        showToast('全场对局已清空重置');
      }}
    />
  );
};
