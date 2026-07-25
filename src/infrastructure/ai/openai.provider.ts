import OpenAI from "openai";

import { env } from "@/config/env";

export interface StructuredProfileResult {
  structuredSummary: string;
  specialties: string[];
  hardSkills: string[];
  softSkills: string[];
  atsSummary: string;
}

export interface AIProvider {
  generateStructuredProfile(prompt: string): Promise<StructuredProfileResult>;
  generateEmbedding(text: string): Promise<number[]>;
}

export class OpenAIProvider implements AIProvider {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  async generateStructuredProfile(prompt: string): Promise<StructuredProfileResult> {
    const response = await this.client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI não retornou conteúdo para o perfil estruturado");
    }

    const parsed = JSON.parse(content) as StructuredProfileResult;
    this.validateStructuredProfile(parsed);
    return parsed;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: env.OPENAI_EMBEDDING_MODEL,
      input: text,
    });

    const embedding = response.data[0]?.embedding;
    if (!embedding) {
      throw new Error("OpenAI não retornou embedding");
    }
    return embedding;
  }

  private validateStructuredProfile(data: unknown): asserts data is StructuredProfileResult {
    const d = data as Partial<StructuredProfileResult>;
    if (
      typeof d.structuredSummary !== "string" ||
      !Array.isArray(d.specialties) ||
      !Array.isArray(d.hardSkills) ||
      !Array.isArray(d.softSkills) ||
      typeof d.atsSummary !== "string"
    ) {
      throw new Error("Resposta da IA fora do formato esperado para perfil estruturado");
    }
  }
}
