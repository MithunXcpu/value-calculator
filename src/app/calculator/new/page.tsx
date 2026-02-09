"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createWizardCalculator } from "@/lib/templates";
import { saveCalculator } from "@/lib/storage";

export default function NewCalculatorPage() {
  const router = useRouter();

  useEffect(() => {
    const c = createWizardCalculator();
    saveCalculator(c);
    router.replace(`/calculator/${c.id}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted">
      Creating calculator...
    </div>
  );
}
