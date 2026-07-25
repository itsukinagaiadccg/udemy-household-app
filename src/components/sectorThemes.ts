import { User } from "../types";

export interface SectorThemeConfig {
  label: string;
  headerBgColor: string;
  titleColor: string;
  chipBgColor: string;
  selectedCardBgColor: string;
  selectedCardBorderColor: string;
  incomeBgColor: string;
  expenseBgColor: string;
  balanceBgColor: string;
  weekdayColors: Record<string, string>;
  dateNumberColors: Record<number, string>;
}

export const SECTOR_THEMES: Record<User, SectorThemeConfig> = {
  sectorL: {
    label: "セクター L",
    headerBgColor: "#c2e4ff",
    titleColor: "#1565c0",
    chipBgColor: "#e3f2fd",
    selectedCardBgColor: "#bbdefb",
    selectedCardBorderColor: "#014dfe",
    incomeBgColor: "#00a2ff",
    expenseBgColor: "#0055ff",
    balanceBgColor: "#259d6b",
    weekdayColors: {
      "日": "#b8b8b8", "月": "#565656", "火": "#828282", "水": "#00a2ff",
      "木": "#565656", "金": "#828282", "土": "#0055ff",
    },
    dateNumberColors: {
      0: "#b8b8b8", 1: "rgb(0, 188, 138)", 2: "rgb(7, 209, 0)",
      3: "#00a2ff", 4: "rgb(0, 188, 138)", 5: "rgb(7, 209, 0)", 6: "#0055ff",
    },
  },
  sectorI: {
    label: "セクター I",
    headerBgColor: "#e4cbff",
    titleColor: "#4a148c",
    chipBgColor: "#f3e5f5",
    selectedCardBgColor: "#f4e5ff",
    selectedCardBorderColor: "#b872fd",
    incomeBgColor: "#ec3cff",
    expenseBgColor: "#ff4081",
    balanceBgColor: "#9129f8",
    weekdayColors: {
      "日": "#b8b8b8", "月": "#aa00ff", "火": "#ec3cff", "水": "#565656",
      "木": "#9129f8", "金": "#ec3cff", "土": "#5122fb",
    },
    dateNumberColors: {
      0: "#b8b8b8", 1: "#ab02ff", 2: "#ec3cff", 3: "#565656",
      4: "#9129f8", 5: "#ec3cff", 6: "#5122fb",
    },
  },
  sectorA: {
    label: "セクター A",
    headerBgColor: "#feb6ce",
    titleColor: "#880e4f",
    chipBgColor: "#fce4ec",
    selectedCardBgColor: "#fee7ee",
    selectedCardBorderColor: "#ff7373",
    incomeBgColor: "#ff46b8",
    expenseBgColor: "#ff6200",
    balanceBgColor: "#ff0101",
    weekdayColors: {
      "日": "#ff0101", "月": "#d85491", "火": "#ff6200", "水": "#828282",
      "木": "#565656", "金": "#ff9900", "土": "#ff46b8",
    },
    dateNumberColors: {
      0: "#ff0101", 1: "#d85491", 2: "#ff6200", 3: "#828282",
      4: "#565656", 5: "#ff9900", 6: "#ff46b8",
    },
  },
  shared: {
    label: "共通",
    headerBgColor: "#90a4ae",
    titleColor: "#263238",
    chipBgColor: "#eceff1",
    selectedCardBgColor: "#cfd8dc",
    selectedCardBorderColor: "#37474f",
    incomeBgColor: "#546e7a",
    expenseBgColor: "#78909c",
    balanceBgColor: "#37474f",
    weekdayColors: {
      "日": "#ff8a80", "月": "#ffffff", "火": "#ffffff", "水": "#ffffff",
      "木": "#ffffff", "金": "#ffffff", "土": "#263238",
    },
    dateNumberColors: {
      0: "#f84658", 1: "#263238", 2: "#263238", 3: "#263238",
      4: "#263238", 5: "#263238", 6: "#0356e6",
    },
  },
};

// ★ セクター別 × 指定カラー（キーには「チャンネル」「キロ番号」「チケット番号」のいずれかがマッチします）
export const SECTOR_CATEGORY_COLORS: Record<User, Record<string, string>> = {
  sectorL: {
    "100K": "#00a2ff",
    "200K": "#0055ff",
    "300K": "#0033cc",
    "#101": "#03a9f4",
    "#102": "#00bcd4",
    "#201": "#3f51b5",
    "#301": "#7986cb",
    本業チャンネル: "#0288d1",
    副業チャンネル: "#26c6da",
  },
  sectorI: {
    "100K": "#ec3cff",
    "200K": "#ff4081",
    "300K": "#9129f8",
    "#101": "#e1bee7",
    "#102": "#8e24aa",
    "#201": "#ab02ff",
    開発チャンネル: "#ba68c8",
    投資チャンネル: "#ce93d8",
  },
  sectorA: {
    "100K": "#ff6200",
    "200K": "#ff46b8",
    "300K": "#ff0101",
    "#101": "#e91e63",
    "#102": "#ff80ab",
    "#201": "#ff1744",
    事業チャンネル: "#ffb74d",
    個人チャンネル: "#ffd54f",
  },
  shared: {
    "100K": "#ff9800",
    "200K": "#4caf50",
    "300K": "#f44336",
    "#101": "#e91e63",
    "#102": "#9c27b0",
  },
};