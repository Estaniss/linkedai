import type { ResumeStorageProvider } from "@/infrastructure/storage/resume-storage.provider";

import type { ResumeRecord, ResumeRepository } from "../repositories/resume.repository";

export interface TextExtractor {
  extractFromPdf(buffer: Buffer): Promise<string>;
}

export class UploadResumeUseCase {
  constructor(
    private readonly storageProvider: ResumeStorageProvider,
    private readonly resumeRepository: ResumeRepository,
    private readonly textExtractor: TextExtractor,
  ) {}

  async execute(input: { userId: string; fileName: string; buffer: Buffer }): Promise<ResumeRecord> {
    if (!input.fileName.toLowerCase().endsWith(".pdf")) {
      throw new Error("Apenas arquivos PDF são aceitos para o currículo");
    }
    if (input.buffer.byteLength > 5 * 1024 * 1024) {
      throw new Error("Currículo excede o limite de 5MB");
    }

    const extractedText = await this.textExtractor.extractFromPdf(input.buffer);
    const fileUrl = await this.storageProvider.upload(input);

    return this.resumeRepository.create({
      userId: input.userId,
      fileUrl,
      fileName: input.fileName,
      extractedText,
    });
  }
}
