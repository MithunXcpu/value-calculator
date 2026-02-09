"use client";

import { FileSpreadsheet, Bot, Brain, Code2, Target, Users, Megaphone, Landmark, Shield, Truck, Scale, Cog } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "AI": Bot,
  "AI/NLP": Brain,
  "AI/Code": Code2,
  "AI/Sales": Target,
  "HR": Users,
  "Marketing": Megaphone,
  "Finance": Landmark,
  "Security": Shield,
  "Logistics": Truck,
  "Legal": Scale,
  "GRC": Shield,
  "General": FileSpreadsheet,
  "Operations": Cog,
};

interface Props {
  name: string;
  description: string;
  category?: string;
  onSelect: () => void;
}

export function TemplateCard({ name, description, category, onSelect }: Props) {
  const Icon = (category && CATEGORY_ICONS[category]) || FileSpreadsheet;
  const isAI = category?.startsWith("AI");

  return (
    <button
      onClick={onSelect}
      className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/30 hover:bg-card-hover transition-colors w-full group"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={`w-4 h-4 ${isAI ? "text-violet-500" : "text-primary"}`} />
        <h4 className="font-semibold text-sm">{name}</h4>
      </div>
      <p className="text-xs text-muted leading-relaxed line-clamp-2">{description}</p>
    </button>
  );
}
