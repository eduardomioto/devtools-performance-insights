import { Activity, Info } from "lucide-react";
import type { ComplexPerformanceData } from "@/types/profiling-type";

interface DashboardHeaderProps {
  performanceData: ComplexPerformanceData | null;
}

export function DashboardHeader({ performanceData }: DashboardHeaderProps) {
  return (
    <div className="text-center space-y-2 sm:space-y-4 px-2">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Devtools Performance Insights
        </h1>
      </div>
      <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto">
        Analyze complex Chrome profiles with WASM, GLB files, HTTP/2-3, and multi-domain architectures
      </p>
      {performanceData && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Info className="w-4 h-4" />
          <span>
            Profile loaded • {performanceData.networkRequests.length} requests • {performanceData.domains.length}{" "}
            domains
          </span>
        </div>
      )}
    </div>
  );
}
