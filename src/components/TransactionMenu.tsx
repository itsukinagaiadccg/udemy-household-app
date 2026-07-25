import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import NotesIcon from "@mui/icons-material/Notes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import WorkIcon from "@mui/icons-material/Work"; // アイコン例
import { Transaction } from "../types";
import { SECTOR_THEMES } from "../const/sectorThemes.tsx"; // ★ SECTOR_THEMES をインポート
import { formatCurrency } from "../utils/formatting.ts";

interface TransactionMenuProps {
  dailyTransactions: Transaction[];
  currentDay: string;
  onAddTransactionForm: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export const TransactionMenu = ({
  dailyTransactions,
  currentDay,
  onAddTransactionForm,
  onSelectTransaction,
  open,
  onClose,
  isMobile,
}: TransactionMenuProps) => {
  return (
    <Box sx={{ width: { xs: "100%", md: 320 }, p: 2 }}>
      {/* ヘッダー部分 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <NotesIcon />
          <Typography variant="h6" fontWeight="bold">
            内訳
          </Typography>
        </Stack>
        <Button
          startIcon={<AddCircleIcon />}
          onClick={onAddTransactionForm}
          sx={{ fontWeight: "bold" }}
        >
          内訳を追加
        </Button>
      </Box>

      {/* 取引内訳リスト */}
      <Stack spacing={1.5}>
        {[...dailyTransactions]
          .sort((a: any, b: any) => {
            // 例: キロ名（kilo または kiloNumber）の数値で降順に並べ替える場合
            const kiloA = parseInt(String(a.kiloNumber || "").replace(/\D/g, "")) || 0;
            const kiloB = parseInt(String(b.kiloNumber || "").replace(/\D/g, "")) || 0;
            return kiloB - kiloA;
          })
          .map((transaction) => {
          // ★ 各取引データに設定されている userId (sectorL, sectorI, sectorA 等) からテーマを取得
          const itemSector = transaction.userId || "sectorL";
          const itemTheme = SECTOR_THEMES[itemSector] || SECTOR_THEMES.sectorL;

          //完了かノルマかによって色を出し分ける場合（または選択カード色を使う場合）
          const cardBgColor =
            transaction.type === "income"
              ? itemTheme.incomeBgColor // セクターごとの完了カラー
              : itemTheme.expenseBgColor; // セクターごとのノルマカラー

          return (
            <Card
              key={transaction.id}
              elevation={1}
              sx={{
                // ★ 取引データのセクター色を背景色に反映（少し透過させたい場合は alpha 設定も可）
                backgroundColor: cardBgColor,
                color: "#ffffff",
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
              <CardActionArea onClick={() => onSelectTransaction(transaction)}>
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Grid container alignItems="center" spacing={1}>
                    {/* アイコン */}
                    <Grid item>
                      <WorkIcon sx={{ color: "#ffffff" }} />
                    </Grid>

                    {/* カテゴリ & セクターチップ */}
                    <Grid item xs>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {transaction.ticketNumber || transaction.kiloNumber || transaction.channel || "未分類"}
                        </Typography>
                        {/* セクターチップ */}
                        <Chip
                          label={itemTheme.label}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.65rem",
                            backgroundColor: "rgba(255, 255, 255, 0.25)",
                            color: "#ffffff",
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {transaction.content || "メモなし"}
                      </Typography>
                    </Grid>

                    {/* 金額 */}
                    <Grid item>
                      <Typography variant="subtitle1" fontWeight="bold">
                        ¥{formatCurrency(transaction.amount)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}

        {dailyTransactions.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 4 }}
          >
            この日の内訳はありません
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default TransactionMenu;