import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types";

interface SectorNavTabsProps {
  currentSector: User;
  basePath?: "sector" | "report";
}

export const SectorNavTabs = ({
  currentSector,
  basePath = "sector",
}: SectorNavTabsProps) => {
  const navigate = useNavigate();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(`/${basePath}/${newValue}`);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
      <Tabs
        value={currentSector}
        onChange={handleTabChange}
        aria-label="sector navigation tabs"
      >
        <Tab label="セクター L" value="sectorL" />
        <Tab label="セクター I" value="sectorI" />
        <Tab label="セクター A" value="sectorA" />
        <Tab label="共通" value="shared" />
      </Tabs>
    </Box>
  );
};