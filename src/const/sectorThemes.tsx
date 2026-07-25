import React from "react";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AlarmIcon from "@mui/icons-material/Alarm";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FolderIcon from "@mui/icons-material/Folder";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SchoolIcon from "@mui/icons-material/School";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
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

export const SECTOR_CATEGORY_COLORS: Record<User, Record<string, string>> = {
  sectorL: {
    "9ch": "#0055ff", "10ch": "#0b843b", "11ch": "#00a2ff", "12ch": "#0288d1",
    "9K": "#0033cc",
    "8K": "#0765e0", 
    "7K": "#306be0", 
    "6K": "#0b843b",
    "5K": "#0288d1", 
    "4K": "#0055ff", 
    "3K": "#0b9a44", 
    "2K": "#099370",
    "1K": "#2cad4f",
    "0K": "#7986cb",
  },
  sectorI: {
    "6ch": "#aa00ff", "7ch": "#d800dd", "8ch": "#5122fb",
    "10K": "#aa00ff", 
    "11K": "#d800dd", 
    "12K": "#d800dd", 
    "13K": "#5122fb",
    "14K": "#5122fb",
    "15K": "#aa00ff", 
    "16K": "#d800dd", 
    "17K": "#5122fb", "18K": "#4a2bb9", "19K": "#6b42ff",
  },
  sectorA: {
    "1ch": "#ff8800", "2ch": "#ff5900", "3ch": "#ff46b8", "4ch": "#ff0101", "5ch": "#d81b60",
    "20K": "#d81b60", "21K": "#ff0101", "22K": "#ff46b8", "23K": "#ff5900",
    "24K": "#ff8800", "25K": "#d81b60", "26K": "#ff0101", "27K": "#ff46b8",
    "28K": "#ff5252", "29K": "#ffb74d",
  },
  shared: {
    "共通収入": "#546e7a", "共通ノルマ": "#78909c", "100K": "#ff9800",
  },
};

export const SECTOR_KILO_ICONS: Record<User, Record<string, React.ReactNode>> = {
  sectorL: {
    "9K": <AlarmIcon fontSize="small" sx={{ mr: 1 }} />,
    "8K": <GroupsIcon fontSize="small" sx={{ mr: 1 }} />,
    "7K": <DirectionsBusIcon fontSize="small" sx={{ mr: 1 }} />,
    "6K": <HomeIcon fontSize="small" sx={{ mr: 1 }} />,
    "5K": <WorkIcon fontSize="small" sx={{ mr: 1 }} />,
    "4K": <FastfoodIcon fontSize="small" sx={{ mr: 1 }} />,
    "3K": <ReceiptIcon fontSize="small" sx={{ mr: 1 }} />,
    "2K": <ShoppingCartIcon fontSize="small" sx={{ mr: 1 }} />,
    "1K": <PhoneIphoneIcon fontSize="small" sx={{ mr: 1 }} />,
    "0K": <FolderIcon fontSize="small" sx={{ mr: 1 }} />,
  },
  sectorI: {
    "10K": <WorkIcon fontSize="small" sx={{ mr: 1 }} />,
    "11K": <SchoolIcon fontSize="small" sx={{ mr: 1 }} />,
    "12K": <ReceiptIcon fontSize="small" sx={{ mr: 1 }} />,
    "13K": <HomeIcon fontSize="small" sx={{ mr: 1 }} />,
    "15K": <FastfoodIcon fontSize="small" sx={{ mr: 1 }} />,
    "17K": <GroupsIcon fontSize="small" sx={{ mr: 1 }} />,
    "18K": <FlightTakeoffIcon fontSize="small" sx={{ mr: 1 }} />,
    "19K": <FolderIcon fontSize="small" sx={{ mr: 1 }} />,
  },
  sectorA: {
    "20K": <LocalHospitalIcon fontSize="small" sx={{ mr: 1 }} />,
    "21K": <SportsEsportsIcon fontSize="small" sx={{ mr: 1 }} />,
    "22K": <HomeIcon fontSize="small" sx={{ mr: 1 }} />,
    "23K": <FastfoodIcon fontSize="small" sx={{ mr: 1 }} />,
    "24K": <ShoppingCartIcon fontSize="small" sx={{ mr: 1 }} />,
    "25K": <DirectionsBusIcon fontSize="small" sx={{ mr: 1 }} />,
    "26K": <WorkIcon fontSize="small" sx={{ mr: 1 }} />,
    "27K": <ReceiptIcon fontSize="small" sx={{ mr: 1 }} />,
    "28K": <GroupsIcon fontSize="small" sx={{ mr: 1 }} />,
    "29K": <FolderIcon fontSize="small" sx={{ mr: 1 }} />,
  },
  shared: {
    "100K": <FolderIcon fontSize="small" sx={{ mr: 1 }} />,
  },
};

export const getKiloIcon = (
  kiloNumber?: string,
  category?: string,
  userId: User = "sectorL"
): React.ReactNode => {
  const sectorIcons = SECTOR_KILO_ICONS[userId] || SECTOR_KILO_ICONS.sectorL;

  if (kiloNumber && sectorIcons[kiloNumber]) {
    return sectorIcons[kiloNumber];
  }

  if (category && sectorIcons[category]) {
    return sectorIcons[category];
  }

  return <FolderIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />;
};