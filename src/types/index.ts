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
  type: "income" | "expense";
  date: string;
  time?: string; // 従来の時刻（必要に応じて残す）
  startTime?: string; // ★ 追加：登録開始時刻 (例: "09:00")
  endTime?: string;   // ★ 追加：登録終了時刻 (例: "11:30")
  amount: number;
  channel?: string;
  kiloNumber?: string;
  ticketNumber?: string;
  content?: string;
  userId: User;
}

// ▼ 追加：IDがまだ無い新規作成・フォーム用の型
export type NewTransaction = Omit<Transaction, "id">;

export interface Balance {
  income: number;
  expense: number;
  balance: number;
}