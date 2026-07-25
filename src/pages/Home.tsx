import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import MonthlySummary from "../components/MonthlySummary.tsx";
import Calendar from "../components/Calendar.tsx";
import TransactionMenu from "../components/TransactionMenu.tsx";
import TransactionForm from "../components/TransactionForm.tsx";
import { NewTransaction, Transaction, User } from "../types";
import { format } from "date-fns";
import { DateClickArg } from "@fullcalendar/interaction";
import { Schema } from "../validations/schema.ts";
import { SECTOR_THEMES } from "../components/sectorThemes.ts";

interface HomeProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: NewTransaction) => Promise<void>;
  onDeleteTransaction: (
    transactionIds: string | readonly string[]
  ) => Promise<void>;
  onUpdateTransaction: (
    transaction: Partial<Transaction>,
    transactionId: string
  ) => Promise<void>;
}

// 表示用ラベルマッピング
const SECTOR_LABELS: Record<User, string> = {
  "sectorL": "セクター L",
  "sectorI": "セクター I",
  "sectorA": "セクター A",
  "shared": "共通",
};

const Home = ({
  monthlyTransactions,
  setCurrentMonth,
  onSaveTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
}: HomeProps) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // 1. URL パラメータから sectorId を取得
  const { sectorId } = useParams<{ sectorId: string }>();

  // 2. 有効な User か判定（表記揺れをガード）
  const currentSector: User = useMemo(() => {
    if (!sectorId) return "sectorL";
    const normalized = sectorId.toLowerCase();
    if (normalized === "sectorl") return "sectorL";
    if (normalized === "sectori") return "sectorI";
    if (normalized === "sectora") return "sectorA";
    if (normalized === "shared") return "shared";
    return "sectorL";
  }, [sectorId]);

  // 3. 現在のセクターのテーマカラーを取得
  const currentTheme = SECTOR_THEMES[currentSector] || SECTOR_THEMES.sectorL;

  // 4. ★ 取引データのフィルタリング（shared の場合は L/I/A の全合計、それ以外は個別フィルタ）
  const sectorMonthlyTransactions = useMemo(() => {
    if (currentSector === "shared") {
      return monthlyTransactions; // L, I, A 全ての合計
    }
    return monthlyTransactions.filter(
      (transaction) => transaction.userId === currentSector
    );
  }, [monthlyTransactions, currentSector]);

  // 5. 選択セクター（または共通合計）の「一日分のデータ」を取得
  const dailyTransactions = useMemo(() => {
    return sectorMonthlyTransactions.filter(
      (transaction) => transaction.date === currentDay
    );
  }, [sectorMonthlyTransactions, currentDay]);

  const closeForm = () => {
    setSelectedTransaction(null);
    if (isMobile) {
      setIsDialogOpen(!isDialogOpen);
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  };

  // フォームの開閉処理(内訳追加ボタンを押したとき)
  const handleAddTransactionForm = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      if (selectedTransaction) {
        setSelectedTransaction(null);
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    }
  };

  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      setIsEntryDrawerOpen(true);
    }
  };

  // モバイル用Drawerを閉じる処理
  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  // 日付を選択したときの処理
  const handleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
    if (isMobile) {
      setIsMobileDrawerOpen(true);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* 画面上部に現在のセクター名を表示 */}
      <Box sx={{ p: 2, pb: 0 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            color: currentTheme.titleColor,
            transition: "color 0.3s ease",
          }}
        >
          {SECTOR_LABELS[currentSector]} 収支データ
        </Typography>
      </Box>

      <Box sx={{ display: "flex", width: "100%" }}>
        {/* 左側コンテンツ */}
        <Box sx={{ flexGrow: 1 }}>
          <MonthlySummary monthlyTransactions={sectorMonthlyTransactions} />

          <Calendar
            monthlyTransactions={sectorMonthlyTransactions}
            setCurrentDay={setCurrentDay}
            currentDay={currentDay}
            setCurrentMonth={setCurrentMonth}
            today={today}
            onDateClick={handleDateClick}
          />
        </Box>

        {/* 右側コンテンツ */}
        <Box>
          <TransactionMenu
            dailyTransactions={dailyTransactions}
            currentDay={currentDay}
            onAddTransactionForm={handleAddTransactionForm}
            onSelectTransaction={handleSelectTransaction}
            open={isMobileDrawerOpen}
            onClose={handleCloseMobileDrawer}
            isMobile={isMobile}
          />

          <TransactionForm
            onCloseForm={closeForm}
            isEntryDrawerOpen={isEntryDrawerOpen}
            currentDay={currentDay}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            onSaveTransaction={onSaveTransaction}
            onDeleteTransaction={onDeleteTransaction}
            onUpdateTransaction={onUpdateTransaction}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            isMobile={isMobile}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;