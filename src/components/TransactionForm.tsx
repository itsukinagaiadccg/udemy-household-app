import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { Controller, useForm } from "react-hook-form";
import { Transaction, User, UserCategories } from "../types";
import { useParams } from "react-router-dom";
import { DEFAULT_USER_CATEGORIES } from "../const/categories.ts";

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen?: boolean;
  currentDay: string;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  onSaveTransaction: (transaction: any) => Promise<void>;
  onDeleteTransaction: (
    transactionIds: string | readonly string[]
  ) => Promise<void>;
  onUpdateTransaction: (
    transaction: any,
    transactionId: string
  ) => Promise<void>;
  isDialogOpen: boolean;
  setIsDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  userCategories?: UserCategories;
}

export const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  selectedTransaction,
  setSelectedTransaction,
  onSaveTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
  isDialogOpen,
  isMobile,
  userCategories = DEFAULT_USER_CATEGORIES,
}: TransactionFormProps) => {
  const { sectorId } = useParams<{ sectorId: string }>();

  const currentSector: User = React.useMemo(() => {
    if (!sectorId) return "sectorL";
    const normalized = sectorId;
    if (normalized === "sectorL") return "sectorL";
    if (normalized === "sectorI") return "sectorI";
    if (normalized === "sectorA") return "sectorA";
    if (normalized === "shared") return "shared";
    return "sectorL";
  }, [sectorId]);

  const { control, setValue, watch, handleSubmit, reset } = useForm({
    defaultValues: {
      type: "expense",
      date: currentDay,
      amount: 0,
      channel: "",
      kiloNumber: "",
      ticketNumber: "",
      content: "",
      userId: currentSector === "shared" ? "sectorL" : currentSector,
    },
  });

  const currentType = watch("type") as "income" | "expense";
  const selectedUserId = (watch("userId") as User) || "sectorL";
  const selectedChannel = watch("channel");

  // 1階層目 (チャンネル名) のリスト取得
  const categoryConfig =
    userCategories[selectedUserId] || DEFAULT_USER_CATEGORIES[selectedUserId];
  const channelMap =
    currentType === "income" ? categoryConfig.income : categoryConfig.expense;

  const availableChannels = Object.keys(channelMap || {});

  // 2階層目 (キロ名) のリスト取得
  const availableKiloNumbers = selectedChannel ? channelMap[selectedChannel] || [] : [];

  // 自動生成ボタンで下3桁の数字を自動採番する関数
  const handleGenerateRandomTicket = () => {
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    setValue("ticketNumber", `#${randomNum}`);
  };

  useEffect(() => {
    setValue("date", currentDay);
  }, [currentDay, setValue]);

  useEffect(() => {
    if (selectedTransaction) {
      setValue("type", selectedTransaction.type);
      setValue("date", selectedTransaction.date);
      setValue("amount", selectedTransaction.amount);
      setValue("channel", selectedTransaction.channel || "");
      setValue("kiloNumber", selectedTransaction.kiloNumber || "");
      setValue("ticketNumber", selectedTransaction.ticketNumber || "");
      setValue("content", selectedTransaction.content || "");
      setValue("userId", selectedTransaction.userId);
    } else {
      reset({
        type: "expense",
        date: currentDay,
        amount: 0,
        channel: "",
        kiloNumber: "",
        ticketNumber: "",
        content: "",
        userId: currentSector === "shared" ? "sectorL" : currentSector,
      });
    }
  }, [selectedTransaction, currentDay, currentSector, setValue, reset]);

  const onSubmit = async (data: any) => {
    if (selectedTransaction) {
      await onUpdateTransaction(data, selectedTransaction.id);
    } else {
      await onSaveTransaction(data);
    }
    onCloseForm();
  };

  const handleDelete = async () => {
    if (selectedTransaction) {
      await onDeleteTransaction(selectedTransaction.id);
      setSelectedTransaction(null);
      onCloseForm();
    }
  };

  const formContent = (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          {selectedTransaction ? "内訳の編集" : "入力"}
        </Typography>
        <IconButton onClick={onCloseForm} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 収支タイプ切り替え */}
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <ButtonGroup fullWidth sx={{ mb: 2 }}>
            <Button
              variant={field.value === "expense" ? "contained" : "outlined"}
              color="error"
              onClick={() => {
                field.onChange("expense");
                setValue("channel", "");
                setValue("kiloNumber", "");
                setValue("ticketNumber", "");
              }}
            >
              支出
            </Button>
            <Button
              variant={field.value === "income" ? "contained" : "outlined"}
              color="primary"
              onClick={() => {
                field.onChange("income");
                setValue("channel", "");
                setValue("kiloNumber", "");
                setValue("ticketNumber", "");
              }}
            >
              収入
            </Button>
          </ButtonGroup>
        )}
      />

      <Stack spacing={2}>
        {/* セクター選択 */}
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="セクター"
              fullWidth
              size="small"
              onChange={(e) => {
                field.onChange(e);
                setValue("channel", "");
                setValue("kiloNumber", "");
                setValue("ticketNumber", "");
              }}
            >
              <MenuItem value="sectorL">Sector L</MenuItem>
              <MenuItem value="sectorI">Sector I</MenuItem>
              <MenuItem value="sectorA">Sector A</MenuItem>
            </TextField>
          )}
        />

        {/* 日付 */}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="日付"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        {/* 1階層目: チャンネル名 */}
        <Controller
          name="channel"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="チャンネル名"
              fullWidth
              size="small"
              onChange={(e) => {
                field.onChange(e);
                setValue("kiloNumber", "");
              }}
            >
              {availableChannels.map((chn) => (
                <MenuItem key={chn} value={chn}>
                  {chn}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* 2階層目: キロ名 */}
        <Controller
          name="kiloNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="キロ名"
              fullWidth
              size="small"
              disabled={!selectedChannel}
            >
              {availableKiloNumbers.map((kilo) => (
                <MenuItem key={kilo} value={kilo}>
                  {kilo}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* 3階層目: チケット番号 */}
        <Controller
          name="ticketNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="チケット番号"
              placeholder="例: #9000"
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      variant="text"
                      onClick={handleGenerateRandomTicket}
                      startIcon={<AutorenewIcon fontSize="small" />}
                      sx={{ fontSize: "0.75rem", px: 1, minWidth: "auto" }}
                    >
                      自動生成
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* 金額 */}
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="金額"
              type="number"
              fullWidth
              size="small"
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        {/* 内容 メモ */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="内容"
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color={currentType === "income" ? "primary" : "error"}
          fullWidth
          sx={{ mt: 1, fontWeight: "bold" }}
        >
          {selectedTransaction ? "更新" : "保存"}
        </Button>

        {selectedTransaction && (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleDelete}
            sx={{ fontWeight: "bold" }}
          >
            削除
          </Button>
        )}
      </Stack>
    </Box>
  );

  if (isMobile) {
    return (
      <Dialog open={isDialogOpen} onClose={onCloseForm} fullWidth maxWidth="xs">
        <DialogContent>{formContent}</DialogContent>
      </Dialog>
    );
  }

  // PC版でも isEntryDrawerOpen が false のときは何も表示しない（または非表示にする）
  if (!isEntryDrawerOpen) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
      {formContent}
    </Paper>
  );
};

export default TransactionForm;