"use client";

import { Sliders } from "lucide-react";

interface Props {
  discountRate: number;
  onChange: (rate: number) => void;
}

export function SensitivitySlider({ discountRate, onChange }: Props) {
  const pct = Math.round(discountRate * 100);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-muted" />
          <span className="text-xs font-medium text-muted uppercase tracking-wider">Sensitivity</span>
        </div>
        <span className="text-sm font-bold text-primary">{pct}%</span>
      </div>
      <div className="space-y-2">
        <label className="text-xs text-muted">Discount Rate</label>
        <input
          type="range"
          min={5}
          max={20}
          step={1}
          value={pct}
          onChange={(e) => onChange(Number(e.target.value) / 100)}
          className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-md"
        />
        <div className="flex justify-between text-xs text-muted">
          <span>5%</span>
          <span>Conservative</span>
          <span>20%</span>
        </div>
      </div>
    </div>
  );
}
