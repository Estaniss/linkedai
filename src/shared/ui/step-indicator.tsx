import { cn } from "@/shared/lib/cn";

const STEP_LABELS = ["Dados básicos", "Stack técnica", "Preferências", "Currículo e links"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2">
      {STEP_LABELS.map((label, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < current;
        const isActive = stepNumber === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                isActive && "border-primary bg-primary text-primary-foreground",
                isDone && "border-primary bg-primary/10 text-primary",
                !isActive && !isDone && "border-border text-muted-foreground",
              )}
            >
              {isDone ? "✓" : stepNumber}
            </div>
            <span
              className={cn(
                "hidden text-sm sm:inline",
                isActive ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {stepNumber < STEP_LABELS.length && (
              <div className={cn("h-px flex-1", isDone ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
