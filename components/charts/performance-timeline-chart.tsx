"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface PerformanceTimelineChartProps {
  data: any[];
}

export function PerformanceTimelineChart({ data }: PerformanceTimelineChartProps) {
  const [timelineZoom, setTimelineZoom] = useState(1);

  const resetTimelineZoom = () => setTimelineZoom(1);

  // Validate data array
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-sm text-slate-100 sm:text-base">Advanced Performance Timeline</CardTitle>
          <CardDescription className="text-xs text-slate-400 sm:text-sm">
            CPU, Memory, Network, WASM, WebGL, and GPU usage over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-slate-400">
            No timeline data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Safe calculations with fallbacks
  const safeData = data.filter(d => d && typeof d.time === 'number');
  const totalDuration = safeData.length > 0 ? Math.max(...safeData.map(d => d.time)) : 0;
  const maxCpu = safeData.length > 0 ? Math.max(...safeData.map(d => Number(d.cpu) || 0)) : 0;
  const maxMemory = safeData.length > 0 ? Math.max(...safeData.map(d => Number(d.memory) || 0)) : 0;
  const maxNetwork = safeData.length > 0 ? Math.max(...safeData.map(d => Number(d.network) || 0)) : 0;

  return (
    <Card className="border-slate-700 bg-slate-800/50">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm text-slate-100 sm:text-base">Advanced Performance Timeline</CardTitle>
            <CardDescription className="text-xs text-slate-400 sm:text-sm">
              CPU, Memory, Network, WASM, WebGL, and GPU usage over time
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-slate-600 text-xs text-slate-300">
              Complete Timeline: {(totalDuration / 1000).toFixed(1)}s
            </Badge>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimelineZoom(Math.min(3, timelineZoom * 1.2))}
                className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                disabled={timelineZoom >= 3}
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimelineZoom(Math.max(0.5, timelineZoom / 1.2))}
                className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                disabled={timelineZoom <= 0.5}
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetTimelineZoom}
                className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                disabled={timelineZoom === 1}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Fixed zoom implementation using proper scrollable container */}
        <div className="overflow-x-auto overflow-y-hidden">
          <div 
            style={{ 
              width: timelineZoom > 1 ? `${timelineZoom * 100}%` : '100%',
              minWidth: '100%',
              height: '400px'
            }}
          >
            <ChartContainer
              config={{
                cpu: { label: "CPU Usage (%)", color: "#ef4444" },
                memory: { label: "Memory (MB)", color: "#3b82f6" },
                network: { label: "Network (KB/s)", color: "#10b981" },
                wasm: { label: "WASM Activity", color: "#f59e0b" },
                webgl: { label: "WebGL Activity", color: "#8b5cf6" },
                gpu: { label: "GPU Usage", color: "#06b6d4" },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={safeData} 
                  margin={{ 
                    top: 5, 
                    right: timelineZoom > 1 ? 30 : 5, 
                    left: 5, 
                    bottom: 5 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="time"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => `${(Number(value) / 1000).toFixed(1)}s`}
                    type="number"
                    scale="linear"
                    domain={['dataMin', 'dataMax']}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
                            <p className="text-slate-200 font-medium mb-2">
                              Time: {(Number(label) / 1000).toFixed(2)}s
                            </p>
                            {payload.map((entry, index) => (
                              <p key={index} style={{ color: entry.color }} className="text-sm">
                                {entry.name}: {Number(entry.value || 0).toFixed(1)}
                                {entry.dataKey === 'cpu' ? '%' : 
                                 entry.dataKey === 'memory' ? 'MB' : 
                                 entry.dataKey === 'network' ? 'KB/s' : ''}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cpu" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    dot={false} 
                    name="CPU (%)"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="memory" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={false} 
                    name="Memory (MB)"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="network" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={false} 
                    name="Network (KB/s)"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wasm" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    dot={false} 
                    name="WASM"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="webgl" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    dot={false} 
                    name="WebGL"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gpu" 
                    stroke="#06b6d4" 
                    strokeWidth={2} 
                    dot={false} 
                    name="GPU"
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
        
        {/* Stats grid with safe number formatting */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 lg:grid-cols-6">
          <div className="text-center">
            <div className="text-slate-400">Peak CPU</div>
            <div className="font-semibold text-red-400">{maxCpu.toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Peak Memory</div>
            <div className="font-semibold text-blue-400">{maxMemory.toFixed(1)}MB</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Peak Network</div>
            <div className="font-semibold text-green-400">{maxNetwork.toFixed(1)}KB/s</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Data Points</div>
            <div className="font-semibold text-slate-300">{safeData.length}</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Duration</div>
            <div className="font-semibold text-slate-300">{(totalDuration / 1000).toFixed(1)}s</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Zoom</div>
            <div className="font-semibold text-slate-300">{timelineZoom.toFixed(1)}x</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}