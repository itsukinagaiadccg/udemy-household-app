import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useParams } from "react-router-dom"; // ★ 追加
import { Transaction, User } from "../types";
import { financeCalculations } from "../utils/financeCalculations.ts";
import { formatCurrency } from "../utils/formatting.ts";
import { SECTOR_THEMES } from "../const/sectorThemes.tsx"; // ★ 追加

interface MonthlySummaryProps {
  monthlyTransactions: Transaction[];
}

const MonthlySummary = ({ monthlyTransactions }: MonthlySummaryProps) => {
  const { income, expense, balance } = financeCalculations(monthlyTransactions);

  // ★ URLからセクターIDを取得して表記揺れを吸収
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

  // ★ SECTOR_THEMES から現在のテーマカラーを取得
  const currentTheme = SECTOR_THEMES[currentSector] || SECTOR_THEMES.sectorL;

  return (
    <Grid container spacing={{ xs: 1, sm: 2 }} mb={2}>
      {/* 完了 */}
      <Grid item xs={4} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            // ★ currentTheme.incomeBgColor を指定
            bgcolor: currentTheme.incomeBgColor,
            color: "white",
            borderRadius: "10px",
            flexGrow: 1,
            transition: "background-color 0.3s ease",
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"} alignItems="center">
              <ArrowUpwardIcon sx={{ fontSize: "2rem" }} />
              <Typography>完了</Typography>
            </Stack>
            <Typography
              variant="h5"
              textAlign={"right"}
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              ¥{formatCurrency(income)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* ノルマ */}
      <Grid item xs={4} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            // ★ currentTheme.expenseBgColor を指定
            bgcolor: currentTheme.expenseBgColor,
            color: "white",
            borderRadius: "10px",
            flexGrow: 1,
            transition: "background-color 0.3s ease",
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"} alignItems="center">
              <ArrowDownwardIcon sx={{ fontSize: "2rem" }} />
              <Typography>ノルマ</Typography>
            </Stack>
            <Typography
              variant="h5"
              textAlign={"right"}
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              ¥{formatCurrency(expense)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 残 */}
      <Grid item xs={4} display={"flex"} flexDirection={"column"}>
        <Card
          sx={{
            // ★ currentTheme.balanceBgColor を指定
            bgcolor: currentTheme.balanceBgColor,
            color: "white",
            borderRadius: "10px",
            flexGrow: 1,
            transition: "background-color 0.3s ease",
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"} alignItems="center">
              <AccountBalanceIcon sx={{ fontSize: "2rem" }} />
              <Typography>残</Typography>
            </Stack>
            <Typography
              variant="h5"
              textAlign={"right"}
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              ¥{formatCurrency(balance)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MonthlySummary;