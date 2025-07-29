import type { ComplexPerformanceData } from "@/types/profiling-type";

export function getPerformanceScore(data: ComplexPerformanceData): number {
  if (!data) return 0;

  let score = 100;

  // Penalize for slow WASM compilation
  const wasmPenalty = data.wasmModules.reduce((acc, mod) => acc + (mod.compileTime > 100 ? 5 : 0), 0);

  // Penalize for large GLB files
  const glbPenalty = data.glbFiles.reduce((acc, file) => acc + (file.size > 1000000 ? 10 : 0), 0);

  // Penalize for too many requests
  const requestsPenalty = data.networkRequests.length > 100 ? 15 : 0;

  // Penalize for slow network requests
  const slowRequestsPenalty = data.networkRequests.filter((req) => req.duration > 1000).length * 2;

  score = Math.max(0, score - wasmPenalty - glbPenalty - requestsPenalty - slowRequestsPenalty);
  return Math.round(score);
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-400";
  if (score >= 70) return "text-yellow-400";
  if (score >= 50) return "text-orange-400";
  return "text-red-400";
}

export function getCriticalIssuesCount(data: ComplexPerformanceData): number {
  return (
    data.wasmModules.filter((m) => m.compileTime > 100).length +
    data.glbFiles.filter((f) => f.size > 20000000).length +
    data.networkRequests.filter((r) => r.duration > 2000).length +
    (data.networkRequests.length > 200 ? 1 : 0)
  );
}
