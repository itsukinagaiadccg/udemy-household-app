import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, { message: "日付は必須です" }),
  
  // ★ 登録開始時刻・終了時刻を追加（未入力でもエラーにならないよう optional または .string().optional() に設定）
  startTime: z.string().optional(),
  endTime: z.string().optional(),

  amount: z.number().min(1, { message: "金額は1円以上必須です" }),
  content: z
    .string()
    .min(1, { message: "内容を入力してください" })
    .max(50, { message: "内容は50文字以内にしてください。" }),

  userId: z.enum(["sectorL", "sectorI", "sectorA", "shared"], {
    errorMap: () => ({ message: "セクターを選択してください" }),
  }),

  category: z.string().min(1, { message: "カテゴリを選択してください" }),
});

export type Schema = z.infer<typeof transactionSchema>;