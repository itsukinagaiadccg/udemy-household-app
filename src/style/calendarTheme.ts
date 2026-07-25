import { SxProps, Theme } from "@mui/material";
import { SectorThemeConfig } from "../const/sectorThemes";
import { User } from "../types";

export const WEEKDAYS_SUN = ["日", "月", "火", "水", "木", "金", "土"];
export const WEEKDAYS_WED = ["水", "木", "金", "土", "日", "月", "火"];
export const WEEKDAYS_TUE = ["火", "水", "木", "金", "土", "日", "月"];

export const getWeekdaysBySector = (sector: User): string[] => {
  switch (sector) {
    case "sectorA": return WEEKDAYS_WED;
    case "sectorI": return WEEKDAYS_TUE;
    default: return WEEKDAYS_SUN;
  }
};

export const getStartDayIndex = (dayOfWeek: number, sector: User): number => {
  switch (sector) {
    case "sectorA": return (dayOfWeek + 4) % 7;
    case "sectorI": return (dayOfWeek + 5) % 7;
    default: return dayOfWeek;
  }
};

export const getFullCalendarFirstDay = (sector: User): number => {
  switch (sector) {
    case "sectorA": return 3;
    case "sectorI": return 2;
    default: return 0;
  }
};

export const getWeekdayColor = (day: string, sectorTheme?: SectorThemeConfig): string => {
  return sectorTheme?.weekdayColors?.[day] ?? "#ffffff";
};

export const getDateNumberColor = (dayOfWeek: number, sectorTheme?: SectorThemeConfig): string => {
  return sectorTheme?.dateNumberColors?.[dayOfWeek] ?? sectorTheme?.titleColor ?? "#141414";
};

export const getCalendarDayPaperSx = (
  isSelected: boolean,
  sectorTheme: SectorThemeConfig
): SxProps<Theme> => {
  const bg = sectorTheme?.selectedCardBgColor ?? "#bbdefb";
  const border = sectorTheme?.selectedCardBorderColor ?? "#1976d2";

  return {
    p: 1,
    minHeight: 90,
    cursor: "pointer",
    borderRadius: 1.5,
    backgroundColor: isSelected ? `${bg} !important` : "#ffffff !important",
    border: isSelected ? `2px solid ${border}` : "1px solid #e0e0e0",
    transition: "all 0.15s ease-in-out",
    "&:hover": {
      boxShadow: 2,
      backgroundColor: isSelected ? `${bg} !important` : "#f9f9f9 !important",
    },
  };
};

/**
 * 西暦（FullCalendar）と Cube を完全に同一のテーマ設定で同期させるスタイル関数
 */
export const getCalendarContainerSx = (
  sectorTheme: SectorThemeConfig
): SxProps<Theme> => {
  const headerBg = sectorTheme?.headerBgColor ?? "#90caf9";
  const selectBg = sectorTheme?.selectedCardBgColor ?? "#bbdefb";
  const selectBorder = sectorTheme?.selectedCardBorderColor ?? "#1976d2";

  const dColors = sectorTheme?.dateNumberColors ?? {};
  const wColors = sectorTheme?.weekdayColors ?? {};

  return {
    width: "100%",
    my: 1,

    // FullCalendar の今日背景クリア（選択日の塗りつぶしだけ有効化）
    "--fc-today-bg-color": "transparent !important",
    "--fc-border-color": "#e0e0e0",

    // 1. ヘッダー背景色
    "& .fc .fc-col-header, & .fc .fc-col-header-cell": {
      backgroundColor: `${headerBg} !important`,
    },

    // 2. 西暦ヘッダーの各曜日文字色 (sectorTheme.weekdayColors から取得)
    "& .fc .fc-day-sun .fc-col-header-cell-cushion": { color: `${wColors["日"] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-mon .fc-col-header-cell-cushion": { color: `${wColors["月"] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-tue .fc-col-header-cell-cushion": { color: `${wColors["火"] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-wed .fc-col-header-cell-cushion": { color: `${wColors["水"] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-thu .fc-col-header-cell-cushion": { color: `${wColors["木"] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-fri .fc-col-header-cell-cushion": { color: `${wColors["金"] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-sat .fc-col-header-cell-cushion": { color: `${wColors["土"] ?? "#141414"} !important`, fontWeight: "bold" },

    // 3. 西暦日付数字の色 (sectorTheme.dateNumberColors から取得)
    "& .fc .fc-day-sun .fc-daygrid-day-number": { color: `${dColors[0] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-mon .fc-daygrid-day-number": { color: `${dColors[1] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-tue .fc-daygrid-day-number": { color: `${dColors[2] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-wed .fc-daygrid-day-number": { color: `${dColors[3] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-thu .fc-daygrid-day-number": { color: `${dColors[4] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-fri .fc-daygrid-day-number": { color: `${dColors[5] ?? "#141414"} !important`, fontWeight: "bold" },
    "& .fc .fc-day-sat .fc-daygrid-day-number": { color: `${dColors[6] ?? "#141414"} !important`, fontWeight: "bold" },

    // 4. 選択中日付（背景イベント）のカード指定（塗りつぶし ＋ 枠線）
    "& .fc .fc-bg-event": {
      backgroundColor: `${selectBg} !important`,
      border: `2px solid ${selectBorder} !important`,
      borderRadius: "6px",
      opacity: "1 !important",
      pointerEvents: "none !important",
    },

    // 5. カレンダーセルをクリック可能にする保護設定
    "& .fc .fc-daygrid-day-bg": {
      pointerEvents: "none !important",
    },
    "& .fc .fc-daygrid-day": {
      cursor: "pointer !important",
    },

    // 6. 外枠スタイル
    "& .fc-theme-standard .fc-scrollgrid": {
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      overflow: "hidden",
    },
  };
};