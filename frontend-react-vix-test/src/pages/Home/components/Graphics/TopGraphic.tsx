import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { Stack, Typography } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZGlobalVar } from "../../../../stores/useZGlobalVar";
import { useChartData } from "../../../../hooks/useChartData";
import { CHART_THRESHOLDS } from "../../../../constants/chartConfig";

const MAX_PERCENTAGE = 1;

interface GaugeDataItem {
  value: number;
}

const generateGaugeData = (value: number): GaugeDataItem[] => {
  const { warning: diskWarning, danger: diskDanger } = CHART_THRESHOLDS.disk;
  const warningThreshold = diskWarning / 100;
  const dangerThreshold = diskDanger / 100;

  if (value < warningThreshold) {
    return [
      { value },
      { value: warningThreshold - value },
      { value: dangerThreshold - warningThreshold },
      { value: 0 },
      { value: MAX_PERCENTAGE - dangerThreshold },
    ];
  }

  if (value < dangerThreshold) {
    return [
      { value: 0 },
      { value: 0 },
      { value },
      {
        value: dangerThreshold - warningThreshold - (value - warningThreshold),
      },
      { value: MAX_PERCENTAGE - dangerThreshold },
    ];
  }

  return [
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value },
    { value: MAX_PERCENTAGE - value },
  ];
};

export const TopGraphic = () => {
  const [isLoading] = useState(false);
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { currentVMName: vmName } = useZGlobalVar();

  const { chartData } = useChartData({
    chartType: "disk",
  });

  const COLORS = [
    theme[mode].ok,
    theme[mode].grayLight,
    theme[mode].warning,
    theme[mode].grayLight,
    theme[mode].danger,
    theme[mode].grayLight,
  ];

  const { warning: diskWarning, danger: diskDanger } = CHART_THRESHOLDS.disk;

  const diskUsage = (chartData[chartData.length - 1]?.value || 0) / 100;

  const valueColor =
    diskUsage < diskWarning / 100
      ? theme[mode].ok
      : diskUsage < diskDanger / 100
        ? theme[mode].warning
        : theme[mode].danger;

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          paddingLeft: "20px",
          fontSize: "12px",
          alignSelf: "flex-start",
          color: theme[mode].primary,
        }}
      >
        {`${t("graphics.diskUsage")} - ${vmName}`}
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        {!isLoading ? (
          <PieChart>
            <Pie
              data={generateGaugeData(diskUsage)}
              startAngle={180}
              endAngle={0}
              innerRadius="85%"
              outerRadius="120%"
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
              animationDuration={2000}
              cx="50%"
              cy="75%"
            >
              {generateGaugeData(diskUsage).map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index] || "#ccc"} />
              ))}
              <Label
                value={`${(diskUsage * 100).toFixed(2)}%`}
                position="center"
                style={{
                  fill: valueColor,
                  fontSize: "14px",
                  fontWeight: "bold",
                  textAnchor: "middle",
                }}
              />
            </Pie>
          </PieChart>
        ) : (
          <></>
        )}
      </ResponsiveContainer>
    </Stack>
  );
};
