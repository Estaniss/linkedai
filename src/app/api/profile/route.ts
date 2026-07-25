import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/infrastructure/auth/auth-options";
import { PrismaProfileRepository } from "@/infrastructure/database/repositories/prisma-profile.repository";
import { CreateProfileUseCase } from "@/modules/profile/use-cases/create-profile.use-case";
import { UpdateProfileUseCase } from "@/modules/profile/use-cases/update-profile.use-case";
import { createProfileSchema } from "@/shared/schemas/profile.schema";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return session.user.id;
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const repository = new PrismaProfileRepository();
  const useCase = new CreateProfileUseCase(repository);

  try {
    const profile = await useCase.execute({ ...parsed.data, userId });
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar perfil" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const repository = new PrismaProfileRepository();
  const useCase = new UpdateProfileUseCase(repository);

  try {
    const profile = await useCase.execute({ ...parsed.data, userId });
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao atualizar perfil" },
      { status: 400 },
    );
  }
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const repository = new PrismaProfileRepository();
  const profile = await repository.findByUserId(userId);
  return NextResponse.json(profile);
}
