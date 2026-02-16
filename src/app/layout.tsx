import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Value Calculator by Mithun",
  description: "Model ROI, cost of delay, and payback period for any investment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${sora.variable} antialiased bg-background text-foreground min-h-screen`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
