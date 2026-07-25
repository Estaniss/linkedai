import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/infrastructure/auth/auth-options";
import { OpenAIProvider } from "@/infrastructure/ai/openai.provider";
import { PrismaProfileRepository } from "@/infrastructure/database/repositories/prisma-profile.repository";
import { PrismaResumeRepository } from "@/infrastructure/database/repositories/prisma-resume.repository";
import { BuildStructuredProfileUseCase } from "@/modules/profile/use-cases/build-structured-profile.use-case";
import { GenerateProfileEmbeddingUseCase } from "@/modules/profile/use-cases/generate-profile-embedding.use-case";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const profileRepository = new PrismaProfileRepository();
  const resumeRepository = new PrismaResumeRepository();
  const aiProvider = new OpenAIProvider();

  try {
    await new BuildStructuredProfileUseCase(profileRepository, resumeRepository, aiProvider).execute(
      session.user.id,
    );
    await new GenerateProfileEmbeddingUseCase(profileRepository, aiProvider).execute(session.user.id);

    const profile = await profileRepository.findByUserId(session.user.id);
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao processar perfil com IA" },
      { status: 400 },
    );
  }
}
