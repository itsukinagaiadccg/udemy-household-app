import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Stack,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TodayIcon from "@mui/icons-material/Today";
import { Transaction, User } from "../types";
import { getKiloIcon, SECTOR_CATEGORY_COLORS } from "../const/sectorThemes.tsx"; // ★ SECTOR_CATEGORY_COLORS をインポート
import { useParams } from "react-router-dom";
import { convertToCubeDateDetails } from "../components/CubeCalendarView.tsx";

interface DailyTimelineProps {
  monthlyTransactions?: Transaction[];
  currentDate?: string;
}

// 差分の時間を計算するヘルパー関数
const calculateTimeDiff = (start?: string, end?: string) => {
  if (!start || !end) return "--";

  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;

  let diffMinutes = endTotalMinutes - startTotalMinutes;
  if (diffMinutes < 0) diffMinutes += 24 * 60;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h${minutes}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}min`;
  }
};

// 0時から160分（2時間40分）刻みで時間帯を判定する関数
const getTimeSlot = (time?: string) => {
  if (!time) return "未分類";
  const [hourStr, minStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);

  if (isNaN(hour) || isNaN(min)) return "未分類";

  const totalMinutes = hour * 60 + min;
  const interval = 160;
  const index = Math.floor(totalMinutes / interval);

  const slots = [
    "00:00 - 02:39",
    "02:40 - 05:19",
    "05:20 - 07:59",
    "08:00 - 10:39",
    "10:40 - 13:19",
    "13:20 - 15:59",
    "16:00 - 18:39",
    "18:40 - 21:19",
    "21:20 - 23:59",
  ];

  return slots[index] || "未分類";
};

// 時間帯ごとの見出しカラー設定
const timeSlotConfig: { [key: string]: { Name: string; border: string; bg: string; color: string } } = {
  "00:00 - 02:39": { Name: "A", border: "#ff2f2f", bg: "#ffecec", color: "#ff2f2f" },
  "02:40 - 05:19": { Name: "B", border: "#2445ff", bg: "#e6e9fb", color: "#2445ff" },
  "05:20 - 07:59": { Name: "Γ", border: "#0095ff", bg: "#e1f5fe", color: "#0095ff" },
  "08:00 - 10:39": { Name: "Δ", border: "#ff6b26", bg: "#fbe4d8", color: "#ff6b26" },
  "10:40 - 13:19": { Name: "E", border: "#ff8e1c", bg: "#f9eadb", color: "#ff8e1c" },
  "13:20 - 15:59": { Name: "Z", border: "#00963c", bg: "#d5ffe6", color: "#00963c" },
  "16:00 - 18:39": { Name: "H", border: "#ff18d5", bg: "#ffc9f5", color: "#ff18d5" },
  "18:40 - 21:19": { Name: "θ", border: "#b5006d", bg: "#ffceeb", color: "#b5006d" },
  "21:20 - 23:59": { Name: "I", border: "#7322ff", bg: "#e2ceff", color: "#7322ff" },
  "未分類": { Name: "未分類", border: "#9e9e9e", bg: "#f5f5f5", color: "#616161" },
};

export const DailyTimeline = ({
  monthlyTransactions = [],
  currentDate: initialDate,
}: DailyTimelineProps) => {
  const todayStr = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || todayStr
  );
  
  const [timeMode, setTimeMode] = useState<"start" | "end">("start");

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

  const cubeDetails = useMemo(() => {
    try {
      return convertToCubeDateDetails(new Date(selectedDate));
    } catch (e) {
      return null;
    }
  }, [selectedDate]);

  const dailyTransactions = useMemo(() => {
    return (monthlyTransactions || [])
      .filter((t: any) => {
        if (t.date !== selectedDate) return false;
        const targetSector = t.userId || t.category || t.sector || t.source;
        if (!targetSector) return true;
        if (currentSector === "shared") return true;
        return targetSector === currentSector;
      })
      .sort((a: any, b: any) => {
        const timeA = timeMode === "start" ? (a.startTime || a.time || "00:00") : (a.endTime || a.time || "00:00");
        const timeB = timeMode === "start" ? (b.startTime || b.time || "00:00") : (b.endTime || b.time || "00:00");
        return timeA.localeCompare(timeB);
      });
  }, [monthlyTransactions, selectedDate, currentSector, timeMode]);

  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: any[] } = {
      "00:00 - 02:39": [],
      "02:40 - 05:19": [],
      "05:20 - 07:59": [],
      "08:00 - 10:39": [],
      "10:40 - 13:19": [],
      "13:20 - 15:59": [],
      "16:00 - 18:39": [],
      "18:40 - 21:19": [],
      "21:20 - 23:59": [],
      "未分類": [],
    };

    dailyTransactions.forEach((t: any) => {
      const targetTime = timeMode === "start" ? (t.startTime || t.time) : (t.endTime || t.time);
      const slot = getTimeSlot(targetTime);
      if (groups[slot]) {
        groups[slot].push(t);
      } else {
        groups["未分類"].push(t);
      }
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [dailyTransactions, timeMode]);

  return (
    <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5} flexWrap="wrap" gap={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <AccessTimeIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            日別取引タイムライン
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <ToggleButtonGroup
            value={timeMode}
            exclusive
            onChange={(_, newMode) => {
              if (newMode) setTimeMode(newMode);
            }}
            size="small"
            sx={{ height: 32 }}
          >
            <ToggleButton value="start" sx={{ px: 1.5, fontSize: "0.75rem" }}>
              開始中心
            </ToggleButton>
            <ToggleButton value="end" sx={{ px: 1.5, fontSize: "0.75rem" }}>
              終了中心
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            size="small"
            startIcon={<TodayIcon />}
            onClick={() => setSelectedDate(todayStr)}
            sx={{ height: 32 }}
          >
            今日
          </Button>
          <TextField
            type="date"
            size="small"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ width: 140 }}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        {selectedDate} （
        <Box component="span" sx={{ fontFamily: "monospace", fontWeight: "bold" }}>
          cb: {cubeDetails?.sqOneLineLabel || cubeDetails?.sqCodeName || "---"}
        </Box>
        ）の取引を{timeMode === "start" ? "開始時刻" : "終了時刻"}順に表示
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {dailyTransactions.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="150px">
          <Typography color="text.secondary">This日の取引履歴はありません</Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          {groupedTransactions.map(([timeSlotKey, items]) => {
            const slotTheme = timeSlotConfig[timeSlotKey] || { Name: timeSlotKey, border: "#ccc", bg: "transparent", color: "inherit" };

            return (
              <Box key={timeSlotKey}>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{
                    mb: 1,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: slotTheme.bg,
                    color: slotTheme.color,
                    borderLeft: `5px solid ${slotTheme.border}`,
                  }}
                >
                  {timeSlotKey} [{slotTheme.Name}]
                </Typography>

                <List disablePadding>
                  {items.map((t: any) => {
                    const iconNode = getKiloIcon(t.kiloNumber, t.category, t.userId);
                    const isExpense = t.type === "expense";
                    const displayLabel = t.ticketNumber || t.kiloNumber || t.channel || "未分類";
                    const timeDiffLabel = calculateTimeDiff(t.startTime, t.endTime);

                    // ★ SECTOR_CATEGORY_COLORS からセクターごとの定義色を取得
                    const sectorColors = SECTOR_CATEGORY_COLORS[t.userId || currentSector] || SECTOR_CATEGORY_COLORS.sectorL;
                    const kiloColor = (t.kiloNumber && sectorColors[t.kiloNumber]) || (t.category && sectorColors[t.category]) || "#1565c0";

                    return (
                      <ListItem
                        key={t.id}
                        disableGutters
                        sx={{
                          py: 1.2,
                          px: 1.5,
                          borderRadius: 2,
                          mb: 1,
                          // ★ 定義されたカラーから薄い背景色と左ボーダーを生成
                          bgcolor: `${kiloColor}15`, // カラーコードに透明度（15）をつけて薄い背景にする
                          borderLeft: "4px solid",
                          borderColor: kiloColor,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, color: kiloColor }}>{iconNode}</ListItemIcon>

                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" spacing={1} mb={0.3}>
                              {/* ★ チケット番号（数字部分）の色を定義色に合わせる */}
                              <Typography variant="body2" fontWeight="bold" sx={{ color: kiloColor }}>
                                {displayLabel}
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            <Box component="span" sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                                {t.startTime || "--:--"} 〜 {t.endTime || "--:--"}
                              </Typography>
                              <span>{t.content || t.kiloNumber || t.channel}</span>
                            </Box>
                          }
                        />

                        <Chip
                          label={timeDiffLabel}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 2, fontFamily: "monospace", fontWeight: "bold", height: 26 }}
                        />

                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          color={isExpense ? "error.main" : "primary.main"}
                        >
                          {isExpense ? "-" : "+"}¥{t.amount.toLocaleString()}
                        </Typography>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default DailyTimeline;