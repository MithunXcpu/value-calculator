"use client";

import { useState, useRef, useEffect } from "react";
import { ClientCompany } from "@/lib/types";
import { searchCompanies, getLogoUrl, CompanyEntry } from "@/lib/companies";
import { Building2, Search, X } from "lucide-react";

interface Props {
  company?: ClientCompany;
  onChange: (company: ClientCompany | undefined) => void;
}

export function CompanySelector({ company, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<CompanyEntry[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(searchCompanies(query, 8));
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectCompany = (entry: CompanyEntry) => {
    onChange({
      name: entry.name,
      ticker: entry.ticker || undefined,
      logoUrl: getLogoUrl(entry.domain),
    });
    setQuery("");
    setOpen(false);
  };

  const selectCustom = () => {
    if (!query.trim()) return;
    onChange({ name: query.trim() });
    setQuery("");
    setOpen(false);
  };

  if (company) {
    return (
      <div className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            className="w-8 h-8 rounded object-contain bg-white p-0.5"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-8 h-8 rounded bg-primary-subtle flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold">{company.name}</p>
          {company.ticker && <p className="text-xs text-muted">{company.ticker}</p>}
        </div>
        <button
          onClick={() => onChange(undefined)}
          className="p-1.5 hover:bg-card-hover rounded-lg text-muted hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2.5 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-colors">
        <Search className="w-4 h-4 text-muted flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search company (e.g., Salesforce, Goldman Sachs)..."
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted/60"
        />
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
          {results.map((entry) => (
            <button
              key={entry.ticker + entry.name}
              onClick={() => selectCompany(entry)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-card-hover transition-colors text-left"
            >
              <img
                src={getLogoUrl(entry.domain)}
                alt=""
                className="w-6 h-6 rounded object-contain bg-white p-0.5"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <span className="text-sm font-medium flex-1">{entry.name}</span>
              {entry.ticker && <span className="text-xs text-muted font-mono">{entry.ticker}</span>}
            </button>
          ))}
          {query.trim() && (
            <button
              onClick={selectCustom}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-card-hover transition-colors text-left border-t border-border"
            >
              <div className="w-6 h-6 rounded bg-primary-subtle flex items-center justify-center">
                <Building2 className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm">Use &quot;{query.trim()}&quot; as custom company</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
