import { useState, useEffect, useCallback } from "react";
import { IFormatData } from "../types/socketType";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import { useChartHistory } from "../stores/useChartHistory";
import {
  generateMockChartData,
  generateNewDataPoint,
} from "../utils/generateMockChartData";
import {
  CHART_UPDATE_INTERVALS,
  CHART_DATA_POINTS,
  ChartType,
} from "../constants/chartConfig";

type HistoryKey = "cpuHistory" | "memoryHistory" | "diskHistory";
type UpdateFn =
  | "updateCpuHistory"
  | "updateMemoryHistory"
  | "updateDiskHistory";

interface ChartTypeConfig {
  historyKey: HistoryKey;
  updateFn: UpdateFn;
}

const CHART_TYPE_CONFIG: Record<ChartType, ChartTypeConfig> = {
  cpu: {
    historyKey: "cpuHistory",
    updateFn: "updateCpuHistory",
  },
  memory: {
    historyKey: "memoryHistory",
    updateFn: "updateMemoryHistory",
  },
  disk: {
    historyKey: "diskHistory",
    updateFn: "updateDiskHistory",
  },
};

interface UseChartDataParams {
  chartType: ChartType;
}

interface UseChartDataReturn {
  chartData: IFormatData[];
  lastValue: number;
}

/**
 * Hook customizado para gerenciar dados de gráficos de monitoramento
 * Encapsula a lógica de cache, geração de dados mock e atualização periódica
 */
export const useChartData = ({
  chartType,
}: UseChartDataParams): UseChartDataReturn => {
  const { currentIdVM } = useZGlobalVar();
  const chartHistory = useChartHistory();

  const config = CHART_TYPE_CONFIG[chartType];
  const updateHistory = chartHistory[config.updateFn];

  const [chartData, setChartData] = useState<IFormatData[]>([]);

  const addNewDataPoint = useCallback(() => {
    setChartData((prevData) => {
      const lastValue = prevData[prevData.length - 1]?.value || 50;
      const newPoint = generateNewDataPoint({
        previousValue: lastValue,
        chartType,
      });

      const dataPoints = CHART_DATA_POINTS[chartType];
      const newData =
        dataPoints === 1 ? [newPoint] : [...prevData.slice(1), newPoint];

      if (currentIdVM) {
        updateHistory(String(currentIdVM), newData);
      }

      return newData;
    });
  }, [currentIdVM, updateHistory, chartType]);

  useEffect(() => {
    if (!currentIdVM) return;

    const cachedData =
      useChartHistory.getState()[config.historyKey][String(currentIdVM)];

    if (cachedData && cachedData.length > 0) {
      setChartData(cachedData);
    } else {
      const initialData = generateMockChartData({
        count: CHART_DATA_POINTS[chartType],
        chartType,
      });
      setChartData(initialData);
      updateHistory(String(currentIdVM), initialData);
    }

    const interval = setInterval(
      addNewDataPoint,
      CHART_UPDATE_INTERVALS[chartType],
    );

    return () => clearInterval(interval);
  }, [
    currentIdVM,
    addNewDataPoint,
    updateHistory,
    chartType,
    config.historyKey,
  ]);

  const lastValue = chartData[chartData.length - 1]?.value || 0;

  return {
    chartData,
    lastValue,
  };
};
