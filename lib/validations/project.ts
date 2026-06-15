import { z } from "zod";
import {
  formatZodErrors,
  optionalDate,
  optionalImageLink,
  optionalLink,
  optionalText,
} from "@/lib/validations/common";

export const projectPayloadSchema = z
  .object({
    title: z.string().trim().min(1, "Titulo e obrigatorio.").max(160),
    description: optionalText(500),
    status: z.enum(["ongoing", "completed", "planned"]).default("ongoing"),
    startDate: optionalDate,
    endDate: optionalDate,
    image: optionalImageLink,
    url: optionalLink,
    fullDescription: optionalText(5000),
  })
  .superRefine((data, context) => {
    if (data.status === "completed" && !data.endDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Data de conclusao e obrigatoria para projetos concluidos.",
      });
    }
  });

export type ProjectPayload = z.infer<typeof projectPayloadSchema>;
export { formatZodErrors };
