"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/shared/ui/button";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-background p-8 text-center">
      <h1 className="mb-1 text-xl font-semibold">Entrar no LinkedAI</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Encontre vagas compatíveis com seu perfil e organize suas candidaturas com apoio de IA.
      </p>
      <Button className="w-full" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
        Continuar com Google
      </Button>
    </div>
  );
}
