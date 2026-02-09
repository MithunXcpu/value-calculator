"use client";

interface Props {
  roleLabel: string;
  baseline: number;
  gain: number;
  onBaselineChange: (v: number) => void;
  onGainChange: (v: number) => void;
}

export function GainSlider({ roleLabel, baseline, gain, onBaselineChange, onGainChange }: Props) {
  const after = baseline * (1 - gain / 100);
  const saved = baseline - after;
  const barWidth = baseline > 0 ? Math.max(5, (after / baseline) * 100) : 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{roleLabel}</span>
        <span className="text-xs text-secondary font-semibold">{saved.toFixed(1)} hrs saved</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-20">
          <label className="block text-[10px] text-muted mb-0.5">Baseline hrs</label>
          <input
            type="number"
            value={baseline}
            min={0}
            onChange={(e) => onBaselineChange(Math.max(0, Number(e.target.value)))}
            className="w-full bg-surface border border-border rounded-md px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span>Time Reduction</span>
            <span className="font-mono text-primary font-semibold">{gain}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={95}
            value={gain}
            onChange={(e) => onGainChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="relative h-2 rounded-full overflow-hidden bg-border">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
              style={{
                width: `${barWidth}%`,
                background: `linear-gradient(90deg, var(--secondary), var(--primary))`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted">
            <span>{baseline} hrs</span>
            <span className="text-secondary">{after.toFixed(1)} hrs after</span>
          </div>
        </div>
      </div>
    </div>
  );
}
