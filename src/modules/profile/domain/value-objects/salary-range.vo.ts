export class SalaryRange {
  private constructor(
    private readonly min: number | null,
    private readonly max: number | null,
    private readonly currency: string,
  ) {}

  static create(min: number | null | undefined, max: number | null | undefined, currency = "BRL"): SalaryRange {
    if (min != null && max != null && max < min) {
      throw new Error("Salário máximo não pode ser menor que o mínimo");
    }
    if (min != null && min < 0) {
      throw new Error("Salário mínimo não pode ser negativo");
    }
    return new SalaryRange(min ?? null, max ?? null, currency);
  }

  /** Verifica se um valor ofertado pela vaga está dentro da pretensão do usuário. */
  contains(offeredMin: number | null, offeredMax: number | null): boolean {
    if (this.min == null && this.max == null) return true; // usuário sem restrição
    const offered = offeredMax ?? offeredMin;
    if (offered == null) return true; // vaga sem info de salário, não descarta
    if (this.min != null && offered < this.min) return false;
    return true;
  }

  toJSON() {
    return { min: this.min, max: this.max, currency: this.currency };
  }
}
