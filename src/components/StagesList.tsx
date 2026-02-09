"use client";

import { Stage, Assumptions, RoleAllocation } from "@/lib/types";
import { StageCard } from "./StageCard";
import { Plus } from "lucide-react";

interface Props {
  stages: Stage[];
  assumptions: Assumptions;
  onUpdateStage: (id: string, updates: Partial<Stage>) => void;
  onUpdateAllocation: (stageId: string, roleId: string, updates: Partial<RoleAllocation>) => void;
  onAddStage: () => void;
  onRemoveStage: (id: string) => void;
}

export function StagesList({ stages, assumptions, onUpdateStage, onUpdateAllocation, onAddStage, onRemoveStage }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Stages ({stages.length})
        </h3>
      </div>

      {stages.map((stage, i) => (
        <StageCard
          key={stage.id}
          stage={stage}
          index={i}
          assumptions={assumptions}
          onUpdate={(updates) => onUpdateStage(stage.id, updates)}
          onUpdateAllocation={(roleId, updates) => onUpdateAllocation(stage.id, roleId, updates)}
          onRemove={() => onRemoveStage(stage.id)}
          canRemove={stages.length > 1}
        />
      ))}

      <button
        onClick={onAddStage}
        className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-border rounded-xl text-sm text-muted hover:text-primary hover:border-primary hover:bg-primary-subtle/50 transition-all"
      >
        <Plus className="w-4 h-4" />
        Add Stage
      </button>
    </div>
  );
}
