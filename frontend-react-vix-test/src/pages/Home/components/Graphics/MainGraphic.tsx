import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { Stack, Typography } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZGlobalVar } from "../../../../stores/useZGlobalVar";
import { useChartData } from "../../../../hooks/useChartData";
import { CHART_THRESHOLDS } from "../../../../constants/chartConfig";

export const MainGraphic = () => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { currentVMName: vmName } = useZGlobalVar();

  const { chartData, lastValue: lastCpuUsage } = useChartData({
    chartType: "cpu",
  });

  const { warning: cpuWarning, danger: cpuDanger } = CHART_THRESHOLDS.cpu;

  const valueColor =
    lastCpuUsage < cpuWarning
      ? theme[mode].ok
      : lastCpuUsage < cpuDanger
        ? theme[mode].warning
        : theme[mode].danger;

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          padding: "2px",
          color: theme[mode].primary,
          fontWeight: "500",
          paddingRight: "24px",
        }}
      >
        {`${t("graphics.cpuUsage")} - ${vmName}`}
        <span style={{ color: theme[mode].gray, fontWeight: "300" }}>
          {" "}
          {t("graphics.currentUse")}{" "}
          <span style={{ color: valueColor }}>{lastCpuUsage.toFixed(3)}%</span>
        </span>
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
              value: t("graphics.cpuUsage"),
              angle: -90,
              position: "insideLeft",
              fill: theme[mode].dark,
              fontSize: 10,
            }}
            tick={{ fill: theme[mode].dark, fontSize: 10 }}
            domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.16)]}
          />
          <Tooltip
            formatter={(value) => parseFloat(value as string).toFixed(2)}
          />
          <Legend />
          <ReferenceLine y={cpuWarning} stroke="yellow" strokeDasharray="3 3" />
          <ReferenceLine y={cpuDanger} stroke="red" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            dot={false}
            isAnimationActive={false}
            legendType="none"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Stack>
  );
};
