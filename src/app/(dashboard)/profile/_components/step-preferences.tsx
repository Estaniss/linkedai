"use client";

import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { TagsInput } from "@/shared/ui/tags-input";
import { useProfileWizardStore } from "@/stores/profile-wizard.store";

export function StepPreferences() {
  const { preferences, setPreferences, next, back } = useProfileWizardStore();

  const [salaryMin, setSalaryMin] = useState(preferences.salaryMin?.toString() ?? "");
  const [salaryMax, setSalaryMax] = useState(preferences.salaryMax?.toString() ?? "");
  const [desiredCompanies, setDesiredCompanies] = useState<string[]>(preferences.desiredCompanies ?? []);
  const [blockedCompanies, setBlockedCompanies] = useState<string[]>(preferences.blockedCompanies ?? []);
  const [keywords, setKeywords] = useState<string[]>(preferences.keywords ?? []);
  const [forbiddenKeywords, setForbiddenKeywords] = useState<string[]>(preferences.forbiddenKeywords ?? []);
  const [freeDescription, setFreeDescription] = useState(preferences.freeDescription ?? "");

  function onSubmit() {
    setPreferences({
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      currency: "BRL",
      desiredCompanies,
      blockedCompanies,
      keywords,
      forbiddenKeywords,
      freeDescription,
    });
    next();
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Pretensão salarial mínima (R$)</label>
          <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Pretensão salarial máxima (R$)</label>
          <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Empresas desejadas</label>
        <TagsInput value={desiredCompanies} onChange={setDesiredCompanies} placeholder="Ex: Nubank, iFood" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Empresas bloqueadas</label>
        <TagsInput value={blockedCompanies} onChange={setBlockedCompanies} placeholder="Nunca mostrar vagas destas empresas" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Palavras-chave</label>
        <TagsInput value={keywords} onChange={setKeywords} placeholder="Termos que devem aparecer na vaga" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Palavras proibidas</label>
        <TagsInput
          value={forbiddenKeywords}
          onChange={setForbiddenKeywords}
          placeholder="Termos que descartam a vaga automaticamente"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Descrição livre</label>
        <textarea
          className="min-h-[100px] w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          placeholder="Conte livremente sobre sua trajetória, o que busca, etc. A IA usa isso para enriquecer seu perfil."
          value={freeDescription}
          onChange={(e) => setFreeDescription(e.target.value)}
          maxLength={2000}
        />
      </div>

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
