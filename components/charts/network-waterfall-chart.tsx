"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NetworkWaterfallChartProps {
  data: any[];
}

export function NetworkWaterfallChart({ data }: NetworkWaterfallChartProps) {
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
          {data.map((req: any, index: number) => (
            <div
              key={req.id}
              className="flex items-center space-x-2 rounded p-1 text-xs transition-colors hover:bg-slate-700/30"
            >
              <div className="w-4 text-right text-slate-500">{index + 1}</div>
              <div className="w-20 truncate text-slate-300">{req.name}</div>
              <div className="relative h-4 min-w-[200px] flex-1 rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{
                    width: `${Math.min(100, (req.duration / 2000) * 100)}%`,
                    marginLeft: `${Math.min(80, (req.start / 3000) * 100)}%`,
                  }}
                />
              </div>
              <Badge variant="outline" className="min-w-[60px] border-slate-600 text-center text-xs text-slate-300">
                {req.protocol}
              </Badge>
              <div className="w-16 text-right text-slate-400">{req.duration}ms</div>
              <div className="w-16 text-right text-slate-500">{req.size.toFixed(1)}KB</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-xs text-slate-500">
          Showing all {data.length} network requests • Scroll to view more
        </div>
      </CardContent>
    </Card>
  );
}
