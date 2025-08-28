"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NetworkWaterfallChartProps {
  data: any[];
}

export function NetworkWaterfallChart({ data }: NetworkWaterfallChartProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-sm text-slate-100 sm:text-base">Network Waterfall</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-slate-400">No network requests available</div>
        </CardContent>
      </Card>
    );
  }

  // Fix hardcoded values - calculate from actual data
  const maxStart = Math.max(...data.map((req) => req.start || 0));
  const maxEnd = Math.max(...data.map((req) => (req.start || 0) + (req.duration || 0)));
  const totalTime = maxEnd || 1; // Prevent division by zero

  return (
    <Card className="border-slate-700 bg-slate-800/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-slate-100 sm:text-base">
          Network Waterfall (All {data.length} Requests)
        </CardTitle>
        <CardDescription className="text-xs text-slate-400 sm:text-sm">
          Complete request timing and protocol distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] space-y-2 overflow-y-auto">
          {data.map((req: any, index: number) => {
            const start = req.start || 0;
            const duration = req.duration || 0;
            const size = req.size || 0;

            // Dynamic scaling based on actual data
            const startPercent = (start / totalTime) * 80;
            const widthPercent = (duration / totalTime) * 80;

            return (
              <div
                key={req.id || index}
                className="flex items-center space-x-2 rounded p-1 text-xs transition-colors hover:bg-slate-700/30"
              >
                <div className="w-4 text-right text-slate-500">{index + 1}</div>
                <div className="w-20 truncate text-slate-300">{req.name || "Unknown"}</div>
                <div className="relative h-4 min-w-[200px] flex-1 rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{
                      width: `${Math.max(1, widthPercent)}%`,
                      marginLeft: `${startPercent}%`,
                    }}
                  />
                </div>
                <Badge variant="outline" className="min-w-[60px] border-slate-600 text-center text-xs text-slate-300">
                  {req.protocol || "unknown"}
                </Badge>
                <div className="w-16 text-right text-slate-400">{duration}ms</div>
                <div className="w-16 text-right text-slate-500">{size.toFixed(1)}KB</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center text-xs text-slate-500">
          Showing all {data.length} network requests • Scroll to view more
        </div>
      </CardContent>
    </Card>
  );
}
