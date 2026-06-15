import { z } from "zod";
import { formatZodErrors } from "@/lib/validations/common";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => (value ? value : null));

export const attendanceSessionPayloadSchema = z.object({
  title: z.string().trim().min(1, "Titulo da reuniao e obrigatorio.").max(160),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data valida no formato AAAA-MM-DD."),
  summary: optionalText(1000),
});

export const attendanceRecordPayloadSchema = z.object({
  memberId: z.string().trim().min(1, "Membro e obrigatorio."),
  present: z.boolean(),
  active: z.boolean(),
  notes: optionalText(1200),
});

export const attendanceSessionUpdatePayloadSchema = attendanceSessionPayloadSchema.extend({
  records: z.array(attendanceRecordPayloadSchema).max(500),
});

export type AttendanceSessionPayload = z.infer<typeof attendanceSessionPayloadSchema>;
export type AttendanceSessionUpdatePayload = z.infer<typeof attendanceSessionUpdatePayloadSchema>;
export { formatZodErrors };
