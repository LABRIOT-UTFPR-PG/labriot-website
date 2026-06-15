import { z } from "zod";
import {
  formatZodErrors,
  optionalHttpUrl,
  optionalImageLink,
  optionalText,
} from "@/lib/validations/common";

export const teamPayloadSchema = z.object({
  name: z.string().trim().min(1, "Nome e obrigatorio.").max(120),
  role: optionalText(120),
  specialization: optionalText(160),
  category: z.string().trim().min(1, "Setor / Grupo e obrigatorio.").max(120).default("students"),
  image: optionalImageLink,
  linkedin: optionalHttpUrl,
});

export type TeamPayload = z.infer<typeof teamPayloadSchema>;
export { formatZodErrors };
