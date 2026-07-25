import { ProfessionalProfile } from "../domain/professional-profile.entity";
import type { ProfileRepository } from "../repositories/profile.repository";

export interface CreateProfileInput {
  userId: string;
  desiredRole: string;
  seniority: "INTERN" | "JUNIOR" | "MID" | "SENIOR" | "STAFF" | "PRINCIPAL";
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  city: string;
  country: string;
  openToRelocation: boolean;
  workMode: string[];
  technologies: string[];
  languages: string[];
  spokenLanguages: Array<{ language: string; level: string }>;
  yearsOfExperience: number;
  desiredCompanies: string[];
  blockedCompanies: string[];
  keywords: string[];
  forbiddenKeywords: string[];
  freeDescription?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export class CreateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(input: CreateProfileInput): Promise<ProfessionalProfile> {
    const existing = await this.profileRepository.findByUserId(input.userId);
    if (existing) {
      throw new Error("Usuário já possui um perfil profissional. Use update-profile.");
    }

    const profile = new ProfessionalProfile(input);
    return this.profileRepository.create(profile);
  }
}
