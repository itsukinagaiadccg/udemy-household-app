import { UserCategories } from "../types";

// ★ チャンネル名 -> キロ名 の手動定義マップ（最新構成）
export const DEFAULT_USER_CATEGORIES: UserCategories = {
  sectorL: {
    income: {
      "9ch": ["9K", "8K", "7K", "4K"],
      "10ch": ["6K", "3K", "2K", "1K"],
      "11ch": ["5K"],
      "12ch": ["0K"],
    },
    expense: {
      "9ch": ["9K", "8K", "7K", "4K"],
      "10ch": ["6K", "3K", "2K", "1K"],
      "11ch": ["5K"],
      "12ch": ["0K"],
    },
  },
  sectorI: {
    income: {
      "6ch": ["10K", "15K"],
      "7ch": ["11K", "12K", "17K"],
      "8ch": ["13K", "18K", "19K"],
    },
    expense: {
      "6ch": ["10K", "15K"],
      "7ch": ["11K", "12K", "17K"],
      "8ch": ["13K", "18K", "19K"],
    },
  },
  sectorA: {
    income: {
      "1ch": ["29K", "24K"],
      "2ch": ["28K", "23K"],
      "3ch": ["27K", "22K"],
      "4ch": ["26K", "21K"],
      "5ch": ["25K", "20K"],
    },
    expense: {
      "1ch": ["29K", "24K"],
      "2ch": ["28K", "23K"],
      "3ch": ["27K", "22K"],
      "4ch": ["26K", "21K"],
      "5ch": ["25K", "20K"],
    },
  },
  shared: {
    income: {
      "完了": ["100K"],
    },
    expense: {
      "共通ノルマ": ["100K"],
    },
  },
};