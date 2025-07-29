"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Brush } from "recharts";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface PerformanceTimelineChartProps {
  data: any[];
}

export function PerformanceTimelineChart({ data }: PerformanceTimelineChartProps) {
  const [timelineZoom, setTimelineZoom] = useState({ start: 0, end: 100 });

  const resetTimelineZoom = () => setTimelineZoom({ start: 0, end: 100 });

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-100 text-sm sm:text-base">Advanced Performance Timeline</CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              CPU, Memory, Network, WASM compilation, WebGL rendering, and GPU usage
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setTimelineZoom({
                  start: Math.max(0, timelineZoom.start - 10),
                  end: Math.min(100, timelineZoom.end - 10),
                })
              }
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setTimelineZoom({
                  start: Math.min(90, timelineZoom.start + 10),
                  end: Math.max(10, timelineZoom.end + 10),
                })
              }
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
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ChartContainer
            config={{
              cpu: { label: "CPU (%)", color: "#3b82f6" },
              memory: { label: "Memory (MB)", color: "#8b5cf6" },
              network: { label: "Network (KB/s)", color: "#06b6d4" },
              wasm: { label: "WASM (%)", color: "#10b981" },
              webgl: { label: "WebGL (%)", color: "#f59e0b" },
              gpu: { label: "GPU (%)", color: "#ef4444" },
            }}
            className="h-[250px] sm:h-[400px] w-full min-w-[800px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" tickFormatter={(value) => `${value}ms`} stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                  }}
                  iconType="line"
                  formatter={(value, entry) => <span style={{ color: entry.color, fontSize: "12px" }}>{value}</span>}
                />
                <Brush
                  dataKey="time"
                  height={30}
                  stroke="#8884d8"
                  startIndex={Math.floor((timelineZoom.start / 100) * data.length)}
                  endIndex={Math.floor((timelineZoom.end / 100) * data.length)}
                  onChange={(brushData) => {
                    if (brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
                      setTimelineZoom({
                        start: (brushData.startIndex / data.length) * 100,
                        end: (brushData.endIndex / data.length) * 100,
                      });
                    }
                  }}
                />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} dot={false} name="CPU (%)" />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  name="Memory (MB)"
                />
                <Line
                  type="monotone"
                  dataKey="network"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  name="Network (KB/s)"
                />
                <Line type="monotone" dataKey="wasm" stroke="#10b981" strokeWidth={2} dot={false} name="WASM (%)" />
                <Line type="monotone" dataKey="webgl" stroke="#f59e0b" strokeWidth={2} dot={false} name="WebGL (%)" />
                <Line type="monotone" dataKey="gpu" stroke="#ef4444" strokeWidth={2} dot={false} name="GPU (%)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-slate-300">CPU (%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-purple-500"></div>
            <span className="text-slate-300">Memory (MB)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-cyan-500"></div>
            <span className="text-slate-300">Network (KB/s)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span className="text-slate-300">WASM (%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-yellow-500"></div>
            <span className="text-slate-300">WebGL (%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span className="text-slate-300">GPU (%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
