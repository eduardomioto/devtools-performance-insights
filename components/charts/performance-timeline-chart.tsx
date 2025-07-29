"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface PerformanceTimelineChartProps {
  data: any[]
}

export function PerformanceTimelineChart({ data }: PerformanceTimelineChartProps) {
  const [timelineZoom, setTimelineZoom] = useState(1)

  const resetTimelineZoom = () => setTimelineZoom(1)

  // Calculate timeline statistics
  const totalDuration = data.length > 0 ? Math.max(...data.map((d) => d.time)) : 0
  const maxCpu = data.length > 0 ? Math.max(...data.map((d) => d.cpu || 0)) : 0
  const maxMemory = data.length > 0 ? Math.max(...data.map((d) => d.memory || 0)) : 0
  const maxNetwork = data.length > 0 ? Math.max(...data.map((d) => d.network || 0)) : 0

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-slate-100 text-sm sm:text-base">Advanced Performance Timeline</CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              CPU, Memory, Network, WASM, WebGL, and GPU usage over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
              Complete Timeline: {(totalDuration / 1000).toFixed(1)}s
            </Badge>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimelineZoom(Math.min(3, timelineZoom * 1.2))}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimelineZoom(Math.max(0.5, timelineZoom / 1.2))}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetTimelineZoom}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ChartContainer
            config={{
              cpu: { label: "CPU Usage (%)", color: "#ef4444" },
              memory: { label: "Memory (MB)", color: "#3b82f6" },
              network: { label: "Network (KB/s)", color: "#10b981" },
              wasm: { label: "WASM Activity", color: "#f59e0b" },
              webgl: { label: "WebGL Activity", color: "#8b5cf6" },
              gpu: { label: "GPU Usage", color: "#06b6d4" },
            }}
            className="h-[300px] sm:h-[400px]"
            style={{ transform: `scale(${timelineZoom})`, transformOrigin: "top left" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}s`}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#ef4444" strokeWidth={2} dot={false} name="CPU (%)" />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Memory (MB)"
                />
                <Line
                  type="monotone"
                  dataKey="network"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Network (KB/s)"
                />
                <Line type="monotone" dataKey="wasm" stroke="#f59e0b" strokeWidth={2} dot={false} name="WASM" />
                <Line type="monotone" dataKey="webgl" stroke="#8b5cf6" strokeWidth={2} dot={false} name="WebGL" />
                <Line type="monotone" dataKey="gpu" stroke="#06b6d4" strokeWidth={2} dot={false} name="GPU" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div className="text-center">
            <div className="text-slate-400">Peak CPU</div>
            <div className="text-red-400 font-semibold">{maxCpu.toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Peak Memory</div>
            <div className="text-blue-400 font-semibold">{maxMemory.toFixed(1)}MB</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Peak Network</div>
            <div className="text-green-400 font-semibold">{maxNetwork.toFixed(1)}KB/s</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Data Points</div>
            <div className="text-slate-300 font-semibold">{data.length}</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Duration</div>
            <div className="text-slate-300 font-semibold">{(totalDuration / 1000).toFixed(1)}s</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Zoom</div>
            <div className="text-slate-300 font-semibold">{timelineZoom.toFixed(1)}x</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
