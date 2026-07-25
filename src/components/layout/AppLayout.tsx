import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet, useLocation } from "react-router-dom";

import SideBar from "../common/SideBar.tsx";
import { SECTOR_THEMES } from "../../components/sectorThemes.ts";
import { User } from "../../types";

const drawerWidth = 240;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  // URL (例: "/sector/sectorI") のパスから sectorId 部分を抽出
  const currentSector: User = React.useMemo(() => {
    const pathParts = location.pathname.split("/");
    const sectorFromPath = pathParts[2] as User;

    // ★ 2. as const または (sectorFromPath as User) で型チェックを通す
    const validSectors: string[] = ["sectorL", "sectorI", "sectorA", "shared"];

    return validSectors.includes(sectorFromPath) ? sectorFromPath : "sectorL";
  }, [location.pathname]);

  const currentTheme = SECTOR_THEMES[currentSector];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: (theme) => theme.palette.grey[100],
        minHeight: "100vh",
      }}
    >
      <CssBaseline />

      {/* ヘッダー */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: currentTheme ? currentTheme.headerBgColor : "#1976d2",
          transition: "background-color 0.3s ease",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            TypeScript × React 家計簿 [{currentTheme ? currentTheme.label : ""}]
          </Typography>
        </Toolbar>
      </AppBar>

      {/* サイドバー */}
      <SideBar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}