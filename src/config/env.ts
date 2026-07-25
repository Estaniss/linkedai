import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(16),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  OPENAI_EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),
  STORAGE_PROVIDER: z.enum(["local", "s3", "supabase"]).default("local"),
  STORAGE_BUCKET: z.string().min(1),
  ENCRYPTION_KEY: z.string().length(64, "ENCRYPTION_KEY deve ter 32 bytes em hex (64 chars)"),
});

/**
 * Ponto único de acesso a variáveis de ambiente.
 * Lança erro no boot da aplicação caso alguma variável obrigatória esteja ausente/inválida,
 * em vez de falhar silenciosamente em runtime dentro de um use-case.
 */
  export const env = envSchema.parse(process.env);
