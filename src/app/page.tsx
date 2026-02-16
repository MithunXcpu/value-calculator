"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Clock,
  AlertTriangle,
  FileDown,
  Palette,
  Users,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "ROI Modeling",
    desc: "Build detailed ROI models with customizable workflow stages, roles, and efficiency assumptions.",
  },
  {
    icon: Clock,
    title: "Cost of Delay",
    desc: "Quantify the monthly cost of not acting — show stakeholders what inaction truly costs.",
  },
  {
    icon: FileDown,
    title: "PDF Export",
    desc: "Generate branded, professional PDF reports with executive summaries and detailed breakdowns.",
  },
  {
    icon: Palette,
    title: "White-Label",
    desc: "Customize with your logo, brand colors, and company name for client-ready deliverables.",
  },
  {
    icon: Users,
    title: "Multi-Role Analysis",
    desc: "Model efficiency gains across different roles with distinct hourly rates and impact areas.",
  },
  {
    icon: AlertTriangle,
    title: "Payback Period",
    desc: "Calculate exact payback period in months to justify investment timelines with confidence.",
  },
];

const stats = [
  { value: "40hrs", label: "saved per month", icon: Clock },
  { value: "$2.4M", label: "average ROI modeled", icon: TrendingUp },
  { value: "13", label: "industry templates", icon: Zap },
];

const steps = [
  {
    step: "01",
    title: "Enter a URL",
    desc: "Paste any product or tool URL. Our AI scrapes and understands the product instantly.",
    icon: Globe,
  },
  {
    step: "02",
    title: "AI Analysis",
    desc: "Claude analyzes the product, generates use cases, and builds a financial model automatically.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Interactive Dashboard",
    desc: "Toggle metrics, adjust assumptions, run sensitivity analysis, and export branded PDF reports.",
    icon: BarChart3,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        {/* Grid pattern background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245, 158, 11, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.3) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.4) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              AI-Powered Value Calculator
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <span
                style={{
                  background: "linear-gradient(135deg, #fafafa 0%, #a1a1aa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Prove the value of
              </span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                any investment
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Model ROI, payback period, and cost of delay with AI-driven workflow analysis.
              Export branded PDF reports. Justify any software or process investment in minutes.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                href="/calculator/new"
                className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-black px-7 py-3.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                Build a Calculator
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 border border-border hover:border-muted bg-card/50 hover:bg-card px-7 py-3.5 rounded-xl font-medium transition-all duration-200"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="flex items-center justify-center gap-4 py-6 md:py-8"
                variants={itemVariants}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to{" "}
            <span className="text-primary">justify value</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            From initial analysis to boardroom-ready reports, every tool you need in one place.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={itemVariants}>
              <div className="group relative bg-card border border-border rounded-xl p-6 h-full transition-all duration-300 hover:border-primary/30 hover:bg-card-hover">
                {/* Subtle gradient border glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(245, 158, 11, 0.03) 0%, transparent 50%)",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 mb-4">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three steps to{" "}
              <span className="text-primary">proving value</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Go from a product URL to an interactive ROI dashboard in under two minutes.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {steps.map((s, i) => (
              <motion.div key={s.step} variants={itemVariants}>
                <div className="relative bg-card border border-border rounded-xl p-8 text-center h-full">
                  {/* Step number */}
                  <div className="text-5xl font-black text-primary/10 mb-4 font-mono">{s.step}</div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.desc}</p>

                  {/* Connector arrow (hidden on last item and mobile) */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center rounded-full bg-border text-muted">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust / Social Proof */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-card border border-border rounded-2xl p-10 md:p-14">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-2xl md:text-3xl font-bold">Built for real decisions</h3>
            </div>
            <p className="text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
              Used by solution engineers and sales teams to build data-backed business cases.
              NPV, IRR, TCO, break-even, and sensitivity analysis — all in one tool.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
              <div className="flex items-center gap-2 justify-center text-sm text-muted">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2 justify-center text-sm text-muted">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2 justify-center text-sm text-muted">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span>Export to PDF</span>
              </div>
            </div>

            <Link
              href="/calculator/new"
              className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-black px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30 text-lg"
            >
              Start Building
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Get in Touch */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Get in Touch</h2>
          <p className="text-[var(--muted)] text-center mb-8">Have a question or want to work together?</p>
          <form action="https://formspree.io/f/xnjbjvng" method="POST" className="space-y-4">
            <input type="hidden" name="_subject" value="New message from Value Calculator" />
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input type="text" name="name" id="name" required className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f59e0b] transition-colors" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input type="email" name="email" id="email" required className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f59e0b] transition-colors" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <textarea name="message" id="message" required rows={4} className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f59e0b] transition-colors resize-none" placeholder="Your message..." />
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-[#f59e0b] hover:bg-[#d97706] rounded-lg text-black font-semibold transition-colors">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        Built by Mithun Manjunatha
      </footer>
    </div>
  );
}
