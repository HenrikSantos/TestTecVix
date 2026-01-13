import { IFormatData } from "../types/socketType";
import { CHART_MOCK_CONFIG, ChartType } from "../constants/chartConfig";
import { formatTimeBR } from "./formatTime";

interface GenerateMockDataParams {
  count: number;
  chartType: ChartType;
}

/**
 * Gera dados mock para gráficos de monitoramento
 * @param count - Quantidade de pontos de dados a gerar
 * @param chartType - Tipo do gráfico (cpu, memory, disk)
 * @returns Array de dados formatados para o gráfico
 */
export const generateMockChartData = ({
  count,
  chartType,
}: GenerateMockDataParams): IFormatData[] => {
  const config = CHART_MOCK_CONFIG[chartType];
  const data: IFormatData[] = [];
  const now = new Date();

  let baseValue =
    config.baseValue.min +
    Math.random() * (config.baseValue.max - config.baseValue.min);

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5000);
    const timeString = formatTimeBR(time);

    const variation = (Math.random() - 0.5) * config.variation;
    baseValue = Math.max(
      config.bounds.min,
      Math.min(config.bounds.max, baseValue + variation),
    );

    data.push({
      time: timeString,
      value: baseValue,
    });
  }

  return data;
};

interface GenerateNewDataPointParams {
  previousValue: number;
  chartType: ChartType;
}

/**
 * Gera um novo ponto de dados baseado no valor anterior
 * @param previousValue - Valor anterior para calcular variação
 * @param chartType - Tipo do gráfico (cpu, memory, disk)
 * @returns Novo ponto de dados
 */
export const generateNewDataPoint = ({
  previousValue,
  chartType,
}: GenerateNewDataPointParams): IFormatData => {
  const config = CHART_MOCK_CONFIG[chartType];

  const variation = (Math.random() - 0.5) * config.variation;
  const newValue = Math.max(
    config.bounds.min,
    Math.min(config.bounds.max, previousValue + variation),
  );

  return {
    time: formatTimeBR(),
    value: newValue,
  };
};
