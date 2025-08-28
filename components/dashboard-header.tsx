import { Activity, Info } from "lucide-react";
import type { ComplexPerformanceData } from "@/types/profiling-type";

interface DashboardHeaderProps {
  performanceData: ComplexPerformanceData | null;
}

export function DashboardHeader({ performanceData }: DashboardHeaderProps) {
  return (
    <div className="space-y-2 px-2 text-center sm:space-y-4">
      {/* Fixed: Added back the missing icon */}
      <div className="mb-2 flex items-center justify-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 sm:h-10 sm:w-10">
          <Activity className="h-4 w-4 text-white sm:h-5 sm:w-5" />
        </div>
        <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-2xl font-bold leading-tight text-transparent sm:text-4xl">
          Advanced Performance Analytics
        </h1>
      </div>
      <p className="mx-auto max-w-3xl text-sm text-slate-300 sm:text-lg">
        Analyze complex Chrome profiles with WASM, GLB files, HTTP/2-3, and multi-domain architectures
      </p>
      {performanceData && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Info className="h-4 w-4" />
          <span>
            Profile loaded • {performanceData.networkRequests?.length || 0} requests •{" "}
            {performanceData.domains?.length || 0} domains
          </span>
        </div>
      )}
    </div>
  );
}
