export interface ResumeRecord {
  id: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  isOriginal: boolean;
  extractedText: string | null;
}

export interface ResumeRepository {
  create(data: {
    userId: string;
    fileUrl: string;
    fileName: string;
    extractedText: string;
  }): Promise<ResumeRecord>;
  findLatestByUserId(userId: string): Promise<ResumeRecord | null>;
}
