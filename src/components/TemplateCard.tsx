"use client";

import { FileSpreadsheet } from "lucide-react";

interface Props {
  name: string;
  description: string;
  onSelect: () => void;
}

export function TemplateCard({ name, description, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 hover:bg-card-hover transition-colors w-full"
    >
      <div className="flex items-center gap-2 mb-2">
        <FileSpreadsheet className="w-5 h-5 text-primary" />
        <h4 className="font-semibold text-sm">{name}</h4>
      </div>
      <p className="text-xs text-muted leading-relaxed">{description}</p>
    </button>
  );
}
