import { z } from "zod";
import { formatZodErrors, optionalText, optionalTime, requiredDate } from "@/lib/validations/common";

export const eventPayloadSchema = z.object({
  title: z.string().trim().min(1, "Titulo e obrigatorio.").max(160),
  description: optionalText(1200),
  date: requiredDate,
  time: optionalTime,
  location: optionalText(200),
  status: z.enum(["Proximo", "Realizado", "Cancelado"]).default("Proximo"),
});

export type EventPayload = z.infer<typeof eventPayloadSchema>;
export { formatZodErrors };
