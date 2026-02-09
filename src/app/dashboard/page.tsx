"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator } from "@/lib/types";
import { getCalculators, deleteCalculator, duplicateCalculator, saveCalculator } from "@/lib/storage";
import { createCalculatorFromTemplate, createBlankCalculator, templates } from "@/lib/templates";
import { CalculatorCard } from "@/components/CalculatorCard";
import { TemplateCard } from "@/components/TemplateCard";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [calcs, setCalcs] = useState<Calculator[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCalcs(getCalculators());
    setLoaded(true);
  }, []);

  const handleNew = () => {
    const c = createBlankCalculator();
    saveCalculator(c);
    router.push(`/calculator/${c.id}`);
  };

  const handleTemplate = (idx: number) => {
    const c = createCalculatorFromTemplate(idx);
    saveCalculator(c);
    router.push(`/calculator/${c.id}`);
  };

  const handleDuplicate = (id: string) => {
    duplicateCalculator(id);
    setCalcs(getCalculators());
  };

  const handleDelete = (id: string) => {
    deleteCalculator(id);
    setCalcs(getCalculators());
  };

  if (!loaded) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted mt-1">{calcs.length} calculator{calcs.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={handleNew} className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> New Calculator
          </button>
        </div>

        {calcs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Your Calculators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calcs.map((c) => (
                <CalculatorCard key={c.id} calc={c} onDuplicate={() => handleDuplicate(c.id)} onDelete={() => handleDelete(c.id)} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Start from a Template</h2>

          {/* AI-Powered Templates */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">AI-Powered</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {templates.slice(0, 4).map((t, i) => (
                <TemplateCard key={t.name} name={t.name} description={t.description} category={t.category} onSelect={() => handleTemplate(i)} />
              ))}
            </div>
          </div>

          {/* Industry Templates */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-primary bg-primary-subtle px-2 py-0.5 rounded-full">Industry</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {templates.slice(4, 10).map((t, i) => (
                <TemplateCard key={t.name} name={t.name} description={t.description} category={t.category} onSelect={() => handleTemplate(i + 4)} />
              ))}
            </div>
          </div>

          {/* General Templates */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-muted bg-surface px-2 py-0.5 rounded-full">General</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {templates.slice(10).map((t, i) => (
                <TemplateCard key={t.name} name={t.name} description={t.description} category={t.category} onSelect={() => handleTemplate(i + 10)} />
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
