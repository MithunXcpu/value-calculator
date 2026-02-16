"use client";

import { useEffect, useState } from "react";
import { WhiteLabelSettings } from "@/lib/types";
import { getWhiteLabelSettings, saveWhiteLabelSettings } from "@/lib/storage";
import { Palette, Save, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [settings, setSettings] = useState<WhiteLabelSettings>({ companyName: "", logoBase64: "", primaryColor: "#f59e0b", accentColor: "#fbbf24" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getWhiteLabelSettings());
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSettings((s) => ({ ...s, logoBase64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveWhiteLabelSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Palette className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">White-Label Settings</h1>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Company Name</label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => setSettings((s) => ({ ...s, companyName: e.target.value }))}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Your Company Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Company Logo</label>
          <div className="flex items-center gap-4">
            {settings.logoBase64 && (
              <img src={settings.logoBase64} alt="Logo" className="w-16 h-16 object-contain rounded-lg bg-background border border-border p-2" />
            )}
            <label className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg cursor-pointer hover:bg-card-hover transition-colors text-sm">
              <Upload className="w-4 h-4" />
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings((s) => ({ ...s, primaryColor: e.target.value }))}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings((s) => ({ ...s, primaryColor: e.target.value }))}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings((s) => ({ ...s, accentColor: e.target.value }))}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
              />
              <input
                type="text"
                value={settings.accentColor}
                onChange={(e) => setSettings((s) => ({ ...s, accentColor: e.target.value }))}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preview</label>
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              {settings.logoBase64 && <img src={settings.logoBase64} alt="Logo" className="w-8 h-8 object-contain" />}
              <span className="font-bold" style={{ color: settings.primaryColor }}>{settings.companyName || "Your Company"}</span>
            </div>
            <div className="flex gap-3">
              <div className="rounded-lg px-4 py-2 text-white text-sm font-medium" style={{ background: settings.primaryColor }}>Primary Button</div>
              <div className="rounded-lg px-4 py-2 text-white text-sm font-medium" style={{ background: settings.accentColor }}>Accent Button</div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-medium transition-colors">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </motion.div>
  );
}
