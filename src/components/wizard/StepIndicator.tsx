"use client";

import { Check } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: "Product" },
  { number: 2, label: "Assumptions" },
  { number: 3, label: "Use Cases" },
  { number: 4, label: "Results" },
  { number: 5, label: "Export" },
];

interface Props {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-2xl mx-auto">
      {STEPS.map((step, i) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isClickable = onStepClick && step.number < currentStep;

        return (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            {/* Step Circle + Label */}
            <button
              onClick={isClickable ? () => onStepClick(step.number) : undefined}
              disabled={!isClickable}
              className={`flex flex-col items-center gap-1.5 group ${isClickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-secondary text-white"
                    : isCurrent
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-card border border-border text-muted"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isCurrent ? "text-foreground" : isCompleted ? "text-secondary" : "text-muted"
                }`}
              >
                {step.label}
              </span>
            </button>

            {/* Connector Line */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mt-[-18px]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    step.number < currentStep ? "bg-secondary" : "bg-border"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
