import { Timestamp } from "firebase/firestore";

export type TransactionType = "income" | "expense";
export type User = "sectorL" | "sectorI" | "sectorA" | "shared";

export interface KiloMapConfig {
  [channel: string]: string[];
}

export interface UserCategoryConfig {
  income: KiloMapConfig;
  expense: KiloMapConfig;
}

export type UserCategories = Record<User, UserCategoryConfig>;

// 取引データ Document 型 (Firestore 保存用)
export interface Transaction {
  id: string;
  date: string;
  time?: string;        // 時刻 (例: "14:30")
  amount: number;
  type: TransactionType;
  channel: string;      // 1階層目: チャンネル名
  kiloNumber: string;   // 2階層目: キロ名
  ticketNumber: string; // 3階層目: チケット番号
  content?: string;
  createdAt?: Timestamp;
  userId?: User;
}

export interface Balance {
  income: number;
  expense: number;
  balance: number;
}