"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface GlbComplexityChartProps {
  data: any[]
}

export function GlbComplexityChart({ data }: GlbComplexityChartProps) {
  const [glbZoom, setGlbZoom] = useState(1)

  const resetGlbZoom = () => setGlbZoom(1)

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-100 text-sm sm:text-base">3D Model Complexity</CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              GLB file size vs load time and complexity
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGlbZoom(Math.min(3, glbZoom * 1.2))}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGlbZoom(Math.max(0.5, glbZoom / 1.2))}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetGlbZoom}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ChartContainer
            config={{
              sizeMB: { label: "Size (MB)", color: "#f59e0b" },
              loadTime: { label: "Load Time (ms)", color: "#ef4444" },
            }}
            className="h-[200px] sm:h-[300px]"
            style={{ transform: `scale(${glbZoom})`, transformOrigin: "top left" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="sizeMB"
                  name="Size (MB)"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `${value.toFixed(1)}MB`}
                />
                <YAxis dataKey="loadTime" name="Load Time (ms)" stroke="#9ca3af" fontSize={12} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                />
                <Scatter dataKey="loadTime" fill="#f59e0b" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
