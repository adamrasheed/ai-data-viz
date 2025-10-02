import { z } from "zod";

export const ErrorSchema = z.object({
  type: z.string(),
  message: z.string(),
});

export const ItemSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  model: z.string(),
  prompt_tokens: z.number(),
  completion_tokens: z.number().nullable(),
  total_tokens: z.number().nullable(),
  response_time_ms: z.number(),
  status: z.enum(["success", "timeout"]),
  cost_usd: z.number(),
  temperature: z.number(),
  max_tokens: z.number(),
  prompt_template: z.string(),
  output: z.string().nullable(),
  evaluation_metrics: z
    .object({
      relevance_score: z.number(),
      factual_accuracy: z.number(),
      coherence_score: z.number(),
      response_quality: z.number(),
    })
    .nullable(),
  error: ErrorSchema.nullable(),
});

export type Error = z.infer<typeof ErrorSchema>;
export type Item = z.infer<typeof ItemSchema>;

export const responseSchema = z.object({
  responses: z.array(ItemSchema),
});

export type Response = z.infer<typeof responseSchema>;

export type Dataset = {
  id: string;
  label: string;
  data: Item[];
};
