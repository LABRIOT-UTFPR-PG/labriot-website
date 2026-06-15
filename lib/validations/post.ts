import { z } from "zod";
import {
  formatZodErrors,
  optionalImageLink,
  optionalText,
  requiredDate,
} from "@/lib/validations/common";

export const postPayloadSchema = z.object({
  title: z.string().trim().min(1, "Titulo e obrigatorio.").max(180),
  summary: optionalText(400),
  content: z.string().trim().min(1, "Conteudo e obrigatorio.").max(20000),
  author: optionalText(120),
  date: requiredDate,
  image: optionalImageLink,
});

export type PostPayload = z.infer<typeof postPayloadSchema>;
export { formatZodErrors };
