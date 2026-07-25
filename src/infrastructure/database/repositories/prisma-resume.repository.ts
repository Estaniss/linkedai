import type { ResumeRecord, ResumeRepository } from "@/modules/profile/repositories/resume.repository";

import { prisma } from "../prisma-client";

export class PrismaResumeRepository implements ResumeRepository {
  async create(data: {
    userId: string;
    fileUrl: string;
    fileName: string;
    extractedText: string;
  }): Promise<ResumeRecord> {
    return prisma.resume.create({
      data: {
        userId: data.userId,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        extractedText: data.extractedText,
        isOriginal: true,
      },
    });
  }

  async findLatestByUserId(userId: string): Promise<ResumeRecord | null> {
    return prisma.resume.findFirst({
      where: { userId, isOriginal: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
