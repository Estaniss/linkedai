import type { Seniority as PrismaSeniority, WorkMode as PrismaWorkMode } from "@prisma/client";

import { ProfessionalProfile } from "@/modules/profile/domain/professional-profile.entity";
import type { ProfileRepository } from "@/modules/profile/repositories/profile.repository";

import { prisma } from "../prisma-client";

export class PrismaProfileRepository implements ProfileRepository {
  async findByUserId(userId: string): Promise<ProfessionalProfile | null> {
    const record = await prisma.professionalProfile.findUnique({ where: { userId } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async create(profile: ProfessionalProfile): Promise<ProfessionalProfile> {
    const record = await prisma.professionalProfile.create({
      data: this.toPersistence(profile),
    });
    return this.toDomain(record);
  }

  async update(userId: string, profile: ProfessionalProfile): Promise<ProfessionalProfile> {
    const record = await prisma.professionalProfile.update({
      where: { userId },
      data: this.toPersistence(profile),
    });
    return this.toDomain(record);
  }

  async saveAIEnrichment(
    userId: string,
    data: {
      structuredSummary: string;
      specialties: string[];
      hardSkills: string[];
      softSkills: string[];
      atsSummary: string;
    },
  ): Promise<void> {
    await prisma.professionalProfile.update({
      where: { userId },
      data: {
        structuredSummary: data.structuredSummary,
        specialties: data.specialties,
        hardSkills: data.hardSkills,
        softSkills: data.softSkills,
        atsSummary: data.atsSummary,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDomain(record: any): ProfessionalProfile {
    return new ProfessionalProfile({
      id: record.id,
      userId: record.userId,
      desiredRole: record.desiredRole,
      seniority: record.seniority,
      salaryMin: record.salaryMin,
      salaryMax: record.salaryMax,
      currency: record.currency,
      city: record.city,
      country: record.country,
      openToRelocation: record.openToRelocation,
      workMode: record.workMode,
      technologies: record.technologies,
      languages: record.languages,
      spokenLanguages: record.spokenLanguages,
      yearsOfExperience: record.yearsOfExperience,
      desiredCompanies: record.desiredCompanies,
      blockedCompanies: record.blockedCompanies,
      keywords: record.keywords,
      forbiddenKeywords: record.forbiddenKeywords,
      freeDescription: record.freeDescription ?? undefined,
      linkedinUrl: record.linkedinUrl ?? undefined,
      githubUrl: record.githubUrl ?? undefined,
      portfolioUrl: record.portfolioUrl ?? undefined,
      structuredSummary: record.structuredSummary,
      specialties: record.specialties,
      hardSkills: record.hardSkills,
      softSkills: record.softSkills,
      atsSummary: record.atsSummary,
    });
  }

  private toPersistence(profile: ProfessionalProfile) {
    return {
      userId: profile.userId,
      desiredRole: profile.desiredRole,
      seniority: profile.seniority.value() as PrismaSeniority,
      salaryMin: profile.salaryRange.toJSON().min,
      salaryMax: profile.salaryRange.toJSON().max,
      currency: profile.salaryRange.toJSON().currency,
      city: profile.city,
      country: profile.country,
      openToRelocation: profile.openToRelocation,
      workMode: profile.workMode as PrismaWorkMode[],
      technologies: profile.technologies,
      languages: profile.languages,
      spokenLanguages: profile.spokenLanguages,
      yearsOfExperience: profile.yearsOfExperience,
      desiredCompanies: profile.desiredCompanies,
      blockedCompanies: profile.blockedCompanies,
      keywords: profile.keywords,
      forbiddenKeywords: profile.forbiddenKeywords,
      freeDescription: profile.freeDescription,
      linkedinUrl: profile.linkedinUrl,
      githubUrl: profile.githubUrl,
      portfolioUrl: profile.portfolioUrl,
    };
  }
}
