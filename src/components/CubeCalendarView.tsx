import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  ButtonBase,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchIcon from "@mui/icons-material/Search";
import { addDays, format, getDay, parseISO, isValid } from "date-fns";
import { DateClickArg } from "@fullcalendar/interaction";
import { Transaction, User } from "../types";
import { calculateDailyBalances } from "../utils/financeCalculations.ts";
import { formatCurrency } from "../utils/formatting.ts";
import { SECTOR_THEMES } from "../const/sectorThemes.tsx";
import {
  getWeekdaysBySector,
  getStartDayIndex,
  getWeekdayColor,
  getDateNumberColor,
  getCalendarDayPaperSx,
} from "../style/calendarTheme.ts";

interface SquareMaster {
  sqNum: number;
  sqType: number;
  frenchName: string;
}

const SQUARE_MASTER: SquareMaster[] = [
  { sqNum: 1, sqType: 1, frenchName: "Néophyte" },
  { sqNum: 2, sqType: 2, frenchName: "Sagesse" },
  { sqNum: 3, sqType: 3, frenchName: "Triomphe" },
  { sqNum: 4, sqType: 4, frenchName: "Édifice" },
  { sqNum: 5, sqType: 5, frenchName: "Pyromane" },
  { sqNum: 6, sqType: 6, frenchName: "Feu" },
  { sqNum: 7, sqType: 7, frenchName: "Brûlé" },
  { sqNum: 8, sqType: 8, frenchName: "Mirage" },
  { sqNum: 9, sqType: 9, frenchName: "Déserteur" },
  { sqNum: 10, sqType: 0, frenchName: "Réfugié" },
  { sqNum: 11, sqType: 1, frenchName: "Ange" },
  { sqNum: 12, sqType: 2, frenchName: "Canon" },
  { sqNum: 13, sqType: 3, frenchName: "Homme fatal" },
  { sqNum: 14, sqType: 4, frenchName: "Or" },
  { sqNum: 15, sqType: 5, frenchName: "Yielder" },
  { sqNum: 16, sqType: 6, frenchName: "Querelle" },
  { sqNum: 17, sqType: 7, frenchName: "Zozoteur" },
  { sqNum: 18, sqType: 9, frenchName: "Urgence" },
  { sqNum: 19, sqType: 0, frenchName: "Vieux clou" },
  { sqNum: 20, sqType: 10, frenchName: "Expiation" },
];

const getSquareDaysByYearDigitRule = (year: number, sqNum: number, sqType: number): number => {
  if (sqNum === 20) return 18;
  if (sqNum === 12) return 20;
  if (sqNum === 13) return 21;
  return year % 10 === sqType ? 21 : 18;
};

export const convertToCubeDateDetails = (targetDate: Date) => {
  const pureTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const baseEpoch = new Date(2026, 1, 1);
  let remainingDays = Math.round((pureTarget.getTime() - baseEpoch.getTime()) / (1000 * 60 * 60 * 24));

  if (remainingDays < 0) {
    return { sqTitle: "None", sqCodeName: "None", sqOneLineLabel: "", sqDays: 18, startDate: baseEpoch };
  }

  let currentCalcYear = 2026;
  let accumulatedTime = baseEpoch.getTime();

  while (true) {
    for (const sqMaster of SQUARE_MASTER) {
      if (sqMaster.sqNum === 20) {
        const leap19StartDate = new Date(accumulatedTime);
        const month = leap19StartDate.getMonth() + 1;
        const date = leap19StartDate.getDate();
        if ((month === 1 && date >= 26) || month >= 2) continue;
      }

      const sqDays = getSquareDaysByYearDigitRule(currentCalcYear, sqMaster.sqNum, sqMaster.sqType);

      if (remainingDays < sqDays) {
        const isL19 = sqMaster.sqNum === 20;
        const sqCode = isL19 ? "leap 19" : `${sqMaster.sqNum}`;
        const dayNum = remainingDays + 1;

        return {
          sqTitle: `${sqCode} (${sqMaster.frenchName}) / ${currentCalcYear}`,
          sqCodeName: `${sqCode} (${sqMaster.frenchName})`,
          sqOneLineLabel: `${currentCalcYear}-${sqCode}-${dayNum}`,
          sqDays,
          startDate: new Date(accumulatedTime),
          cubeYear: currentCalcYear,
        };
      }

      remainingDays -= sqDays;
      accumulatedTime += sqDays * 24 * 60 * 60 * 1000;
    }
    currentCalcYear += 1;
  }
};

interface CubeCalendarViewProps {
  currentSector: User;
  currentDay?: string;
  monthlyTransactions: Transaction[];
  setCurrentDay?: React.Dispatch<React.SetStateAction<string>>;
  today?: string;
  onDateClick?: (dateInfo: DateClickArg) => void;
}

export const CubeCalendarView: React.FC<CubeCalendarViewProps> = ({
  currentSector,
  currentDay,
  monthlyTransactions,
  setCurrentDay,
  today,
  onDateClick,
}) => {
  const currentTheme = SECTOR_THEMES[currentSector] || SECTOR_THEMES.sectorL;
  const [cubeAnchorDate, setCubeAnchorDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>("");

  const dailyBalances = calculateDailyBalances(monthlyTransactions);
  const cubeDetails = convertToCubeDateDetails(cubeAnchorDate);
  const currentWeekdays = getWeekdaysBySector(currentSector);
  const rawStartDay = getDay(cubeDetails.startDate);
  const startDayOfWeek = getStartDayIndex(rawStartDay, currentSector);

  const handlePrevCube = () => setCubeAnchorDate((prev) => addDays(convertToCubeDateDetails(prev).startDate, -1));
  const handleNextCube = () => setCubeAnchorDate((prev) => addDays(cubeDetails.startDate, cubeDetails.sqDays));
  const handleTodayCube = () => {
    setCubeAnchorDate(new Date());
    if (setCurrentDay && today) setCurrentDay(today);
  };

  const handleSearchDate = () => {
    if (!searchQuery.trim()) return;
    let targetDate: Date | null = null;
    const rawInput = searchQuery.trim().replace(/\//g, "-");

    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(rawInput)) {
      const parsed = parseISO(rawInput);
      if (isValid(parsed)) targetDate = parsed;
    }

    if (targetDate) {
      setCubeAnchorDate(targetDate);
      if (setCurrentDay) setCurrentDay(format(targetDate, "yyyy-MM-dd"));
      setSearchQuery("");
    } else {
      alert("有効な日付を入力してください（例: 2026-07-25）");
    }
  };

  const cells = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push(
      <Grid item key={`empty-${i}`} sx={{ width: "14.285%", p: 0.5 }}>
        <Box sx={{ minHeight: 90, backgroundColor: "transparent" }} />
      </Grid>
    );
  }

  for (let i = 0; i < cubeDetails.sqDays; i++) {
    const cellDate = addDays(cubeDetails.startDate, i);
    const dateStr = format(cellDate, "yyyy-MM-dd");
    const balanceData = dailyBalances[dateStr];
    const isSelected = dateStr === currentDay;

    const selectedBg = currentTheme.selectedCardBgColor ?? "#bbdefb";

    cells.push(
      <Grid item key={`day-${i}`} sx={{ width: "14.285%", p: 0.5 }}>
        <Paper
          elevation={isSelected ? 3 : 1}
          sx={{
            ...getCalendarDayPaperSx(isSelected, currentTheme),
            position: "relative",
            overflow: "hidden",
            p: 0,
            // 選択時のセクター背景色を強制上書き適用
            ...(isSelected && {
              backgroundColor: `${selectedBg} !important`,
            }),
          }}
        >
          <ButtonBase
            onClick={() => {
              if (setCurrentDay) setCurrentDay(dateStr);
              if (onDateClick) onDateClick({ dateStr, date: cellDate } as DateClickArg);
            }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "stretch",
              width: "100%",
              height: "100%",
              textAlign: "left",
              p: 1,
              pointerEvents: "auto !important",
              backgroundColor: "transparent",
            }}
          >
            {/* 上部：日付と西暦ミニ表記 */}
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: getDateNumberColor(getDay(cellDate), currentTheme) }}>
                {i + 1}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                {format(cellDate, "yy/M/d")}
              </Typography>
            </Box>

            {/* 下部：日別収支データ（すべての金額データを確実に出力） */}
            {balanceData && (
              <Box sx={{ mt: "auto", pt: 0.5, width: "100%", textAlign: "right" }}>
                {balanceData.income !== undefined && balanceData.income !== null && balanceData.income !== 0 && (
                  <div className="money" id="event-income" style={{ fontSize: "0.7rem", fontWeight: "bold", lineHeight: 1.2, color: "inherit" }}>
                    +{formatCurrency(balanceData.income)}
                  </div>
                )}
                {balanceData.expense !== undefined && balanceData.expense !== null && balanceData.expense !== 0 && (
                  <div className="money" id="event-expense" style={{ fontSize: "0.7rem", fontWeight: "bold", lineHeight: 1.2, color: "inherit" }}>
                    -{formatCurrency(balanceData.expense)}
                  </div>
                )}
                {balanceData.balance !== undefined && balanceData.balance !== null && (
                  <div className="money" id="event-balance" style={{ fontSize: "0.7rem", fontWeight: "bold", lineHeight: 1.2, color: "inherit" }}>
                    {formatCurrency(balanceData.balance)}
                  </div>
                )}
              </Box>
            )}
          </ButtonBase>
        </Paper>
      </Grid>
    );
  }

  return (
    <Box sx={{ mt: 1, pointerEvents: "auto" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2, px: 2, gap: 2, flexWrap: "nowrap" }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ flexShrink: 0 }}>
          <IconButton onClick={handlePrevCube} size="small"><ArrowBackIosNewIcon /></IconButton>
          <IconButton onClick={handleNextCube} size="small"><ArrowForwardIosIcon /></IconButton>
          <Button variant="outlined" size="small" onClick={handleTodayCube} sx={{ fontWeight: "bold", ml: 0.5 }}>今日</Button>
          <TextField
            size="small"
            placeholder="2026-07-25"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchDate()}
            sx={{ width: 140, ml: 1 }}
            InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton size="small" onClick={handleSearchDate} edge="end"><SearchIcon fontSize="small" /></IconButton></InputAdornment>) }}
          />
        </Box>
        <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {cubeDetails.sqTitle}
        </Typography>
      </Box>

      <Box display="flex" sx={{ backgroundColor: currentTheme.headerBgColor, borderRadius: 1, py: 1, mb: 1, textAlign: "center", fontWeight: "bold" }}>
        {currentWeekdays.map((day) => (
          <Box key={day} sx={{ width: "14.285%", color: getWeekdayColor(day, currentTheme) }}>{day}</Box>
        ))}
      </Box>

      <Box display="flex" flexWrap="wrap">{cells}</Box>
    </Box>
  );
};

export default CubeCalendarView;