"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Clock, AlertTriangle, FileDown, Palette, Users } from "lucide-react";

const features = [
  { icon: BarChart3, title: "ROI Modeling", desc: "Build detailed ROI models with customizable workflow stages, roles, and efficiency assumptions" },
  { icon: Clock, title: "Cost of Delay", desc: "Quantify the monthly cost of not acting — show stakeholders what inaction costs" },
  { icon: FileDown, title: "PDF Export", desc: "Generate branded, professional PDF reports with executive summaries and detailed breakdowns" },
  { icon: Palette, title: "White-Label", desc: "Customize with your logo, brand colors, and company name for client-ready deliverables" },
  { icon: Users, title: "Multi-Role Analysis", desc: "Model efficiency gains across different roles with distinct hourly rates and impact areas" },
  { icon: AlertTriangle, title: "Payback Period", desc: "Calculate exact payback period in months to justify investment timelines" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <BarChart3 className="w-4 h-4" />
            Value Calculator
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Prove the value of<br />
            <span className="text-primary">any investment</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            Model ROI, payback period, and cost of delay with detailed workflow analysis. Export branded PDF reports. Justify any software or process investment.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/calculator/new" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-medium transition-colors">
              Build a Calculator
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 border border-border hover:bg-card px-6 py-3 rounded-xl font-medium transition-colors">
              View Dashboard
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, duration: 0.5 }}>
              <div className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary/20 transition-colors">
                <f.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        Built by Mithun Manjunatha
      </footer>
    </div>
  );
}
