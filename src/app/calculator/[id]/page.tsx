"use client";

import { useParams, useRouter } from "next/navigation";
import { useCalculator } from "@/hooks/useCalculator";
import { AssumptionsPanel } from "@/components/AssumptionsPanel";
import { StagesList } from "@/components/StagesList";
import { SummaryPanel } from "@/components/SummaryPanel";
import { CompanySelector } from "@/components/CompanySelector";
import { StepIndicator } from "@/components/wizard/StepIndicator";
import { ProductDiscovery } from "@/components/wizard/ProductDiscovery";
import { UseCaseBuilder } from "@/components/wizard/UseCaseBuilder";
import { ResultsDashboard } from "@/components/wizard/ResultsDashboard";
import { ArrowLeft, ArrowRight, Building2, FileDown, Check } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CalculatorPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const {
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
    addRole,
    removeRole,
    updateRole,
    updateRoleAllocation,
    updateClientCompany,
    updateWizardState,
    updateProductAnalysis,
    completeWizard,
  } = useCalculator(id);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }
  if (!calc) return <div className="min-h-screen flex items-center justify-center text-muted">Calculator not found</div>;

  const isWizardMode = calc.wizardState && !calc.wizardState.isComplete;
  const currentStep = calc.wizardState?.currentStep ?? 1;

  const handleExportPDF = () => {
    router.push(`/calculator/${id}/pdf`);
  };

  const goToStep = (step: number) => {
    if (!calc.wizardState) return;
    updateWizardState({ ...calc.wizardState, currentStep: step });
  };

  const nextStep = () => {
    if (currentStep < 5) goToStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  const handleComplete = () => {
    completeWizard();
  };

  // ============ WIZARD MODE ============
  if (isWizardMode) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Wizard Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 hover:bg-card rounded-lg transition-colors text-muted hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <input
              type="text"
              value={calc.name}
              onChange={(e) => updateName(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 flex-1 placeholder:text-muted"
              placeholder="Calculator Name"
            />
          </div>
          <StepIndicator currentStep={currentStep} onStepClick={goToStep} />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Product Discovery */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">What product are you modeling?</h2>
                  <p className="text-sm text-muted">Enter a product URL to auto-analyze, or describe it manually.</p>
                </div>
                <ProductDiscovery
                  analysis={calc.productAnalysis}
                  onAnalysisComplete={(analysis) => {
                    updateProductAnalysis(analysis);
                    updateName(analysis.name ? `${analysis.name} Value Calculator` : calc.name);
                  }}
                />
              </div>
            )}

            {/* Step 2: Assumptions & People */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Set Your Assumptions</h2>
                  <p className="text-sm text-muted">Define roles, rates, and cost parameters for the model.</p>
                </div>

                {/* Company Selector */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-muted" />
                    <span className="text-xs font-medium text-muted uppercase tracking-wider">Client Company</span>
                  </div>
                  <CompanySelector company={calc.clientCompany} onChange={updateClientCompany} />
                </div>

                <AssumptionsPanel
                  assumptions={calc.assumptions}
                  onChange={updateAssumptions}
                  onAddRole={addRole}
                  onRemoveRole={removeRole}
                  onUpdateRole={updateRole}
                />
              </div>
            )}

            {/* Step 3: Use Cases */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Define Use Cases</h2>
                  <p className="text-sm text-muted">
                    What workflows will the tool improve? Describe the current process and expected gains.
                    {calc.productAnalysis && " Use AI to auto-generate use cases based on the product analysis."}
                  </p>
                </div>
                <UseCaseBuilder
                  stages={calc.stages}
                  assumptions={calc.assumptions}
                  productAnalysis={calc.productAnalysis}
                  onUpdateStage={updateStageByIndex}
                  onAddStage={addStage}
                  onRemoveStage={(idx) => removeStageByIndex(idx)}
                  onSetStages={setStages}
                />
              </div>
            )}

            {/* Step 4: Results Dashboard */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Results Dashboard</h2>
                  <p className="text-sm text-muted">
                    Interactive financial analysis. Toggle metrics, adjust the discount rate, and explore projections.
                  </p>
                </div>
                {calc.stages.length > 0 ? (
                  <ResultsDashboard stages={calc.stages} assumptions={calc.assumptions} />
                ) : (
                  <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <p className="text-muted">No use cases defined yet. Go back to Step 3 to add some.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Export */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Export & Finish</h2>
                  <p className="text-sm text-muted">Generate a board-ready PDF slide deck or continue editing.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleExportPDF}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors text-left group"
                  >
                    <FileDown className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Export PDF</h3>
                    <p className="text-sm text-muted">5-page board-ready slide deck with executive summary, use cases, and projections.</p>
                  </button>

                  <button
                    onClick={handleComplete}
                    className="bg-card border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors text-left group"
                  >
                    <Check className="w-8 h-8 text-secondary mb-3" />
                    <h3 className="font-semibold mb-1 group-hover:text-secondary transition-colors">Switch to Editor</h3>
                    <p className="text-sm text-muted">Complete the wizard and switch to the full editor for fine-tuning.</p>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-xs text-muted">Step {currentStep} of 5</span>
          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Check className="w-4 h-4" />
              Complete
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // ============ EDITOR MODE (existing calculators / wizard complete) ============
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="no-print mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/dashboard" className="p-2 hover:bg-card rounded-lg transition-colors text-muted hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <input
            type="text"
            value={calc.name}
            onChange={(e) => updateName(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 flex-1 placeholder:text-muted"
            placeholder="Calculator Name"
          />
        </div>

        {/* Company Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted flex-shrink-0">
            <Building2 className="w-3.5 h-3.5" />
            <span>Client</span>
          </div>
          <div className="flex-1 max-w-md">
            <CompanySelector company={calc.clientCompany} onChange={updateClientCompany} />
          </div>
          <span className="text-xs text-muted hidden sm:inline">Created {new Date(calc.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-5 min-w-0">
          <div className="no-print">
            <AssumptionsPanel
              assumptions={calc.assumptions}
              onChange={updateAssumptions}
              onAddRole={addRole}
              onRemoveRole={removeRole}
              onUpdateRole={updateRole}
            />
          </div>

          <StagesList
            stages={calc.stages}
            assumptions={calc.assumptions}
            onUpdateStage={updateStage}
            onUpdateAllocation={updateRoleAllocation}
            onAddStage={addStage}
            onRemoveStage={removeStage}
          />
        </div>

        {/* Right Column — Sticky Summary */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
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
