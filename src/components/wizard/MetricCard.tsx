"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props {
  icon: React.ElementType;
  label: string;
  value: string;
  description?: string;
  color?: string;
  toggleable?: boolean;
  defaultVisible?: boolean;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  color = "text-foreground",
  toggleable = false,
  defaultVisible = true,
}: Props) {
  const [visible, setVisible] = useState(defaultVisible);

  return (
    <div className={`bg-card border border-border rounded-xl p-4 transition-all ${!visible ? "opacity-40" : ""}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-medium text-muted uppercase tracking-wider">{label}</span>
        </div>
        {toggleable && (
          <button
            onClick={() => setVisible(!visible)}
            className="p-1 hover:bg-card-hover rounded-lg text-muted hover:text-foreground transition-colors"
            title={visible ? "Hide metric" : "Show metric"}
          >
            {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
      {visible && (
        <>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {description && <p className="text-xs text-muted mt-1">{description}</p>}
        </>
      )}
    </div>
  );
}
