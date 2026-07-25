import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "LinkedAI",
  description: "Encontre e organize candidaturas a vagas compatíveis com seu perfil, com apoio de IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
