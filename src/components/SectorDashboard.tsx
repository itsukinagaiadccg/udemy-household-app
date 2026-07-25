import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Transaction, User } from "../types";
import TransactionMenu from "./TransactionMenu"; // 以前作成した一覧コンポーネント

interface SectorDashboardProps {
  currentSector: User; // "sector L" | "sector I" | "sector A" | "shared"
  transactions: Transaction[];
  // その他必要な props (日付やハンドラーなど)
}

const SECTOR_TITLES: Record<User, string> = {
  "sectorL": "セクターL 収支管理",
  "sectorI": "セクターI 収支管理",
  "sectorA": "セクターA 収支管理",
  "shared": "共通 収支管理",
};

const SectorDashboard = ({ currentSector, transactions }: SectorDashboardProps) => {
  // 選択されたセクターのデータのみにフィルタリング
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => t.userId === currentSector);
  }, [transactions, currentSector]);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {SECTOR_TITLES[currentSector]}
      </Typography>

      {/* フィルタリングされたデータのみを各子コンポーネントに渡す */}
      {/* カレンダー、グラフ、内訳メニューなど */}
    </Box>
  );
};

export default SectorDashboard;