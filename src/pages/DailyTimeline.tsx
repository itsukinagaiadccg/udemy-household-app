import React, { useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Transaction } from "../types";
import { getKiloIcon } from "../const/sectorThemes.tsx";

interface DailyTimelineProps {
  monthlyTransactions?: Transaction[];
  currentDate?: string;
}

export const DailyTimeline = ({
  monthlyTransactions = [],
  currentDate,
}: DailyTimelineProps) => {
  const targetDate = currentDate || new Date().toISOString().split("T")[0];

  // 該当日の取引を時刻順 (昇順) にソート
  const dailyTransactions = useMemo(() => {
    return (monthlyTransactions || [])
      .filter((t) => t.date === targetDate)
      .sort((a, b) => {
        const timeA = a.time || "00:00";
        const timeB = b.time || "00:00";
        return timeA.localeCompare(timeB);
      });
  }, [monthlyTransactions, targetDate]);

  return (
    <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Box display="flex" alignItems="center" gap={1}>
          <AccessTimeIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            日別取引タイムライン
          </Typography>
        </Box>
        <Chip label={targetDate} size="small" variant="outlined" />
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        本日の取引を時刻順に表示
      </Typography>

      <Divider sx={{ mb: 1 }} />

      {dailyTransactions.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="150px">
          <Typography color="text.secondary">本日の取引履歴はありません</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {dailyTransactions.map((t) => {
            const iconNode = getKiloIcon(t.kiloNumber, (t as any).category, t.userId);
            const isExpense = t.type === "expense";
            const displayLabel = t.ticketNumber || t.kiloNumber || t.channel || "未分類";

            return (
              <ListItem
                key={t.id}
                disableGutters
                sx={{
                  py: 1.2,
                  px: 1.5,
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: "action.hover",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{iconNode}</ListItemIcon>

                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.3}>
                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        sx={{
                          bgcolor: "background.paper",
                          px: 0.8,
                          py: 0.2,
                          borderRadius: 1,
                          fontFamily: "monospace",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        {t.time || "時刻未設定"}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {displayLabel}
                      </Typography>
                    </Stack>
                  }
                  secondary={t.content || t.kiloNumber || t.channel}
                />

                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color={isExpense ? "error.main" : "primary.main"}
                  sx={{ ml: 1 }}
                >
                  {isExpense ? "-" : "+"}¥{t.amount.toLocaleString()}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default DailyTimeline;