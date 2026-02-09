"use client";

import { useState } from "react";
import { Globe, Sparkles, Loader2, AlertCircle, Pencil, X } from "lucide-react";
import { ProductAnalysis } from "@/lib/types";

interface Props {
  analysis: ProductAnalysis | undefined;
  onAnalysisComplete: (analysis: ProductAnalysis) => void;
}

export function ProductDiscovery({ analysis, onAnalysisComplete }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Manual entry form state
  const [manualName, setManualName] = useState(analysis?.name || "");
  const [manualDescription, setManualDescription] = useState(analysis?.description || "");
  const [manualFeatures, setManualFeatures] = useState(analysis?.features?.join("\n") || "");
  const [manualTargetUsers, setManualTargetUsers] = useState(analysis?.targetUsers?.join("\n") || "");
  const [manualPainPoints, setManualPainPoints] = useState(analysis?.painPoints?.join("\n") || "");

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // Step 1: Scrape
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const scrapeData = await scrapeRes.json();

      if (!scrapeData.success) {
        throw new Error(scrapeData.error || "Failed to scrape website");
      }

      // Step 2: Analyze
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scrapedContent: scrapeData.data, url: url.trim() }),
      });
      const analyzeData = await analyzeRes.json();

      if (!analyzeData.success) {
        throw new Error(analyzeData.error || "Failed to analyze product");
      }

      onAnalysisComplete(analyzeData.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    const result: ProductAnalysis = {
      name: manualName.trim() || "My Product",
      description: manualDescription.trim() || "",
      features: manualFeatures
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      targetUsers: manualTargetUsers
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean),
      painPoints: manualPainPoints
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean),
      analyzedAt: new Date().toISOString(),
    };
    onAnalysisComplete(result);
    setManualMode(false);
    setEditMode(false);
  };

  // Show analysis result if exists
  if (analysis && !editMode) {
    return (
      <div className="space-y-4">
        <div className="bg-card border border-secondary/30 rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              <h3 className="font-semibold text-foreground">{analysis.name}</h3>
            </div>
            <button
              onClick={() => {
                setEditMode(true);
                setManualName(analysis.name);
                setManualDescription(analysis.description);
                setManualFeatures(analysis.features.join("\n"));
                setManualTargetUsers(analysis.targetUsers.join("\n"));
                setManualPainPoints(analysis.painPoints.join("\n"));
              }}
              className="p-1.5 hover:bg-card-hover rounded-lg text-muted hover:text-foreground transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-sm text-muted mb-3">{analysis.description}</p>

          {analysis.features.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1.5">Key Features</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.features.map((f, i) => (
                  <span key={i} className="px-2 py-0.5 bg-primary-subtle text-primary rounded-md text-xs">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.targetUsers.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1.5">Target Users</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.targetUsers.map((u, i) => (
                  <span key={i} className="px-2 py-0.5 bg-card-hover rounded-md text-xs text-foreground">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.painPoints.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1.5">Pain Points Addressed</p>
              <ul className="space-y-1">
                {analysis.painPoints.map((p, i) => (
                  <li key={i} className="text-xs text-muted flex items-start gap-1.5">
                    <span className="text-warning mt-0.5">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.sourceUrl && (
            <p className="text-xs text-muted mt-3 pt-3 border-t border-border">
              Source: {analysis.sourceUrl}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Edit mode or manual mode — show form
  if (editMode || manualMode) {
    return (
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">{editMode ? "Edit Product Analysis" : "Manual Entry"}</h3>
            <button
              onClick={() => { setEditMode(false); setManualMode(false); }}
              className="p-1 hover:bg-card-hover rounded-lg text-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted mb-1 block">Product Name</label>
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="e.g., AI Risk Essentials"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Description</label>
              <textarea
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                placeholder="What does this product do?"
                rows={3}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Key Features (one per line)</label>
              <textarea
                value={manualFeatures}
                onChange={(e) => setManualFeatures(e.target.value)}
                placeholder={"Automated risk scoring\nCompliance monitoring\nReal-time alerts"}
                rows={3}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Target Users (one per line)</label>
              <textarea
                value={manualTargetUsers}
                onChange={(e) => setManualTargetUsers(e.target.value)}
                placeholder={"Risk Managers\nCompliance Officers\nCISOs"}
                rows={2}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Pain Points Solved (one per line)</label>
              <textarea
                value={manualPainPoints}
                onChange={(e) => setManualPainPoints(e.target.value)}
                placeholder={"Manual risk assessments take days\nFragmented compliance tracking\nNo real-time visibility"}
                rows={2}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <button
              onClick={handleManualSubmit}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
            >
              {editMode ? "Save Changes" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Initial state — URL entry
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Product Discovery</h3>
        </div>

        <p className="text-sm text-muted mb-4">
          Enter the product website URL and we&apos;ll analyze it to understand features, target users, and pain points.
        </p>

        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="https://airiskessentials.com"
            disabled={loading}
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted disabled:opacity-50"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-danger">{error}</p>
              <button
                onClick={() => { setError(null); setManualMode(true); }}
                className="text-xs text-muted hover:text-foreground mt-1 underline"
              >
                Enter product details manually instead
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setManualMode(true)}
        className="text-xs text-muted hover:text-foreground transition-colors"
      >
        Skip — enter product details manually
      </button>
    </div>
  );
}
