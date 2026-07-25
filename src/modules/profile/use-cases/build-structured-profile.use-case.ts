import type { AIProvider } from "@/infrastructure/ai/openai.provider";
import { buildStructuredProfilePrompt } from "@/infrastructure/ai/prompts/structured-profile.prompt";

import type { ProfileRepository } from "../repositories/profile.repository";
import type { ResumeRepository } from "../repositories/resume.repository";

export class BuildStructuredProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly aiProvider: AIProvider,
  ) {}

  async execute(userId: string): Promise<void> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new Error("Perfil não encontrado. Complete o cadastro antes de gerar o resumo com IA.");
    }

    const resume = await this.resumeRepository.findLatestByUserId(userId);
    if (!resume?.extractedText) {
      throw new Error("Nenhum currículo processado encontrado para este usuário.");
    }

    const prompt = buildStructuredProfilePrompt({
      resumeText: resume.extractedText,
      githubUrl: profile.githubUrl,
      linkedinUrl: profile.linkedinUrl,
      freeDescription: profile.freeDescription,
      desiredRole: profile.desiredRole,
      technologies: profile.technologies,
    });

    const result = await this.aiProvider.generateStructuredProfile(prompt);

    await this.profileRepository.saveAIEnrichment(userId, result);
  }
}
