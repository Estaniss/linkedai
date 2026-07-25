import type { AIProvider } from "@/infrastructure/ai/openai.provider";
import { prisma } from "@/infrastructure/database/prisma-client";

import type { ProfileRepository } from "../repositories/profile.repository";

/**
 * Gera o embedding do perfil (para matching semântico na Fase 2) e grava via SQL raw,
 * já que o tipo `vector` do pgvector ainda não é suportado nativamente pelo Prisma Client.
 */
export class GenerateProfileEmbeddingUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly aiProvider: AIProvider,
  ) {}

  async execute(userId: string): Promise<void> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new Error("Perfil não encontrado.");
    }
    if (!profile.hasStructuredSummary()) {
      throw new Error("Gere o resumo estruturado (build-structured-profile) antes do embedding.");
    }

    const textForEmbedding = [
      profile.structuredSummary,
      profile.hardSkills.join(", "),
      profile.specialties.join(", "),
      profile.desiredRole,
    ]
      .filter(Boolean)
      .join("\n");

    const embedding = await this.aiProvider.generateEmbedding(textForEmbedding);
    const vectorLiteral = `[${embedding.join(",")}]`;

    await prisma.$executeRawUnsafe(
      `UPDATE professional_profiles SET "profileEmbedding" = $1::vector WHERE "userId" = $2`,
      vectorLiteral,
      userId,
    );
  }
}
