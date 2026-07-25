import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Transaction, User } from "../types";
import { SECTOR_THEMES } from "../const/sectorThemes.tsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

// HEXカラーを RGBA (半透明) に変換するヘルパー関数
const hexToRgba = (hex: string, alpha: number) => {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((char) => char + char).join("");
  }
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
};

export const BarChart = ({ monthlyTransactions, isLoading }: BarChartProps) => {
  const { sectorId } = useParams<{ sectorId: string }>();

  const currentSector: User = useMemo(() => {
    if (!sectorId) return "sectorL";
    const normalized = sectorId.toLowerCase();
    if (normalized === "sectorl") return "sectorL";
    if (normalized === "sectori") return "sectorI";
    if (normalized === "sectora") return "sectorA";
    if (normalized === "shared") return "shared";
    return "sectorL";
  }, [sectorId]);

  const currentTheme = SECTOR_THEMES[currentSector] || SECTOR_THEMES.sectorL;

  const dailyData = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    monthlyTransactions.forEach((t) => {
      if (!map[t.date]) {
        map[t.date] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        map[t.date].income += t.amount;
      } else {
        map[t.date].expense += t.amount;
      }
    });
    return map;
  }, [monthlyTransactions]);

  const labels = Object.keys(dailyData).sort();

  // ★ 棒グラフの背景色を薄く(alpha: 0.45)し、枠線をくっきり(alpha: 0.9)指定
  const data = {
    labels,
    datasets: [
      {
        label: "ノルマ",
        data: labels.map((date) => dailyData[date].expense),
        backgroundColor: hexToRgba(currentTheme.expenseBgColor, 0.45),
        borderColor: hexToRgba(currentTheme.expenseBgColor, 0.9),
        borderWidth: 1.5,
        borderRadius: 4,
      },
      {
        label: "完了",
        data: labels.map((date) => dailyData[date].income),
        backgroundColor: hexToRgba(currentTheme.incomeBgColor, 0.45),
        borderColor: hexToRgba(currentTheme.incomeBgColor, 0.9),
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "日別収支",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {labels.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography color="text.secondary">データがありません</Typography>
        </Box>
      ) : (
        <Bar options={options} data={data} />
      )}
    </Box>
  );
};

export default BarChart;