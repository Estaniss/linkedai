"use client";

import { StepBasics } from "./_components/step-basics";
import { StepLinksResume } from "./_components/step-links-resume";
import { StepPreferences } from "./_components/step-preferences";
import { StepStack } from "./_components/step-stack";
import { StepIndicator } from "@/shared/ui/step-indicator";
import { useProfileWizardStore } from "@/stores/profile-wizard.store";

export default function ProfileWizardPage() {
  const step = useProfileWizardStore((s) => s.step);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-1 text-2xl font-semibold">Monte seu perfil profissional</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Essas informações alimentam a IA que vai encontrar e priorizar vagas para você.
      </p>

      <StepIndicator current={step} />

      <div className="rounded-lg border border-border bg-background p-6">
        {step === 1 && <StepBasics />}
        {step === 2 && <StepStack />}
        {step === 3 && <StepPreferences />}
        {step === 4 && <StepLinksResume />}
      </div>
    </div>
  );
}
