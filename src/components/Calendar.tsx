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
  ButtonGroup,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchIcon from "@mui/icons-material/Search";
import {
  addDays,
  format,
  getDay,
  parseISO,
  isValid,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { DateClickArg } from "@fullcalendar/interaction";
import { Transaction, User } from "../types";
import { calculateDailyBalances } from "../utils/financeCalculations.ts";
import { formatCurrency } from "../utils/formatting.ts";
import { SECTOR_THEMES } from "./sectorThemes.ts";
import {
  getFullCalendarFirstDay,
  getCalendarContainerSx,
  getWeekdaysBySector,
  getStartDayIndex,
  getWeekdayColor,
  getDateNumberColor,
  getCalendarDayPaperSx,
} from "../style/calendarTheme.ts";
import { useParams } from "react-router-dom";
import CubeCalendarView, { convertToCubeDateDetails } from "./CubeCalendarView.tsx";

type CalendarMode = "gregorian" | "cube";

interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentDay?: React.Dispatch<React.SetStateAction<string>>;
  currentDay?: string;
  setCurrentMonth?: React.Dispatch<React.SetStateAction<Date>>;
  today?: string;
  onDateClick?: (dateInfo: any) => void;
}

const Calendar = ({
  monthlyTransactions,
  setCurrentDay,
  currentDay,
  setCurrentMonth,
  today,
  onDateClick,
}: CalendarProps) => {
  const { sectorId } = useParams<{ sectorId: string }>();

  const currentSector: User = React.useMemo(() => {
    if (!sectorId) return "sectorL";
    const normalized = sectorId.toLowerCase();
    if (normalized === "sectorl") return "sectorL";
    if (normalized === "sectori") return "sectorI";
    if (normalized === "sectora") return "sectorA";
    if (normalized === "shared") return "shared";
    return "sectorL";
  }, [sectorId]);

  const currentTheme = SECTOR_THEMES[currentSector as User] || SECTOR_THEMES.sectorL;
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("gregorian");
  
  const [gregorianAnchorDate, setGregorianAnchorDate] = useState<Date>(() => {
    return currentDay ? parseISO(currentDay) : new Date();
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTransactions = React.useMemo(() => {
    if (!monthlyTransactions) return [];
    return monthlyTransactions.filter((t: any) => {
      const targetSector = t.userId || t.category || t.sector || t.source;
      if (!targetSector) return true;
      if (currentSector === "shared") return true;
      return targetSector === currentSector;
    });
  }, [monthlyTransactions, currentSector]);

  const dailyBalances = calculateDailyBalances(filteredTransactions);
  const currentWeekdays = getWeekdaysBySector(currentSector);

  const monthStart = startOfMonth(gregorianAnchorDate);
  const monthEnd = endOfMonth(gregorianAnchorDate);
  const firstDayOfWeekIndex = getFullCalendarFirstDay(currentSector);
  
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: firstDayOfWeekIndex as any });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: firstDayOfWeekIndex as any });
  const gregorianDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handlePrevGregorian = () => {
    const prev = subMonths(gregorianAnchorDate, 1);
    setGregorianAnchorDate(prev);
    if (setCurrentMonth) setCurrentMonth(prev);
  };

  const handleNextGregorian = () => {
    const next = addMonths(gregorianAnchorDate, 1);
    setGregorianAnchorDate(next);
    if (setCurrentMonth) setCurrentMonth(next);
  };

  const handleTodayGregorian = () => {
    const now = new Date();
    setGregorianAnchorDate(now);
    if (setCurrentMonth) setCurrentMonth(now);
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
      setGregorianAnchorDate(targetDate);
      if (setCurrentMonth) setCurrentMonth(targetDate);
      if (setCurrentDay) setCurrentDay(format(targetDate, "yyyy-MM-dd"));
      setSearchQuery("");
    } else {
      alert("有効な日付を入力してください（例: 2026-07-25）");
    }
  };

  return (
    <Box sx={{ ...getCalendarContainerSx(currentTheme), p: 2 }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <ButtonGroup size="small" variant="outlined">
          <Button
            variant={calendarMode === "gregorian" ? "contained" : "outlined"}
            onClick={() => setCalendarMode("gregorian")}
            sx={{ fontWeight: "bold" }}
          >
            西暦
          </Button>
          <Button
            variant={calendarMode === "cube" ? "contained" : "outlined"}
            onClick={() => setCalendarMode("cube")}
            sx={{ fontWeight: "bold" }}
          >
            cube
          </Button>
        </ButtonGroup>
      </Box>

      {calendarMode === "gregorian" ? (
        <Box sx={{ mt: 1, pointerEvents: "auto" }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2, px: 2, gap: 2, flexWrap: "nowrap" }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ flexShrink: 0 }}>
              <IconButton onClick={handlePrevGregorian} size="small"><ArrowBackIosNewIcon /></IconButton>
              <IconButton onClick={handleNextGregorian} size="small"><ArrowForwardIosIcon /></IconButton>
              <Button variant="outlined" size="small" onClick={handleTodayGregorian} sx={{ fontWeight: "bold", ml: 0.5 }}>今日</Button>
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
              {format(gregorianAnchorDate, "yyyy年M月")}
            </Typography>
          </Box>

          <Box display="flex" sx={{ backgroundColor: currentTheme.headerBgColor, borderRadius: 1, py: 1, mb: 1, textAlign: "center", fontWeight: "bold" }}>
            {currentWeekdays.map((day) => (
              <Box key={day} sx={{ width: "14.285%", color: getWeekdayColor(day, currentTheme) }}>{day}</Box>
            ))}
          </Box>

          <Grid container spacing={0}>
            {gregorianDays.map((cellDate) => {
              const dateStr = format(cellDate, "yyyy-MM-dd");
              const balanceData = dailyBalances[dateStr];
              const isSelected = dateStr === currentDay;
              const isCurrentMonth = isSameMonth(cellDate, gregorianAnchorDate);
              const selectedBg = currentTheme.selectedCardBgColor ?? "#bbdefb";
              const cubeInfo = convertToCubeDateDetails(cellDate);

              return (
                <Grid item key={dateStr} sx={{ width: "14.285%", p: 0.5 }}>
                  <Paper
                    elevation={isSelected ? 3 : 1}
                    sx={{
                      ...getCalendarDayPaperSx(isSelected, currentTheme),
                      position: "relative",
                      overflow: "hidden",
                      p: 0,
                      opacity: isCurrentMonth ? 1 : 0.4,
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
                        minHeight: 90,
                        pointerEvents: "auto !important",
                        backgroundColor: "transparent",
                      }}
                    >
                      {/* 上部：キューブ一行表記 ＆ 日付数字 */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        {cubeInfo.sqOneLineLabel ? (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.6rem",
                              color: "text.secondary",
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {cubeInfo.sqOneLineLabel}
                          </Typography>
                        ) : <span />}
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{ color: getDateNumberColor(getDay(cellDate), currentTheme) }}
                        >
                          {format(cellDate, "d")}
                        </Typography>
                      </Box>

                      {/* 下部：日別収支データ */}
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
            })}
          </Grid>
        </Box>
      ) : (
        <CubeCalendarView
          currentSector={currentSector}
          currentDay={currentDay}
          monthlyTransactions={filteredTransactions}
          setCurrentDay={setCurrentDay}
          today={today}
          onDateClick={onDateClick}
        />
      )}
    </Box>
  );
};

export default Calendar;