import { create } from 'zustand';
import type { SystemState } from '../types';

interface SystemStore extends SystemState {
  setWeather: (state: Partial<SystemState>) => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  load1: 0,
  load5: 0,
  load15: 0,
  uptime: 0,
  weatherState: 'clear',
  setWeather: (updates: Partial<SystemState>) => {
    set((state) => ({ ...state, ...updates }));
  },
}));
