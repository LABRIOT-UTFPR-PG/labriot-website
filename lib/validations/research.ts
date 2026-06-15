import { z } from "zod";
import { formatZodErrors, optionalText } from "@/lib/validations/common";

export const researchPayloadSchema = z.object({
  title: z.string().trim().min(1, "Titulo e obrigatorio.").max(180),
  description: optionalText(2000),
});

export type ResearchPayload = z.infer<typeof researchPayloadSchema>;
export { formatZodErrors };
