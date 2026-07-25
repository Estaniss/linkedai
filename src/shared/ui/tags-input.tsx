"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/cn";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagsInput({ value, onChange, placeholder }: TagsInputProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft("");
  }

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-primary",
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            aria-label={`Remover ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        className="min-w-[120px] flex-1 bg-transparent text-sm outline-none"
        placeholder={value.length === 0 ? placeholder : ""}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Backspace" && draft === "" && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
      />
    </div>
  );
}
