import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PerfAnalyzer - Next-Gen Performance Analysis",
  description:
    "Revolutionary Chrome DevTools profiling analysis with AI-powered insights, real-time monitoring, and advanced visualization for modern web applications.",
  keywords: ["performance", "analysis", "chrome", "devtools", "profiling", "optimization", "web", "development"],
  authors: [{ name: "PerfAnalyzer Team" }],
  openGraph: {
    title: "PerfAnalyzer - Next-Gen Performance Analysis",
    description: "Revolutionary Chrome DevTools profiling analysis with AI-powered insights",
    type: "website",
  },
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
