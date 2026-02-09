"use client";

import { useState, useEffect, useCallback } from "react";
import { Calculator, Stage, Assumptions, Role, RoleAllocation, ClientCompany, ProductAnalysis, WizardState } from "@/lib/types";
import { getCalculator, saveCalculator } from "@/lib/storage";
import { createBlankCalculator } from "@/lib/templates";

export function useCalculator(id: string) {
  const [calc, setCalc] = useState<Calculator | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existing = getCalculator(id);
    if (existing) {
      setCalc(existing);
    } else {
      const blank = createBlankCalculator();
      blank.id = id;
      saveCalculator(blank);
      setCalc(blank);
    }
    setLoaded(true);
  }, [id]);

  const save = useCallback((updated: Calculator) => {
    setCalc(updated);
    saveCalculator(updated);
  }, []);

  const updateName = useCallback((name: string) => {
    if (!calc) return;
    save({ ...calc, name });
  }, [calc, save]);

  const updateAssumptions = useCallback((assumptions: Assumptions) => {
    if (!calc) return;
    save({ ...calc, assumptions });
  }, [calc, save]);

  const updateStage = useCallback((stageId: string, updates: Partial<Stage>) => {
    if (!calc) return;
    save({
      ...calc,
      stages: calc.stages.map((s) => (s.id === stageId ? { ...s, ...updates } : s)),
    });
  }, [calc, save]);

  const updateStageByIndex = useCallback((index: number, stage: Stage) => {
    if (!calc) return;
    const stages = [...calc.stages];
    stages[index] = stage;
    save({ ...calc, stages });
  }, [calc, save]);

  const setStages = useCallback((stages: Stage[]) => {
    if (!calc) return;
    save({ ...calc, stages });
  }, [calc, save]);

  const addStage = useCallback(() => {
    if (!calc) return;
    const newStage: Stage = {
      id: crypto.randomUUID(),
      name: `Use Case ${calc.stages.length + 1}`,
      roleAllocations: calc.assumptions.roles.map((r) => ({
        roleId: r.id,
        baseline: 10,
        gain: 25,
      })),
      assumptions: "",
      rationale: "",
      peopleAffected: 3,
      workflow: "",
    };
    save({ ...calc, stages: [...calc.stages, newStage] });
  }, [calc, save]);

  const removeStage = useCallback((stageId: string) => {
    if (!calc) return;
    save({ ...calc, stages: calc.stages.filter((s) => s.id !== stageId) });
  }, [calc, save]);

  const removeStageByIndex = useCallback((index: number) => {
    if (!calc) return;
    save({ ...calc, stages: calc.stages.filter((_, i) => i !== index) });
  }, [calc, save]);

  const reorderStages = useCallback((fromIdx: number, toIdx: number) => {
    if (!calc) return;
    const stages = [...calc.stages];
    const [moved] = stages.splice(fromIdx, 1);
    stages.splice(toIdx, 0, moved);
    save({ ...calc, stages });
  }, [calc, save]);

  const addRole = useCallback((label = "New Role", hourlyRate = 100) => {
    if (!calc) return;
    const newRole: Role = { id: crypto.randomUUID(), label, hourlyRate };
    const updatedStages = calc.stages.map((s) => ({
      ...s,
      roleAllocations: [...s.roleAllocations, { roleId: newRole.id, baseline: 10, gain: 25 } as RoleAllocation],
    }));
    save({
      ...calc,
      assumptions: { ...calc.assumptions, roles: [...calc.assumptions.roles, newRole] },
      stages: updatedStages,
    });
  }, [calc, save]);

  const removeRole = useCallback((roleId: string) => {
    if (!calc || calc.assumptions.roles.length <= 1) return;
    const updatedStages = calc.stages.map((s) => ({
      ...s,
      roleAllocations: s.roleAllocations.filter((a) => a.roleId !== roleId),
    }));
    save({
      ...calc,
      assumptions: { ...calc.assumptions, roles: calc.assumptions.roles.filter((r) => r.id !== roleId) },
      stages: updatedStages,
    });
  }, [calc, save]);

  const updateRole = useCallback((roleId: string, updates: Partial<Role>) => {
    if (!calc) return;
    save({
      ...calc,
      assumptions: {
        ...calc.assumptions,
        roles: calc.assumptions.roles.map((r) => (r.id === roleId ? { ...r, ...updates } : r)),
      },
    });
  }, [calc, save]);

  const updateRoleAllocation = useCallback((stageId: string, roleId: string, updates: Partial<RoleAllocation>) => {
    if (!calc) return;
    save({
      ...calc,
      stages: calc.stages.map((s) =>
        s.id === stageId
          ? {
              ...s,
              roleAllocations: s.roleAllocations.map((a) =>
                a.roleId === roleId ? { ...a, ...updates } : a
              ),
            }
          : s
      ),
    });
  }, [calc, save]);

  const updateClientCompany = useCallback((company: ClientCompany | undefined) => {
    if (!calc) return;
    save({ ...calc, clientCompany: company });
  }, [calc, save]);

  const updateNextSteps = useCallback((nextSteps: string[]) => {
    if (!calc) return;
    save({ ...calc, nextSteps });
  }, [calc, save]);

  // Wizard-specific methods
  const updateWizardState = useCallback((wizardState: WizardState) => {
    if (!calc) return;
    save({ ...calc, wizardState });
  }, [calc, save]);

  const updateProductAnalysis = useCallback((productAnalysis: ProductAnalysis) => {
    if (!calc) return;
    save({ ...calc, productAnalysis });
  }, [calc, save]);

  const completeWizard = useCallback(() => {
    if (!calc) return;
    save({ ...calc, wizardState: { currentStep: 5, isComplete: true } });
  }, [calc, save]);

  return {
    calc,
    loaded,
    updateName,
    updateAssumptions,
    updateStage,
    updateStageByIndex,
    setStages,
    addStage,
    removeStage,
    removeStageByIndex,
    reorderStages,
    addRole,
    removeRole,
    updateRole,
    updateRoleAllocation,
    updateClientCompany,
    updateNextSteps,
    updateWizardState,
    updateProductAnalysis,
    completeWizard,
  };
}
