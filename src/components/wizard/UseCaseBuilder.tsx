"use client";

import { useState } from "react";
import { Plus, Sparkles, Loader2, Trash2, ChevronDown, ChevronUp, Wand2 } from "lucide-react";
import { Stage, Assumptions, ProductAnalysis, RoleAllocation } from "@/lib/types";
import { getRoleById } from "@/lib/calculator";

interface Props {
  stages: Stage[];
  assumptions: Assumptions;
  productAnalysis?: ProductAnalysis;
  onUpdateStage: (index: number, stage: Stage) => void;
  onAddStage: () => void;
  onRemoveStage: (index: number) => void;
  onSetStages: (stages: Stage[]) => void;
}

export function UseCaseBuilder({
  stages,
  assumptions,
  productAnalysis,
  onUpdateStage,
  onAddStage,
  onRemoveStage,
  onSetStages,
}: Props) {
  const [generating, setGenerating] = useState(false);
  const [generatingRationale, setGeneratingRationale] = useState<string | null>(null);
  const [expandedStage, setExpandedStage] = useState<number>(0);

  const handleGenerateUseCases = async () => {
    if (!productAnalysis) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/generate-use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productAnalysis, roles: assumptions.roles }),
      });
      const data = await res.json();

      if (data.success && data.stages) {
        onSetStages(data.stages);
      }
    } catch {
      // Silently fail — user can add manually
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateRationale = async (index: number) => {
    if (!productAnalysis) return;
    const stage = stages[index];
    setGeneratingRationale(stage.id);

    try {
      const res = await fetch("/api/generate-rationale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, productAnalysis }),
      });
      const data = await res.json();

      if (data.success && data.rationale) {
        onUpdateStage(index, { ...stage, rationale: data.rationale });
      }
    } catch {
      // Silently fail
    } finally {
      setGeneratingRationale(null);
    }
  };

  const updateField = (index: number, field: keyof Stage, value: string | number) => {
    const stage = stages[index];
    onUpdateStage(index, { ...stage, [field]: value });
  };

  const updateAllocation = (stageIdx: number, roleId: string, field: "baseline" | "gain", value: number) => {
    const stage = stages[stageIdx];
    const allocations = stage.roleAllocations.map((a) =>
      a.roleId === roleId ? { ...a, [field]: value } : a
    );
    onUpdateStage(stageIdx, { ...stage, roleAllocations: allocations });
  };

  return (
    <div className="space-y-4">
      {/* Header with AI generate button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {stages.length} use case{stages.length !== 1 ? "s" : ""} defined
        </p>
        {productAnalysis && (
          <button
            onClick={handleGenerateUseCases}
            disabled={generating}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate with AI
              </>
            )}
          </button>
        )}
      </div>

      {/* Use Case Cards */}
      {stages.map((stage, idx) => (
        <div key={stage.id} className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Card Header */}
          <button
            onClick={() => setExpandedStage(expandedStage === idx ? -1 : idx)}
            className="w-full flex items-center justify-between p-4 hover:bg-card-hover transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-6 h-6 rounded-md bg-primary-subtle text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </span>
              <span className="font-medium text-sm truncate">{stage.name || "Untitled Use Case"}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveStage(idx); }}
                className="p-1 hover:bg-danger/10 rounded text-muted hover:text-danger transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {expandedStage === idx ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
            </div>
          </button>

          {/* Expanded Content */}
          {expandedStage === idx && (
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Name + Workflow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted mb-1 block">Use Case Name</label>
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) => updateField(idx, "name", e.target.value)}
                    placeholder="e.g., Document Review"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1 block">Workflow</label>
                  <input
                    type="text"
                    value={stage.workflow}
                    onChange={(e) => updateField(idx, "workflow", e.target.value)}
                    placeholder="Brief workflow description"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Current Process (assumptions) */}
              <div>
                <label className="text-xs text-muted mb-1 block">Current Process — What are you doing today?</label>
                <textarea
                  value={stage.assumptions}
                  onChange={(e) => updateField(idx, "assumptions", e.target.value)}
                  placeholder="Describe the current manual process and how much time it takes..."
                  rows={2}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {/* Role Allocations — Baseline & Gain */}
              <div>
                <label className="text-xs text-muted mb-1 block">Time Allocation by Role</label>
                <div className="space-y-2">
                  {stage.roleAllocations.map((alloc) => {
                    const role = getRoleById(assumptions.roles, alloc.roleId);
                    if (!role) return null;
                    const after = alloc.baseline * (1 - alloc.gain / 100);
                    return (
                      <div key={alloc.roleId} className="bg-background border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium">{role.label}</span>
                          <span className="text-xs text-secondary font-medium">
                            {alloc.baseline.toFixed(1)}h → {after.toFixed(1)}h ({alloc.gain}% reduction)
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-muted">Hours/week (before)</label>
                            <input
                              type="number"
                              min={0}
                              max={40}
                              step={0.5}
                              value={alloc.baseline}
                              onChange={(e) => updateAllocation(idx, alloc.roleId, "baseline", Number(e.target.value))}
                              className="w-full bg-card border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted">Gain %</label>
                            <input
                              type="range"
                              min={0}
                              max={90}
                              step={5}
                              value={alloc.gain}
                              onChange={(e) => updateAllocation(idx, alloc.roleId, "gain", Number(e.target.value))}
                              className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer mt-2
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* People Affected */}
              <div>
                <label className="text-xs text-muted mb-1 block">People Affected</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={stage.peopleAffected}
                  onChange={(e) => updateField(idx, "peopleAffected", Number(e.target.value))}
                  className="w-24 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Rationale */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-muted">Data-Driven Rationale</label>
                  {productAnalysis && (
                    <button
                      onClick={() => handleGenerateRationale(idx)}
                      disabled={generatingRationale === stage.id}
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover transition-colors disabled:opacity-50"
                    >
                      {generatingRationale === stage.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Wand2 className="w-3 h-3" />
                      )}
                      Generate
                    </button>
                  )}
                </div>
                <textarea
                  value={stage.rationale}
                  onChange={(e) => updateField(idx, "rationale", e.target.value)}
                  placeholder="Data-driven rationale citing industry benchmarks..."
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Use Case */}
      <button
        onClick={onAddStage}
        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border hover:border-primary/50 rounded-xl text-sm text-muted hover:text-foreground transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Use Case
      </button>
    </div>
  );
}
