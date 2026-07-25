import { ProfessionalProfile } from "../domain/professional-profile.entity";
import type { ProfileRepository } from "../repositories/profile.repository";
import type { CreateProfileInput } from "./create-profile.use-case";

export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(input: CreateProfileInput): Promise<ProfessionalProfile> {
    const existing = await this.profileRepository.findByUserId(input.userId);
    if (!existing) {
      throw new Error("Perfil não encontrado. Use create-profile primeiro.");
    }

    const profile = new ProfessionalProfile(input);
    return this.profileRepository.update(input.userId, profile);
  }
}
