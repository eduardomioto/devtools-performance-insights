import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Advanced Performance Analytics",
  description:
    "Revolutionary Chrome DevTools profiling analysis with AI-powered insights, real-time monitoring, and advanced visualization for modern web applications.",
  keywords: ["performance", "analysis", "chrome", "devtools", "profiling", "optimization", "web", "development"],
  authors: [{ name: "PerfAnalyzer Team" }],
  openGraph: {
    title: "Advanced Performance Analytics",
    description: "Revolutionary Chrome DevTools profiling analysis with AI-powered insights",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon_128.ico" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics gaId="G-52SXW0J1BJ" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
