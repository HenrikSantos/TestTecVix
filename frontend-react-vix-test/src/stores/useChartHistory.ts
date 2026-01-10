import { create } from "zustand";
import { IFormatData } from "../types/socketType";

interface ChartHistoryState {
  cpuHistory: Record<string, IFormatData[]>;
  memoryHistory: Record<string, IFormatData[]>;
  diskHistory: Record<string, IFormatData[]>;
  updateCpuHistory: (vmId: string, data: IFormatData[]) => void;
  updateMemoryHistory: (vmId: string, data: IFormatData[]) => void;
  updateDiskHistory: (vmId: string, data: IFormatData[]) => void;
}

export const useChartHistory = create<ChartHistoryState>((set) => ({
  cpuHistory: {},
  memoryHistory: {},
  diskHistory: {},
  updateCpuHistory: (vmId, data) =>
    set((state) => ({ cpuHistory: { ...state.cpuHistory, [vmId]: data } })),
  updateMemoryHistory: (vmId, data) =>
    set((state) => ({
      memoryHistory: { ...state.memoryHistory, [vmId]: data },
    })),
  updateDiskHistory: (vmId, data) =>
    set((state) => ({ diskHistory: { ...state.diskHistory, [vmId]: data } })),
}));
