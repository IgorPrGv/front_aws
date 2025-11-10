
// src/components/AppShell.tsx (versão simplificada: lê user do contexto)
import * as React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function AppShell({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex flex-1">
        <div className="w-full mx-auto">{children}</div>
      </main>
      {footer ?? <Footer />}
    </div>
  );
}