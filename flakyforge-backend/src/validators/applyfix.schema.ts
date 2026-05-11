import { z } from "zod";

export const applyFixSchema = z.object({
  testRunId: z.string().min(1, "testRunId is required"),
  flakyTestId: z.string().min(1, "flakyTestId is required"),
});

export type ApplyFixInput = z.infer<typeof applyFixSchema>;