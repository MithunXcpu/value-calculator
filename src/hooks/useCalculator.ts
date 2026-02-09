"use client";

import { useState, useEffect, useCallback } from "react";
import { Calculator, Stage, Assumptions } from "@/lib/types";
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

  const addStage = useCallback(() => {
    if (!calc) return;
    const newStage: Stage = {
      id: crypto.randomUUID(),
      name: `Stage ${calc.stages.length + 1}`,
      baselineA: 10,
      baselineB: 15,
      gainA: 30,
      gainB: 25,
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

  const reorderStages = useCallback((fromIdx: number, toIdx: number) => {
    if (!calc) return;
    const stages = [...calc.stages];
    const [moved] = stages.splice(fromIdx, 1);
    stages.splice(toIdx, 0, moved);
    save({ ...calc, stages });
  }, [calc, save]);

  return { calc, loaded, updateName, updateAssumptions, updateStage, addStage, removeStage, reorderStages };
}
