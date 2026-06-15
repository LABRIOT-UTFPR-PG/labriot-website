import { z } from "zod";
import { formatZodErrors } from "@/lib/validations/common";

export const loginPayloadSchema = z.object({
  username: z.string().trim().min(1, "Usuario e obrigatorio.").max(80),
  password: z.string().min(1, "Senha e obrigatoria.").max(200),
});

export type LoginPayload = z.infer<typeof loginPayloadSchema>;

export const createAdminPayloadSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Usuario precisa ter pelo menos 3 caracteres.")
    .max(80)
    .regex(/^[a-zA-Z0-9._-]+$/, "Use apenas letras, numeros, ponto, traco e underscore."),
  password: z
    .string()
    .min(8, "Senha precisa ter pelo menos 8 caracteres.")
    .max(200),
});

export const updateAdminPasswordPayloadSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual e obrigatoria.").max(200),
    newPassword: z.string().min(8, "Nova senha precisa ter pelo menos 8 caracteres.").max(200),
    confirmPassword: z.string().min(1, "Confirmacao de senha e obrigatoria.").max(200),
  })
  .superRefine((data, context) => {
    if (data.currentPassword === data.newPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "A nova senha precisa ser diferente da senha atual.",
      });
    }

    if (data.newPassword !== data.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "As senhas nao coincidem.",
      });
    }
  });

export type CreateAdminPayload = z.infer<typeof createAdminPayloadSchema>;
export type UpdateAdminPasswordPayload = z.infer<typeof updateAdminPasswordPayloadSchema>;
export { formatZodErrors };
