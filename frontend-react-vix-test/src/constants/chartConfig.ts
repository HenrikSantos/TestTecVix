/**
 * Configurações dos gráficos de monitoramento de VMs
 */

export const CHART_THRESHOLDS = {
  cpu: {
    warning: 70,
    danger: 90,
  },
  memory: {
    danger: 80,
  },
  disk: {
    warning: 60,
    danger: 85,
  },
} as const;

export const CHART_UPDATE_INTERVALS = {
  cpu: 5000,
  memory: 5000,
  disk: 10000,
} as const;

export const CHART_DATA_POINTS = {
  cpu: 20,
  memory: 20,
  disk: 1,
} as const;

export const CHART_MOCK_CONFIG = {
  cpu: {
    baseValue: { min: 30, max: 50 },
    variation: 15,
    bounds: { min: 5, max: 95 },
  },
  memory: {
    baseValue: { min: 40, max: 65 },
    variation: 10,
    bounds: { min: 20, max: 95 },
  },
  disk: {
    baseValue: { min: 35, max: 75 },
    variation: 3,
    bounds: { min: 20, max: 95 },
  },
} as const;

export type ChartType = keyof typeof CHART_THRESHOLDS;
