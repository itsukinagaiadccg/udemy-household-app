// @ts-ignore
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import React, { useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
// @ts-ignore
import jaLocale from "@fullcalendar/core/locales/ja";
import "../calendar.css";
import { Transaction, User } from "../types";
import { calculateDailyBalances } from "../utils/financeCalculations.ts";
import { formatCurrency } from "../utils/formatting.ts";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useParams } from "react-router-dom";
import { SECTOR_THEMES } from "./sectorThemes.ts";
import {
  getFullCalendarFirstDay,
  getCalendarContainerSx,
} from "../style/calendarTheme.ts";
import { Button, ButtonGroup, Box, Typography } from "@mui/material";
import { isSameMonth, format } from "date-fns";
import { convertToCubeDateDetails } from "./CubeCalendarView.tsx";
import CubeCalendarView from "./CubeCalendarView.tsx";

type CalendarMode = "gregorian" | "cube";

interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentDay?: React.Dispatch<React.SetStateAction<string>>;
  currentDay?: string;
  setCurrentMonth?: React.Dispatch<React.SetStateAction<Date>>;
  today?: string;
  onDateClick?: (dateInfo: DateClickArg) => void;
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

  const calendarEvents = Object.keys(dailyBalances).map((date) => {
    const { income, expense, balance } = dailyBalances[date];
    return {
      date: date,
      income: formatCurrency(income),
      expense: formatCurrency(expense),
      balance: formatCurrency(balance),
    };
  });

  const renderEventContent = (eventInfo: EventContentArg) => (
    <Box sx={{ p: 0.2, width: "100%", overflow: "hidden", pointerEvents: "none" }}>
      <div className="money" id="event-income">{eventInfo.event.extendedProps.income}</div>
      <div className="money" id="event-expense">{eventInfo.event.extendedProps.expense}</div>
      <div className="money" id="event-balance">{eventInfo.event.extendedProps.balance}</div>
    </Box>
  );

  const handleDateSet = (datesetInfo: DatesSetArg) => {
    const currentStart = datesetInfo.view.currentStart;
    if (setCurrentMonth) setCurrentMonth(currentStart);
    if (isSameMonth(new Date(), currentStart) && setCurrentDay && today) {
      setCurrentDay(today);
    }
  };

  return (
    <Box
      sx={{
        ...getCalendarContainerSx(currentTheme),

        // 1. 選択されたセルの背景色と枠の色を完全強制する
        "& .fc-daygrid-day.selected-day": {
          backgroundColor: `${currentTheme.selectedCardBgColor} !important`,
          borderColor: `${currentTheme.titleColor} !important`,
          borderWidth: "2px !important",
          borderStyle: "solid !important",
          outline: "none !important",
          zIndex: 5,
        },
        // セルの中にあるすべての内部フレーム・背景レイヤーの背景色を強制的に一致させる
        "& .fc-daygrid-day.selected-day .fc-daygrid-day-frame, & .fc-daygrid-day.selected-day .fc-daygrid-day-bg, & .fc-daygrid-day.selected-day .fc-daygrid-day-content": {
          backgroundColor: `${currentTheme.selectedCardBgColor} !important`,
        },
        
        // ホバー時にも色が消えないように固定
        "& .fc-daygrid-day.selected-day:hover, & .fc-daygrid-day.selected-day:hover .fc-daygrid-day-frame": {
          backgroundColor: `${currentTheme.selectedCardBgColor} !important`,
        },

        // 日付の数字部分の背景は透明にする
        "& .fc-daygrid-day.selected-day .fc-daygrid-day-top": {
          backgroundColor: "transparent !important",
        },

        // 2. ヘッダーの色
        "& .fc-col-header-cell": {
          backgroundColor: `${currentTheme.headerBgColor} !important`,
        },

        // 3. セルのクリック・タッチ可能設定
        "& .fc-daygrid-day": {
          cursor: "pointer !important",
        },
        "& .fc-daygrid-day-frame": {
          cursor: "pointer !important",
        },
      }}
    >
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
        <FullCalendar
          key={`${currentSector}-${currentDay}`}
          locale={jaLocale}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          firstDay={getFullCalendarFirstDay(currentSector)}
          selectable={true} // ← ここを追加：日付の選択・クリックを明示的に許可
          unselectAuto={false} // 選択状態を勝手に解除させない
          dayCellClassNames={(arg) => {
            const dateStr = format(arg.date, "yyyy-MM-dd");
            return dateStr === currentDay ? ["selected-day"] : [];
          }}
          dayCellContent={(arg) => {
            const cubeInfo = convertToCubeDateDetails(arg.date);
            const dayNumStr = arg.dayNumberText.replace("日", "");
            return (
              <Box textAlign="right" sx={{ pointerEvents: "none" }}>
                {cubeInfo.sqOneLineLabel && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.6rem",
                      color: "text.secondary",
                      display: "block",
                      lineHeight: 1.1,
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cubeInfo.sqOneLineLabel}
                  </Typography>
                )}
                <Typography variant="body2">{dayNumStr}</Typography>
              </Box>
            );
          }}
          events={calendarEvents}
          eventContent={renderEventContent}
          datesSet={handleDateSet}
          dateClick={(info) => {
            if (setCurrentDay) {
              setCurrentDay(info.dateStr);
            }
            if (onDateClick) {
              onDateClick(info);
            }
          }}
        />
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