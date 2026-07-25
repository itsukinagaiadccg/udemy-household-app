import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeIcon from "@mui/icons-material/Home";
import TodayIcon from "@mui/icons-material/Today"; // ★ デイリータイムライン用のアイコンを追加
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User } from "../../types";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sectorId } = useParams<{ sectorId: string }>();

  // 現在のセクターID（指定がなければデフォルト sectorL）
  const currentSector = sectorId || "sectorL";

  // 現在の画面判定
  const isReportPage = location.pathname.startsWith("/report");
  const isTimelinePage = location.pathname.startsWith("/timeline"); // ★ タイムライン画面かどうかの判定

  // セクター（Sector L / I / A / 共通）を選択した時の処理
  const handleSelectSector = (targetSector: User) => {
    if (isReportPage) {
      navigate(`/report/${targetSector}`);
    } else if (isTimelinePage) {
      navigate(`/timeline/${targetSector}`); // ★ タイムライン表示中ならタイムラインのままセクター切替
    } else {
      navigate(`/sector/${targetSector}`);
    }
  };

  // 「Home」ボタンを押した時の処理
  const handleSelectHome = () => {
    navigate(`/sector/${currentSector}`);
  };

  // 「Report」ボタンを押した時の処理
  const handleSelectReport = () => {
    navigate(`/report/${currentSector}`);
  };

  // ★ 「Timeline」ボタンを押した時の処理
  const handleSelectTimeline = () => {
    navigate(`/timeline/${currentSector}`);
  };

  return (
    <Box sx={{ width: 240, flexShrink: 0 }}>
      <List>
        {/* Home 画面へのリンク */}
        <ListItem disablePadding>
          <ListItemButton
            selected={!isReportPage && !isTimelinePage}
            onClick={handleSelectHome}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        {/* Report 画面へのリンク */}
        <ListItem disablePadding>
          <ListItemButton
            selected={isReportPage}
            onClick={handleSelectReport}
          >
            <ListItemIcon>
              <InsertChartIcon />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </ListItemButton>
        </ListItem>

        {/* ★ デイリータイムラインへのリンク */}
        <ListItem disablePadding>
          <ListItemButton
            selected={isTimelinePage}
            onClick={handleSelectTimeline}
          >
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText primary="Timeline" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      {/* セクター切り替えリスト */}
      <List>
        {[
          { id: "sectorL", label: "Sector L", icon: <PersonIcon /> },
          { id: "sectorI", label: "Sector I", icon: <PersonIcon /> },
          { id: "sectorA", label: "Sector A", icon: <PersonIcon /> },
          { id: "shared", label: "共通", icon: <GroupsIcon /> },
        ].map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentSector.toLowerCase() === item.id.toLowerCase()}
              onClick={() => handleSelectSector(item.id as User)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;