import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Bar,
} from "recharts";
import { Stack, Typography } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZGlobalVar } from "../../../../stores/useZGlobalVar";
import { useChartData } from "../../../../hooks/useChartData";
import { CHART_THRESHOLDS } from "../../../../constants/chartConfig";

export const BottomGraphic = () => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { currentVMName: vmName } = useZGlobalVar();

  const { chartData, lastValue } = useChartData({
    chartType: "memory",
  });

  const lastMemoryData = Number(lastValue.toFixed(2));
  const { danger: memoryDanger } = CHART_THRESHOLDS.memory;

  const valueColor =
    lastMemoryData < memoryDanger ? theme[mode].ok : theme[mode].danger;

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          color: theme[mode].primary,
          fontSize: "12px",
          fontWeight: "500",
          marginLeft: "20px",
        }}
      >
        {`${t("graphics.memoryUsage")} - ${vmName}`}{" "}
        <span style={{ color: theme[mode].gray, fontWeight: "300" }}>
          {t("graphics.currentUse")}{" "}
          <span style={{ color: valueColor }}>{lastMemoryData}%</span>
        </span>
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme[mode].gray} />
          <XAxis
            dataKey="time"
            label={{
              value: t("graphics.time"),
              position: "insideBottomRight",
              offset: -5,
              fill: theme[mode].dark,
              fontSize: 10,
            }}
            tick={{ fill: theme[mode].dark, fontSize: 10 }}
          />
          <YAxis
            label={{
              value: t("graphics.memoryUsage"),
              angle: -90,
              position: "insideLeft",
              fill: theme[mode].dark,
              fontSize: 10,
              dy: 48,
            }}
            tick={{ fill: theme[mode].dark, fontSize: 10 }}
            domain={[0, (dataMax: number) => (dataMax * 1.16).toFixed(1)]}
          />
          <Tooltip
            formatter={(value) => parseFloat(value as string).toFixed(2)}
          />
          <Legend />
          <ReferenceLine y={memoryDanger} stroke="red" strokeDasharray="3 3" />
          <Bar dataKey="value" fill="#413ea0" legendType="none" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ff7300"
            dot={false}
            isAnimationActive={false}
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Stack>
  );
};
