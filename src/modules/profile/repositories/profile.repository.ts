import type { ProfessionalProfile } from "../domain/professional-profile.entity";

export interface ProfileRepository {
  findByUserId(userId: string): Promise<ProfessionalProfile | null>;
  create(profile: ProfessionalProfile): Promise<ProfessionalProfile>;
  update(userId: string, profile: ProfessionalProfile): Promise<ProfessionalProfile>;
  saveAIEnrichment(
    userId: string,
    data: {
      structuredSummary: string;
      specialties: string[];
      hardSkills: string[];
      softSkills: string[];
      atsSummary: string;
    },
  ): Promise<void>;
}
