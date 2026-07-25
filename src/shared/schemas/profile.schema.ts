import { z } from "zod";

export const seniorityEnum = z.enum(["INTERN", "JUNIOR", "MID", "SENIOR", "STAFF", "PRINCIPAL"]);
export const workModeEnum = z.enum(["REMOTE", "HYBRID", "ONSITE"]);

export const spokenLanguageSchema = z.object({
  language: z.string().min(1, "Informe o idioma"),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2", "NATIVE"]),
});

/** Step 1 — dados básicos */
export const profileBasicsSchema = z.object({
  desiredRole: z.string().min(2, "Informe o cargo desejado"),
  seniority: seniorityEnum,
  city: z.string().min(2, "Informe a cidade"),
  country: z.string().min(2, "Informe o país"),
  openToRelocation: z.boolean().default(false),
});

/** Step 2 — stack técnica e idiomas */
export const profileStackSchema = z.object({
  technologies: z.array(z.string().min(1)).min(1, "Informe ao menos uma tecnologia"),
  languages: z.array(z.string().min(1)).default([]),
  spokenLanguages: z.array(spokenLanguageSchema).min(1, "Informe ao menos um idioma falado"),
  yearsOfExperience: z.coerce.number().int().min(0).max(60),
  workMode: z.array(workModeEnum).min(1, "Selecione ao menos uma modalidade"),
});

/** Step 3 — preferências */
export const profilePreferencesSchema = z.object({
  salaryMin: z.coerce.number().int().positive().optional(),
  salaryMax: z.coerce.number().int().positive().optional(),
  currency: z.string().default("BRL"),
  desiredCompanies: z.array(z.string()).default([]),
  blockedCompanies: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  forbiddenKeywords: z.array(z.string()).default([]),
  freeDescription: z.string().max(2000).optional(),
});

/** Step 4 — links (upload do currículo é tratado por endpoint próprio) */
export const profileLinksSchema = z.object({
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
});

export const createProfileSchema = profileBasicsSchema
  .merge(profileStackSchema)
  .merge(profilePreferencesSchema)
  .merge(profileLinksSchema)
  .refine((data) => !data.salaryMax || !data.salaryMin || data.salaryMax >= data.salaryMin, {
    message: "Salário máximo deve ser maior ou igual ao mínimo",
    path: ["salaryMax"],
  });

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type ProfileBasicsInput = z.infer<typeof profileBasicsSchema>;
export type ProfileStackInput = z.infer<typeof profileStackSchema>;
export type ProfilePreferencesInput = z.infer<typeof profilePreferencesSchema>;
export type ProfileLinksInput = z.infer<typeof profileLinksSchema>;
