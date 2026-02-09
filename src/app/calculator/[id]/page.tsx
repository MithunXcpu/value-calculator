"use client";

import { useParams, useRouter } from "next/navigation";
import { useCalculator } from "@/hooks/useCalculator";
import { AssumptionsPanel } from "@/components/AssumptionsPanel";
import { StagesTable } from "@/components/StagesTable";
import { SummaryPanel } from "@/components/SummaryPanel";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CalculatorPage() {
  const params = useParams();
  const id = params.id as string;
  const { calc, loaded, updateName, updateAssumptions, updateStage, addStage, removeStage } = useCalculator(id);
  const router = useRouter();

  if (!loaded) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;
  if (!calc) return <div className="min-h-screen flex items-center justify-center text-muted">Calculator not found</div>;

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6 no-print">
        <Link href="/dashboard" className="p-2 hover:bg-card rounded-lg transition-colors text-muted hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <input
          type="text"
          value={calc.name}
          onChange={(e) => updateName(e.target.value)}
          className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
          placeholder="Calculator Name"
        />
        <span className="text-xs text-muted">Created {new Date(calc.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="no-print">
            <AssumptionsPanel assumptions={calc.assumptions} onChange={updateAssumptions} />
          </div>
          <StagesTable
            stages={calc.stages}
            assumptions={calc.assumptions}
            onUpdateStage={updateStage}
            onAddStage={addStage}
            onRemoveStage={removeStage}
          />
        </div>
        <div className="w-full lg:w-80 xl:w-96">
          <SummaryPanel
            stages={calc.stages}
            assumptions={calc.assumptions}
            onSave={() => {}}
            onExportPDF={handleExportPDF}
          />
        </div>
      </div>
    </motion.div>
  );
}
