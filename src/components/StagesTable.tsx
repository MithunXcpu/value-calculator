"use client";

import { Stage, Assumptions } from "@/lib/types";
import { calculateStage } from "@/lib/calculator";
import { StageRow } from "./StageRow";
import { Plus } from "lucide-react";

interface Props {
  stages: Stage[];
  assumptions: Assumptions;
  onUpdateStage: (id: string, updates: Partial<Stage>) => void;
  onAddStage: () => void;
  onRemoveStage: (id: string) => void;
}

export function StagesTable({ stages, assumptions, onUpdateStage, onAddStage, onRemoveStage }: Props) {
  return (
    <div className="space-y-2">
      <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 text-xs text-muted font-medium">
        <div className="col-span-2">Stage</div>
        <div className="col-span-1 text-center">{assumptions.roleALabel.slice(0, 8)} hrs</div>
        <div className="col-span-1 text-center">{assumptions.roleBLabel.slice(0, 8)} hrs</div>
        <div className="col-span-1 text-center">% Gain A</div>
        <div className="col-span-1 text-center">% Gain B</div>
        <div className="col-span-1 text-center">After A</div>
        <div className="col-span-1 text-center">After B</div>
        <div className="col-span-1 text-center">Saved</div>
        <div className="col-span-1 text-center">$ Saved</div>
        <div className="col-span-1"></div>
      </div>
      {stages.map((stage) => (
        <StageRow
          key={stage.id}
          stage={stage}
          calc={calculateStage(stage, assumptions)}
          currency={assumptions.currency}
          roleALabel={assumptions.roleALabel}
          roleBLabel={assumptions.roleBLabel}
          onChange={(updates) => onUpdateStage(stage.id, updates)}
          onRemove={() => onRemoveStage(stage.id)}
          canRemove={stages.length > 1}
        />
      ))}
      <button
        onClick={onAddStage}
        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border rounded-xl text-sm text-muted hover:text-primary hover:border-primary transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Stage
      </button>
    </div>
  );
}
