"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Brush } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw, SkipBack, SkipForward, Maximize2 } from "lucide-react"

interface PerformanceTimelineChartProps {
  data: any[]
}

export function PerformanceTimelineChart({ data }: PerformanceTimelineChartProps) {
  const [timelineZoom, setTimelineZoom] = useState({ start: 0, end: 20 }) // Start with 20% view for better detail
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Calculate time range and statistics
  const timeStats = useMemo(() => {
    if (!data.length) return { min: 0, max: 0, duration: 0, range: "" }

    const min = Math.min(...data.map((d) => d.time))
    const max = Math.max(...data.map((d) => d.time))
    const duration = max - min

    let range = ""
    if (duration < 1000) {
      range = `${duration.toFixed(0)}ms`
    } else if (duration < 60000) {
      range = `${(duration / 1000).toFixed(1)}s`
    } else {
      range = `${(duration / 60000).toFixed(1)}m`
    }

    return { min, max, duration, range }
  }, [data])

  const formatTime = useCallback((value: number) => {
    if (value < 1000) return `${value}ms`
    if (value < 60000) return `${(value / 1000).toFixed(1)}s`
    return `${(value / 60000).toFixed(1)}m`
  }, [])

  const zoomIn = useCallback(() => {
    const currentRange = timelineZoom.end - timelineZoom.start
    const newRange = Math.max(5, currentRange * 0.7) // Minimum 5% zoom
    const center = (timelineZoom.start + timelineZoom.end) / 2
    const newStart = Math.max(0, center - newRange / 2)
    const newEnd = Math.min(100, newStart + newRange)

    setTimelineZoom({ start: newStart, end: newEnd })
  }, [timelineZoom])

  const zoomOut = useCallback(() => {
    const currentRange = timelineZoom.end - timelineZoom.start
    const newRange = Math.min(100, currentRange * 1.4)
    const center = (timelineZoom.start + timelineZoom.end) / 2
    const newStart = Math.max(0, center - newRange / 2)
    const newEnd = Math.min(100, newStart + newRange)

    setTimelineZoom({ start: newStart, end: newEnd })
  }, [timelineZoom])

  const panLeft = useCallback(() => {
    const range = timelineZoom.end - timelineZoom.start
    const panAmount = range * 0.3
    const newStart = Math.max(0, timelineZoom.start - panAmount)
    const newEnd = newStart + range

    if (newEnd <= 100) {
      setTimelineZoom({ start: newStart, end: newEnd })
    }
  }, [timelineZoom])

  const panRight = useCallback(() => {
    const range = timelineZoom.end - timelineZoom.start
    const panAmount = range * 0.3
    const newEnd = Math.min(100, timelineZoom.end + panAmount)
    const newStart = newEnd - range

    if (newStart >= 0) {
      setTimelineZoom({ start: newStart, end: newEnd })
    }
  }, [timelineZoom])

  const resetZoom = useCallback(() => {
    setTimelineZoom({ start: 0, end: 100 })
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  // Get visible data range
  const visibleData = useMemo(() => {
    const startIndex = Math.floor((timelineZoom.start / 100) * data.length)
    const endIndex = Math.ceil((timelineZoom.end / 100) * data.length)
    return data.slice(startIndex, endIndex)
  }, [data, timelineZoom])

  const zoomPercentage = Math.round(timelineZoom.end - timelineZoom.start)

  return (
    <Card
      className={`bg-slate-800/50 border-slate-700 transition-all duration-300 ${
        isFullscreen ? "fixed inset-4 z-50 shadow-2xl" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-slate-100 text-sm sm:text-base">Advanced Performance Timeline</CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              CPU, Memory, Network, WASM compilation, WebGL rendering, and GPU usage
            </CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs bg-slate-700 border-slate-600 text-slate-300">
                Duration: {timeStats.range}
              </Badge>
              <Badge variant="outline" className="text-xs bg-slate-700 border-slate-600 text-slate-300">
                Zoom: {zoomPercentage}%
              </Badge>
              <Badge variant="outline" className="text-xs bg-slate-700 border-slate-600 text-slate-300">
                Points: {data.length}
              </Badge>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={panLeft}
              disabled={timelineZoom.start <= 0}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              title="Pan Left"
            >
              <SkipBack className="w-3 h-3" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              disabled={zoomPercentage <= 5}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              disabled={zoomPercentage >= 100}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={panRight}
              disabled={timelineZoom.end >= 100}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              title="Pan Right"
            >
              <SkipForward className="w-3 h-3" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={resetZoom}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Time Range Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/50 rounded-lg p-2">
          <span>
            Viewing: {formatTime(timeStats.min + (timeStats.duration * timelineZoom.start) / 100)} -{" "}
            {formatTime(timeStats.min + (timeStats.duration * timelineZoom.end) / 100)}
          </span>
          <span>
            {visibleData.length} of {data.length} data points
          </span>
        </div>

        {/* Main Chart */}
        <div className="relative">
          <ChartContainer
            config={{
              cpu: { label: "CPU (%)", color: "#3b82f6" },
              memory: { label: "Memory (MB)", color: "#8b5cf6" },
              network: { label: "Network (KB/s)", color: "#06b6d4" },
              wasm: { label: "WASM (%)", color: "#10b981" },
              webgl: { label: "WebGL (%)", color: "#f59e0b" },
              gpu: { label: "GPU (%)", color: "#ef4444" },
            }}
            className={`w-full ${isFullscreen ? "h-[calc(100vh-300px)]" : "h-[300px] sm:h-[450px]"}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visibleData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  tickFormatter={formatTime}
                  stroke="#9ca3af"
                  fontSize={11}
                  interval="preserveStartEnd"
                  minTickGap={50}
                />
                <YAxis stroke="#9ca3af" fontSize={11} width={45} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "15px",
                    fontSize: "11px",
                  }}
                  iconType="line"
                  formatter={(value, entry) => <span style={{ color: entry.color, fontSize: "11px" }}>{value}</span>}
                />

                {/* Performance Lines */}
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  dot={false}
                  name="CPU (%)"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#8b5cf6"
                  strokeWidth={1.5}
                  dot={false}
                  name="Memory (MB)"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="network"
                  stroke="#06b6d4"
                  strokeWidth={1.5}
                  dot={false}
                  name="Network (KB/s)"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="wasm"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  dot={false}
                  name="WASM (%)"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="webgl"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  dot={false}
                  name="WebGL (%)"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="gpu"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  dot={false}
                  name="GPU (%)"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Timeline Overview with Brush */}
        <div className="bg-slate-900/30 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-2">Timeline Overview</div>
          <ChartContainer
            config={{
              cpu: { label: "CPU", color: "#3b82f6" },
            }}
            className="h-[80px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 25 }}>
                <XAxis
                  dataKey="time"
                  tickFormatter={formatTime}
                  fontSize={10}
                  stroke="#6b7280"
                  interval="preserveStartEnd"
                />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={1} dot={false} opacity={0.7} />
                <Brush
                  dataKey="time"
                  height={20}
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.1}
                  startIndex={Math.floor((timelineZoom.start / 100) * data.length)}
                  endIndex={Math.floor((timelineZoom.end / 100) * data.length)}
                  onChange={(brushData) => {
                    if (brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
                      setTimelineZoom({
                        start: (brushData.startIndex / data.length) * 100,
                        end: (brushData.endIndex / data.length) * 100,
                      })
                    }
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Metrics Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs bg-slate-900/30 rounded-lg p-3">
          {[
            { key: "cpu", label: "CPU (%)", color: "bg-blue-500" },
            { key: "memory", label: "Memory (MB)", color: "bg-purple-500" },
            { key: "network", label: "Network (KB/s)", color: "bg-cyan-500" },
            { key: "wasm", label: "WASM (%)", color: "bg-green-500" },
            { key: "webgl", label: "WebGL (%)", color: "bg-yellow-500" },
            { key: "gpu", label: "GPU (%)", color: "bg-red-500" },
          ].map(({ key, label, color }) => {
            const currentValue = visibleData.length > 0 ? visibleData[Math.floor(visibleData.length / 2)]?.[key] : 0

            return (
              <div key={key} className="flex items-center justify-between space-x-2 p-2 bg-slate-800/50 rounded">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-0.5 ${color}`}></div>
                  <span className="text-slate-300">{label}</span>
                </div>
                <span className="text-slate-400 font-mono text-xs">
                  {typeof currentValue === "number" ? currentValue.toFixed(1) : "—"}
                </span>
              </div>
            )
          })}
        </div>

        {/* Quick Navigation */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimelineZoom({ start: 0, end: 25 })}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          >
            First 25%
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimelineZoom({ start: 25, end: 50 })}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          >
            25-50%
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimelineZoom({ start: 50, end: 75 })}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          >
            50-75%
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimelineZoom({ start: 75, end: 100 })}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          >
            Last 25%
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
