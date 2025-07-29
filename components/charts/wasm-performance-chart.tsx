"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface WasmPerformanceChartProps {
  data: any[]
}

export function WasmPerformanceChart({ data }: WasmPerformanceChartProps) {
  const [wasmZoom, setWasmZoom] = useState(1)

  const resetWasmZoom = () => setWasmZoom(1)

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-100 text-sm sm:text-base">WASM Module Performance</CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              Load, compile, and instantiate times
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWasmZoom(Math.min(3, wasmZoom * 1.2))}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWasmZoom(Math.max(0.5, wasmZoom / 1.2))}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetWasmZoom}
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
              loadTime: { label: "Load Time (ms)", color: "#3b82f6" },
              compileTime: { label: "Compile Time (ms)", color: "#8b5cf6" },
              instantiateTime: {
                label: "Instantiate Time (ms)",
                color: "#10b981",
              },
            }}
            className="h-[200px] sm:h-[300px]"
            style={{ transform: `scale(${wasmZoom})`, transformOrigin: "top left" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis dataKey="name" type="category" width={80} stroke="#9ca3af" fontSize={10} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="loadTime" stackId="a" fill="#3b82f6" />
                <Bar dataKey="compileTime" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="instantiateTime" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
