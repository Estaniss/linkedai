export type SeniorityLevel = "INTERN" | "JUNIOR" | "MID" | "SENIOR" | "STAFF" | "PRINCIPAL";

const ORDER: SeniorityLevel[] = ["INTERN", "JUNIOR", "MID", "SENIOR", "STAFF", "PRINCIPAL"];

export class Seniority {
  private constructor(private readonly level: SeniorityLevel) {}

  static create(level: SeniorityLevel): Seniority {
    if (!ORDER.includes(level)) {
      throw new Error(`Senioridade inválida: ${level}`);
    }
    return new Seniority(level);
  }

  /** Distância entre níveis — usada no cálculo de compatibilidade (Fase 2). */
  distanceTo(other: Seniority): number {
    return Math.abs(ORDER.indexOf(this.level) - ORDER.indexOf(other.level));
  }

  value(): SeniorityLevel {
    return this.level;
  }
}
