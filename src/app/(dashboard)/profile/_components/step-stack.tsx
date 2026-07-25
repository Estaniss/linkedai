"use client";

import { useState } from "react";

import { profileStackSchema } from "@/shared/schemas/profile.schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { TagsInput } from "@/shared/ui/tags-input";
import { useProfileWizardStore } from "@/stores/profile-wizard.store";

const WORK_MODE_OPTIONS = [
  { value: "REMOTE", label: "Remoto" },
  { value: "HYBRID", label: "Híbrido" },
  { value: "ONSITE", label: "Presencial" },
] as const;

export function StepStack() {
  const { stack, setStack, next, back } = useProfileWizardStore();

  const [technologies, setTechnologies] = useState<string[]>(stack.technologies ?? []);
  const [languages, setLanguages] = useState<string[]>(stack.languages ?? []);
  const [workMode, setWorkMode] = useState<string[]>(stack.workMode ?? []);
  const [yearsOfExperience, setYearsOfExperience] = useState(stack.yearsOfExperience ?? 0);
  const [error, setError] = useState<string | null>(null);

  function toggleWorkMode(value: string) {
    setWorkMode((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  function onSubmit() {
    const parsed = profileStackSchema.safeParse({
      technologies,
      languages,
      spokenLanguages: [{ language: "Português", level: "NATIVE" }],
      yearsOfExperience,
      workMode,
    });

    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Dados inválidos");
      return;
    }

    setError(null);
    setStack(parsed.data);
    next();
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Tecnologias</label>
        <TagsInput
          value={technologies}
          onChange={setTechnologies}
          placeholder="React, TypeScript, Laravel... (Enter para adicionar)"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Linguagens de programação</label>
        <TagsInput value={languages} onChange={setLanguages} placeholder="PHP, JavaScript..." />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Anos de experiência</label>
        <Input
          type="number"
          min={0}
          max={60}
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(Number(e.target.value))}
          className="max-w-[120px]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Modalidade de trabalho</label>
        <div className="flex gap-2">
          {WORK_MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleWorkMode(opt.value)}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                workMode.includes(opt.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={back}>
          Voltar
        </Button>
        <Button type="button" onClick={onSubmit}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
