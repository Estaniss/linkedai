"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useProfileWizardStore } from "@/stores/profile-wizard.store";

export function StepLinksResume() {
  const router = useRouter();
  const { basics, stack, preferences, links, setLinks, resumeFile, setResumeFile, back, reset } =
    useProfileWizardStore();

  const [linkedinUrl, setLinkedinUrl] = useState(links.linkedinUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(links.githubUrl ?? "");
  const [portfolioUrl, setPortfolioUrl] = useState(links.portfolioUrl ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!resumeFile) {
      setError("Envie seu currículo em PDF antes de concluir.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setLinks({ linkedinUrl, githubUrl, portfolioUrl });

    try {
      setStatus("Criando perfil...");
      const profileResponse = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...basics, ...stack, ...preferences, linkedinUrl, githubUrl, portfolioUrl }),
      });
      if (!profileResponse.ok) throw new Error((await profileResponse.json()).error ?? "Erro ao criar perfil");

      setStatus("Enviando currículo...");
      const formData = new FormData();
      formData.append("file", resumeFile);
      const resumeResponse = await fetch("/api/resume", { method: "POST", body: formData });
      if (!resumeResponse.ok) throw new Error((await resumeResponse.json()).error ?? "Erro ao enviar currículo");

      setStatus("Analisando perfil com IA (isso pode levar alguns segundos)...");
      const parseResponse = await fetch("/api/resume/parse", { method: "POST" });
      if (!parseResponse.ok) throw new Error((await parseResponse.json()).error ?? "Erro ao processar com IA");

      reset();
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
      setStatus(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium">LinkedIn</label>
        <Input
          type="url"
          placeholder="https://linkedin.com/in/seu-usuario"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">GitHub</label>
        <Input
          type="url"
          placeholder="https://github.com/seu-usuario"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Portfólio</label>
        <Input
          type="url"
          placeholder="https://seusite.com"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Currículo (PDF, até 5MB)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm"
        />
        {resumeFile && <p className="mt-1 text-xs text-muted-foreground">{resumeFile.name}</p>}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {status && !error && <p className="text-sm text-muted-foreground">{status}</p>}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={back} disabled={isSubmitting}>
          Voltar
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Processando..." : "Concluir cadastro"}
        </Button>
      </div>
    </div>
  );
}
