import { Database, Zap, CheckCircle, Globe, AlertTriangle, Activity, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { getPerformanceScore, getScoreColor, getCriticalIssuesCount } from "@/lib/performance-utils";
import type { ComplexPerformanceData } from "@/types/profiling-type";

interface PerformanceStatsProps {
  data: ComplexPerformanceData;
}

function getScoreIcon(score: number) {
  if (score >= 90) return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />;
  if (score >= 70) return <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />;
  if (score >= 50) return <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />;
  return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />;
}

export function PerformanceStats({ data }: PerformanceStatsProps) {
  const performanceScore = getPerformanceScore(data);
  const criticalIssuesCount = getCriticalIssuesCount(data);

  const stats = [
    {
      icon: getScoreIcon(performanceScore),
      label: "Performance Score",
      value: performanceScore,
      color: getScoreColor(performanceScore),
      tooltip: "Overall performance score based on WASM, GLB, and network metrics",
    },
    {
      icon: <Database className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />,
      label: "Network Requests",
      value: data.networkRequests.length,
      color: "text-blue-400",
      tooltip: "Total HTTP requests across all domains and protocols",
    },
    {
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />,
      label: "WASM Modules",
      value: data.wasmModules.length,
      color: "text-purple-400",
      tooltip: "WebAssembly modules with compilation and execution metrics",
    },
    {
      icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />,
      label: "3D Models",
      value: data.glbFiles.length,
      color: "text-orange-400",
      tooltip: "GLB/GLTF 3D model files with complexity analysis",
    },
    {
      icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />,
      label: "Domains",
      value: data.domains.length,
      color: "text-cyan-400",
      tooltip: "Unique domains with DNS and connection analysis",
    },
    {
      icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />,
      label: "Critical Issues",
      value: criticalIssuesCount,
      color: "text-red-400",
      tooltip: "High-impact performance issues requiring immediate attention",
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-4">
        {stats.map((stat, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-help">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    {stat.icon}
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-slate-400">{stat.label}</p>
                      <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>{stat.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
