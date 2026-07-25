import { Box, Grid, Paper, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import MonthSelector from "../components/MonthSelector.tsx";
import CategoryChart from "../components/CategoryChart.tsx";
import TransactionTable from "../components/TransactionTable.tsx";
import BarChart from "../components/BarChart.tsx";
import { SectorNavTabs } from "../components/SectorNavTabs.tsx";
import { Transaction, User } from "../types";
import { SECTOR_THEMES } from "../const/sectorThemes.tsx";

interface ReportProps {
  monthlyTransactions: Transaction[];
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onDeleteTransaction: (ids: string | readonly string[]) => Promise<void>;
  isLoading: boolean;
}

const SECTOR_LABELS: Record<User, string> = {
  "sectorL": "セクター L",
  "sectorI": "セクター I",
  "sectorA": "セクター A",
  "shared": "共通",
};

const Report = ({
  monthlyTransactions,
  currentMonth,
  setCurrentMonth,
  onDeleteTransaction,
  isLoading,
}: ReportProps) => {
  const commonPaperStyle = {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    p: 2,
  };

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

  const currentTheme = SECTOR_THEMES[currentSector] || SECTOR_THEMES.sectorL;

  const sectorMonthlyTransactions = useMemo(() => {
    if (currentSector === "shared") {
      return monthlyTransactions;
    }
    return monthlyTransactions.filter(
      (transaction) => transaction.userId === currentSector
    );
  }, [monthlyTransactions, currentSector]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* basePath="report" を渡してレポートページ内遷移に設定 */}
      <SectorNavTabs currentSector={currentSector} basePath="report" />

      <Box sx={{ p: 2, pb: 1 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            color: currentTheme.titleColor,
            transition: "color 0.3s ease",
          }}
        >
          {SECTOR_LABELS[currentSector]} レポート
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MonthSelector
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={commonPaperStyle}>
            <CategoryChart
              monthlyTransactions={sectorMonthlyTransactions}
              isLoading={isLoading}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={commonPaperStyle}>
            <BarChart
              monthlyTransactions={sectorMonthlyTransactions}
              isLoading={isLoading}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TransactionTable
            monthlyTransactions={sectorMonthlyTransactions}
            onDeleteTransaction={onDeleteTransaction}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Report;