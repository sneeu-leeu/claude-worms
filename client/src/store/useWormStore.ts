import { create } from 'zustand';
import type { WormInstance } from '../types';

interface WormStore {
  worms: Map<number, WormInstance>;
  selectedWormPid: number | null;
  spectatingWormPid: number | null;
  addWorm: (worm: WormInstance) => void;
  updateWorm: (worm: WormInstance) => void;
  removeWorm: (pid: number) => void;
  selectWorm: (pid: number | null) => void;
  setSpectating: (pid: number | null) => void;
  getAllWorms: () => WormInstance[];
  getWorm: (pid: number) => WormInstance | undefined;
}

export const useWormStore = create<WormStore>((set, get) => ({
  worms: new Map(),
  selectedWormPid: null,
  spectatingWormPid: null,

  addWorm: (worm: WormInstance) => {
    set((state) => {
      const newWorms = new Map(state.worms);
      newWorms.set(worm.pid, worm);
      return { worms: newWorms };
    });
  },

  updateWorm: (worm: WormInstance) => {
    set((state) => {
      const newWorms = new Map(state.worms);
      const existing = newWorms.get(worm.pid);
      if (existing) {
        newWorms.set(worm.pid, { ...existing, ...worm });
      }
      return { worms: newWorms };
    });
  },

  removeWorm: (pid: number) => {
    set((state) => {
      const newWorms = new Map(state.worms);
      newWorms.delete(pid);
      return {
        worms: newWorms,
        selectedWormPid: state.selectedWormPid === pid ? null : state.selectedWormPid,
        spectatingWormPid: state.spectatingWormPid === pid ? null : state.spectatingWormPid,
      };
    });
  },

  selectWorm: (pid: number | null) => {
    set({ selectedWormPid: pid });
  },

  setSpectating: (pid: number | null) => {
    set({ spectatingWormPid: pid });
  },

  getAllWorms: () => {
    return Array.from(get().worms.values());
  },

  getWorm: (pid: number) => {
    return get().worms.get(pid);
  },
}));
