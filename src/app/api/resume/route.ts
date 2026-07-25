import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/infrastructure/auth/auth-options";
import { PrismaResumeRepository } from "@/infrastructure/database/repositories/prisma-resume.repository";
import { LocalResumeStorageProvider } from "@/infrastructure/storage/resume-storage.provider";
import { PdfTextExtractor } from "@/infrastructure/storage/pdf-text-extractor";
import { UploadResumeUseCase } from "@/modules/profile/use-cases/upload-resume.use-case";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 422 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const useCase = new UploadResumeUseCase(
    new LocalResumeStorageProvider(),
    new PrismaResumeRepository(),
    new PdfTextExtractor(),
  );

  try {
    const resume = await useCase.execute({
      userId: session.user.id,
      fileName: file.name,
      buffer,
    });
    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao processar currículo" },
      { status: 400 },
    );
  }
}
