import { SalaryRange } from "./value-objects/salary-range.vo";
import { Seniority, type SeniorityLevel } from "./value-objects/seniority.vo";

export interface ProfessionalProfileProps {
  id?: string;
  userId: string;
  desiredRole: string;
  seniority: SeniorityLevel;
  salaryMin?: number | null;
  salaryMax?: number | null;
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
  structuredSummary?: string | null;
  specialties?: string[];
  hardSkills?: string[];
  softSkills?: string[];
  atsSummary?: string | null;
}

/**
 * Entidade de domínio. Não conhece Prisma, HTTP ou OpenAI —
 * só as regras que definem o que é um perfil profissional válido.
 */
export class ProfessionalProfile {
  readonly id?: string;
  readonly userId: string;
  readonly desiredRole: string;
  readonly seniority: Seniority;
  readonly salaryRange: SalaryRange;
  readonly city: string;
  readonly country: string;
  readonly openToRelocation: boolean;
  readonly workMode: string[];
  readonly technologies: string[];
  readonly languages: string[];
  readonly spokenLanguages: Array<{ language: string; level: string }>;
  readonly yearsOfExperience: number;
  readonly desiredCompanies: string[];
  readonly blockedCompanies: string[];
  readonly keywords: string[];
  readonly forbiddenKeywords: string[];
  readonly freeDescription?: string;
  readonly linkedinUrl?: string;
  readonly githubUrl?: string;
  readonly portfolioUrl?: string;
  readonly structuredSummary?: string | null;
  readonly specialties: string[];
  readonly hardSkills: string[];
  readonly softSkills: string[];
  readonly atsSummary?: string | null;

  constructor(props: ProfessionalProfileProps) {
    if (props.technologies.length === 0) {
      throw new Error("Perfil profissional precisa de ao menos uma tecnologia");
    }
    if (props.yearsOfExperience < 0) {
      throw new Error("Anos de experiência não pode ser negativo");
    }

    this.id = props.id;
    this.userId = props.userId;
    this.desiredRole = props.desiredRole;
    this.seniority = Seniority.create(props.seniority);
    this.salaryRange = SalaryRange.create(props.salaryMin, props.salaryMax, props.currency);
    this.city = props.city;
    this.country = props.country;
    this.openToRelocation = props.openToRelocation;
    this.workMode = props.workMode;
    this.technologies = props.technologies;
    this.languages = props.languages;
    this.spokenLanguages = props.spokenLanguages;
    this.yearsOfExperience = props.yearsOfExperience;
    this.desiredCompanies = props.desiredCompanies;
    this.blockedCompanies = props.blockedCompanies;
    this.keywords = props.keywords;
    this.forbiddenKeywords = props.forbiddenKeywords;
    this.freeDescription = props.freeDescription;
    this.linkedinUrl = props.linkedinUrl;
    this.githubUrl = props.githubUrl;
    this.portfolioUrl = props.portfolioUrl;
    this.structuredSummary = props.structuredSummary ?? null;
    this.specialties = props.specialties ?? [];
    this.hardSkills = props.hardSkills ?? [];
    this.softSkills = props.softSkills ?? [];
    this.atsSummary = props.atsSummary ?? null;
  }

  /** Uma empresa está bloqueada? Usado no Sourcing (Fase 2) antes de sequer pontuar a vaga. */
  isCompanyBlocked(companyName: string): boolean {
    const normalized = companyName.trim().toLowerCase();
    return this.blockedCompanies.some((c) => c.trim().toLowerCase() === normalized);
  }

  /** O perfil já tem conteúdo suficiente para a IA gerar o resumo estruturado? */
  isReadyForAIEnrichment(): boolean {
    return Boolean(this.freeDescription || this.githubUrl || this.linkedinUrl);
  }

  hasStructuredSummary(): boolean {
    return Boolean(this.structuredSummary);
  }
}
