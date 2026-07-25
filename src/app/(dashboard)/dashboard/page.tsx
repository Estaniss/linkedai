import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { authOptions } from "@/infrastructure/auth/auth-options";
import { PrismaProfileRepository } from "@/infrastructure/database/repositories/prisma-profile.repository";
import { Button } from "@/shared/ui/button";
import { StatCard } from "@/shared/ui/stat-card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await new PrismaProfileRepository().findByUserId(session.user.id);

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-2 text-xl font-semibold">Complete seu perfil profissional</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          A IA precisa entender quem você é antes de começar a buscar vagas compatíveis.
        </p>
        <Link href="/profile">
          <Button>Começar cadastro</Button>
        </Link>
      </div>
    );
  }

  const aiReady = profile.hasStructuredSummary();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Olá, {session.user.name?.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">
            {aiReady
              ? "Seu perfil já foi analisado pela IA."
              : "Estamos processando seu perfil com IA — isso pode levar alguns instantes."}
          </p>
        </div>
        <Link href="/profile">
          <Button variant="outline">Editar perfil</Button>
        </Link>
      </div>

      {/* Métricas reais chegam na Fase 2 (sourcing) e Fase 4 (analytics).
          Por ora exibimos o esqueleto do layout final do dashboard. */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Vagas encontradas" value="—" hint="Busca automática entra na Fase 2" />
        <StatCard label="Candidaturas enviadas" value="—" hint="Fase 3" />
        <StatCard label="Taxa de sucesso" value="—" hint="Fase 3" />
        <StatCard label="Score médio de match" value="—" hint="Fase 2" />
      </div>

      {aiReady && (
        <div className="mb-8 rounded-lg border border-border bg-background p-6">
          <h2 className="mb-3 text-sm font-semibold">Resumo gerado pela IA</h2>
          <p className="mb-4 text-sm text-muted-foreground">{profile.structuredSummary}</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.hardSkills.map((skill) => (
              <span key={skill} className="rounded bg-muted px-2 py-0.5 text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        A busca de vagas, o score de compatibilidade e o histórico de candidaturas aparecem aqui
        a partir da Fase 2.
      </div>
    </div>
  );
}
