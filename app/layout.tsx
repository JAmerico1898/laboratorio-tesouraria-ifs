import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laboratório de Tesouraria — Prof. José Américo",
  description:
    "Laboratório de Tesouraria de Instituições Financeiras: simulações interativas de operações de tesouraria, ETTJ, apreçamento e gestão de risco. Prof. José Américo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-5 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
