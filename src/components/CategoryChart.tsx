import React, { useMemo, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { Transaction, User } from "../types";
import { SECTOR_THEMES, SECTOR_CATEGORY_COLORS } from "../const/sectorThemes.tsx";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

// HEX -> RGBA 変換
const hexToRgba = (hex: string, alpha: number) => {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((char) => char + char).join("");
  }
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
};

// HEX -> HSL 変換
const hexToHsl = (hex: string) => {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((char) => char + char).join("");
  }
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

// HSL -> HEX 変換
const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// ★ 文字列全体から決定論的なハッシュ値を生成（かぶり防止）
const getTicketHash = (ticketStr: string): number => {
  let hash = 0;
  for (let i = 0; i < ticketStr.length; i++) {
    hash = ticketStr.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// ★ ベースカラーとチケット番号から確実に色差が出る類似色を生成する関数
const generateSimilarColorFromNum = (baseHex: string, ticketNumber: string) => {
  const { h, s, l } = hexToHsl(baseHex);

  if (!ticketNumber) return baseHex;

  const hash = getTicketHash(ticketNumber);

  // 1. 色相(Hue): -25° 〜 +25° の範囲で変化させて明確な色差を確保
  const hueShift = (hash % 51) - 25;
  const newHue = (h + hueShift + 360) % 360;

  // 2. 明度(Lightness): -20% 〜 +20% で濃淡を調整
  const lightnessShift = (Math.floor(hash / 7) % 41) - 20;
  const newLightness = Math.min(85, Math.max(25, l + lightnessShift));

  // 3. 彩度(Saturation): -15% 〜 +15%
  const saturationShift = (Math.floor(hash / 13) % 31) - 15;
  const newSaturation = Math.min(100, Math.max(30, s + saturationShift));

  return hslToHex(newHue, newSaturation, newLightness);
};

export const CategoryChart = ({
  monthlyTransactions,
  isLoading,
}: CategoryChartProps) => {
  const [selectedType, setSelectedType] = useState<"income" | "expense">("expense");
  const [groupLevel, setGroupLevel] = useState<"channel" | "kilo" | "ticket">("ticket");
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

  // 集計処理
  const aggregatedData = useMemo(() => {
    const map: Record<
      string,
      {
        amount: number;
        userId: User;
        channel: string;
        kiloNumber: string;
        ticketNumber: string;
        targetKey: string;
      }
    > = {};

    monthlyTransactions
      .filter((t) => t.type === selectedType)
      .forEach((t) => {
        const userId = t.userId || "sectorL";
        const sectorLabel = SECTOR_THEMES[userId]?.label || "セクター L";

        let targetKey = t.ticketNumber || "未分類";
        if (groupLevel === "channel") targetKey = t.channel || "未分類";
        if (groupLevel === "kilo") targetKey = t.kiloNumber || "未分類";

        const displayLabel =
          currentSector === "shared"
            ? `${targetKey} (${sectorLabel})`
            : targetKey;

        if (!map[displayLabel]) {
          map[displayLabel] = {
            amount: 0,
            userId,
            channel: t.channel || "",
            kiloNumber: t.kiloNumber || "",
            ticketNumber: t.ticketNumber || "",
            targetKey,
          };
        }
        map[displayLabel].amount += t.amount;
      });

    return map;
  }, [monthlyTransactions, selectedType, groupLevel, currentSector]);

  // キロ番号順の降順（大きい順）に並べ替える処理
  const sortedEntries = useMemo(() => {
    return Object.entries(aggregatedData).sort((a, b) => {
      const itemA = a[1];
      const itemB = b[1];

      const numA = parseInt(String(itemA.kiloNumber || itemA.ticketNumber || "").replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(String(itemB.kiloNumber || itemB.ticketNumber || "").replace(/\D/g, ""), 10) || 0;
      
      return numB - numA;
    });
  }, [aggregatedData]);

  // ソート済みの結果からラベルと値を生成する
  const labels = sortedEntries.map(([label]) => label);
  const values = sortedEntries.map(([, item]) => item.amount);

  // ★ カラー判定ロジック（ソート済みの sortedEntries をベースにするように修正）
  const { bgColors, borderColors } = useMemo(() => {
    const bgList: string[] = [];
    const borderList: string[] = [];

    sortedEntries.forEach(([, item]) => {
      const userId = item.userId;
      const sectorColors =
        SECTOR_CATEGORY_COLORS[userId] || SECTOR_CATEGORY_COLORS.shared;
      const theme = SECTOR_THEMES[userId] || SECTOR_THEMES.sectorL;
      const fallbackHex =
        selectedType === "income" ? theme.incomeBgColor : theme.expenseBgColor;

      let finalHex = "";

      if (groupLevel === "ticket") {
        const parentBaseHex =
          sectorColors[item.kiloNumber] ||
          sectorColors[item.channel] ||
          sectorColors[item.ticketNumber] ||
          fallbackHex;

        finalHex = generateSimilarColorFromNum(parentBaseHex, item.ticketNumber);
      } else {
        finalHex = sectorColors[item.targetKey] || fallbackHex;
      }

      bgList.push(hexToRgba(finalHex, 0.85));
      borderList.push(hexToRgba(finalHex, 1.0));
    });

    return { bgColors: bgList, borderColors: borderList };
  }, [sortedEntries, selectedType, groupLevel]);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: bgColors,
        borderColor: borderColors,
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return ` ${label}: ¥${value.toLocaleString()}`;
          },
        },
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
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ width: 110 }}>
          <InputLabel id="type-select-label">収支</InputLabel>
          <Select
            labelId="type-select-label"
            value={selectedType}
            label="収支"
            onChange={(e) => setSelectedType(e.target.value as "income" | "expense")}
          >
            <MenuItem value="expense">ノルマ</MenuItem>
            <MenuItem value="income">完了</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: 150 }}>
          <InputLabel id="group-select-label">集計単位</InputLabel>
          <Select
            labelId="group-select-label"
            value={groupLevel}
            label="集計単位"
            onChange={(e) =>
              setGroupLevel(e.target.value as "channel" | "kilo" | "ticket")
            }
          >
            <MenuItem value="channel">チャンネル別</MenuItem>
            <MenuItem value="kilo">キロ名別</MenuItem>
            <MenuItem value="ticket">チケット番号別</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ flexGrow: 1, position: "relative", minHeight: 0 }}>
        {labels.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color="text.secondary">データがありません</Typography>
          </Box>
        ) : (
          <Pie data={data} options={options} />
        )}
      </Box>
    </Box>
  );
};

export default CategoryChart;