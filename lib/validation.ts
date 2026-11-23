import { z } from 'zod';

/**
 * Permite apenas URLs relativas seguras (ex: /projects/roboflow) ou http(s)://
 * Bloqueia javascript:, data:, vbscript:, etc.
 */
export function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function sanitizeHref(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  return isSafeUrl(trimmed) ? trimmed : null;
}

const optionalSafeUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(isSafeUrl, { message: 'URL inválida. Use apenas https://, http:// ou caminho relativo /...' })
  .optional()
  .or(z.literal(''));

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function parseNumericId(rawId: string): number | null {
  if (!/^\d+$/.test(rawId)) return null;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Usuário é obrigatório').max(100),
  password: z.string().min(1, 'Senha é obrigatória').max(200),
});

export const postSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório').max(300),
  summary: z.string().trim().max(1000).optional().default(''),
  content: z.string().trim().min(1, 'Conteúdo é obrigatório').max(50000),
  author: z.string().trim().min(1, 'Autor é obrigatório').max(150),
  date: z.string().trim().min(1, 'Data é obrigatória').max(50),
  image: optionalSafeUrl.default(''),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório').max(300),
  description: z.string().trim().max(2000).optional().default(''),
  fullDescription: z.string().trim().max(50000).optional().default(''),
  status: z.enum(['ongoing', 'completed']).default('ongoing'),
  startDate: z.string().trim().max(50).optional().default(''),
  endDate: z.string().trim().max(50).optional().default(''),
  image: optionalSafeUrl.default(''),
  url: optionalSafeUrl.default(''),
});

export const eventSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório').max(300),
  description: z.string().trim().max(10000).optional().default(''),
  date: z.string().trim().min(1, 'Data é obrigatória').max(50),
  time: z.string().trim().max(50).optional().default(''),
  location: z.string().trim().max(300).optional().default(''),
});

export const publicationSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório').max(500),
  authors: z.string().trim().min(1, 'Autores são obrigatórios').max(1000),
  journal: z.string().trim().max(300).optional().default(''),
  year: z.coerce.number().int().min(1900).max(2100),
  doi: z.string().trim().max(300).optional().default(''),
  description: z.string().trim().max(5000).optional().default(''),
});

export const researchSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório').max(300),
  description: z.string().trim().max(10000).optional().default(''),
});

export const teamSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(200),
  specialization: z.string().trim().max(300).optional().default(''),
  category: z.string().trim().min(1).max(100).optional().default('Equipe'),
  image: optionalSafeUrl.default(''),
  linkedin: optionalSafeUrl.default(''),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome').max(150),
  email: z.string().trim().email('E-mail inválido').max(200),
  organization: z.string().trim().max(200).optional().default(''),
  inquiryType: z.string().trim().max(100).optional().default(''),
  interest: z.string().trim().max(100).optional().default(''),
  message: z.string().trim().min(10, 'Mensagem muito curta').max(5000),
  website: z.string().max(200).optional().default(''), // Honeypot anti-bot
});
