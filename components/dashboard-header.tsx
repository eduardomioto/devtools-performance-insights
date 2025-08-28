import { Activity, Info } from "lucide-react";
import type { ComplexPerformanceData } from "@/types/profiling-type";

interface DashboardHeaderProps {
  performanceData: ComplexPerformanceData | null;
}

export function DashboardHeader({ performanceData }: DashboardHeaderProps) {
  return (
    <div className="space-y-2 px-2 text-center sm:space-y-4">
      <div className="mb-2 flex items-center justify-center gap-3">
        <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-4xl font-bold leading-tight text-transparent lg:text-5xl">
          Advanced Performance Analytics
        </h1>
      </div>
      {performanceData && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Info className="h-4 w-4" />
          <span>
            Profile loaded • {performanceData.networkRequests.length} requests • {performanceData.domains.length}{" "}
            domains
          </span>
        </div>
      )}
    </div>
  );
}
