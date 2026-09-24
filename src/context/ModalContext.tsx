import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PickerConfig } from '../types/game';

interface ModalContextValue {
  nightDeathOpen: boolean;
  voteOpen: boolean;
  seerCheckOpen: boolean;
  pickerConfig: PickerConfig | null;
  openNightDeathModal: () => void;
  closeNightDeathModal: () => void;
  openVoteModal: () => void;
  closeVoteModal: () => void;
  openSeerCheckModal: () => void;
  closeSeerCheckModal: () => void;
  openPlayerPicker: (config: PickerConfig) => void;
  closePlayerPicker: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [nightDeathOpen, setNightDeathOpen] = useState(false);
  const [voteOpen, setVoteOpen] = useState(false);
  const [seerCheckOpen, setSeerCheckOpen] = useState(false);
  const [pickerConfig, setPickerConfig] = useState<PickerConfig | null>(null);

  const value: ModalContextValue = {
    nightDeathOpen,
    voteOpen,
    seerCheckOpen,
    pickerConfig,
    openNightDeathModal: () => setNightDeathOpen(true),
    closeNightDeathModal: () => setNightDeathOpen(false),
    openVoteModal: () => setVoteOpen(true),
    closeVoteModal: () => setVoteOpen(false),
    openSeerCheckModal: () => setSeerCheckOpen(true),
    closeSeerCheckModal: () => setSeerCheckOpen(false),
    openPlayerPicker: (config) => setPickerConfig(config),
    closePlayerPicker: () => setPickerConfig(null),
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModalActions = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModalActions 必须在 ModalProvider 内使用');
  return ctx;
};
