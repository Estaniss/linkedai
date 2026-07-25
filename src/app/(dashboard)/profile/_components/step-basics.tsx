"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { profileBasicsSchema, type ProfileBasicsInput } from "@/shared/schemas/profile.schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useProfileWizardStore } from "@/stores/profile-wizard.store";

const SENIORITY_OPTIONS = [
  { value: "INTERN", label: "Estagiário" },
  { value: "JUNIOR", label: "Júnior" },
  { value: "MID", label: "Pleno" },
  { value: "SENIOR", label: "Sênior" },
  { value: "STAFF", label: "Staff" },
  { value: "PRINCIPAL", label: "Principal" },
] as const;

export function StepBasics() {
  const { basics, setBasics, next } = useProfileWizardStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileBasicsInput>({
    resolver: zodResolver(profileBasicsSchema),
    defaultValues: {
      desiredRole: basics.desiredRole ?? "",
      seniority: basics.seniority ?? "MID",
      city: basics.city ?? "",
      country: basics.country ?? "Brasil",
      openToRelocation: basics.openToRelocation ?? false,
    },
  });

  function onSubmit(data: ProfileBasicsInput) {
    setBasics(data);
    next();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Cargo desejado</label>
        <Input placeholder="Ex: Desenvolvedor Frontend Sênior" {...register("desiredRole")} />
        {errors.desiredRole && (
          <p className="mt-1 text-sm text-destructive">{errors.desiredRole.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Senioridade</label>
        <select
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          {...register("seniority")}
        >
          {SENIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Cidade</label>
          <Input placeholder="São Paulo" {...register("city")} />
          {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">País</label>
          <Input placeholder="Brasil" {...register("country")} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4" {...register("openToRelocation")} />
        Aberto a mudança de cidade/país
      </label>

      <div className="flex justify-end pt-2">
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  );
}
