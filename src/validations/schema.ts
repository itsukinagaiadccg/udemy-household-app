import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, { message: "日付は必須です" }),
  amount: z.number().min(1, { message: "金額は1円以上必須です" }),
  content: z
    .string()
    .min(1, { message: "内容を入力してください" })
    .max(50, { message: "内容は50文字以内にしてください。" }),

  // ★ 1. errorMap を使って required_error の赤波線エラーを解消
  userId: z.enum(["sectorL", "sectorI", "sectorA", "shared"], {
    errorMap: () => ({ message: "セクターを選択してください" }),
  }),

  // ★ 2. 動的カテゴリ（パターンB）に対応するため、string + min(1) にシンプル化
  category: z.string().min(1, { message: "カテゴリを選択してください" }),
});

export type Schema = z.infer<typeof transactionSchema>;