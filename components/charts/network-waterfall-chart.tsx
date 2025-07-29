"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface NetworkWaterfallChartProps {
  data: any[]
}

export function NetworkWaterfallChart({ data }: NetworkWaterfallChartProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-100 text-sm sm:text-base">
          Network Waterfall (All {data.length} Requests)
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs sm:text-sm">
          Complete request timing and protocol distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {data.map((req: any, index: number) => (
            <div
              key={req.id}
              className="flex items-center space-x-2 text-xs hover:bg-slate-700/30 p-1 rounded transition-colors"
            >
              <div className="w-4 text-slate-500 text-right">{index + 1}</div>
              <div className="w-20 truncate text-slate-300">{req.name}</div>
              <div className="flex-1 bg-slate-700 rounded-full h-4 relative min-w-[200px]">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (req.duration / 2000) * 100)}%`,
                    marginLeft: `${Math.min(80, (req.start / 3000) * 100)}%`,
                  }}
                />
              </div>
              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 min-w-[60px] text-center">
                {req.protocol}
              </Badge>
              <div className="w-16 text-right text-slate-400">{req.duration}ms</div>
              <div className="w-16 text-right text-slate-500">{req.size.toFixed(1)}KB</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-slate-500 text-center">
          Showing all {data.length} network requests • Scroll to view more
        </div>
      </CardContent>
    </Card>
  )
}
