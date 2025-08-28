"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface WasmPerformanceChartProps {
  data: any[];
}

export function WasmPerformanceChart({ data }: WasmPerformanceChartProps) {
  const [wasmZoom, setWasmZoom] = useState(1);
  const resetWasmZoom = () => setWasmZoom(1);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-sm text-slate-100 sm:text-base">WASM Module Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-slate-400">No WASM data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-700 bg-slate-800/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm text-slate-100 sm:text-base">WASM Module Performance</CardTitle>
            <CardDescription className="text-xs text-slate-400 sm:text-sm">
              Load, compile, and instantiate times
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWasmZoom(Math.min(3, wasmZoom * 1.2))}
              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWasmZoom(Math.max(0.5, wasmZoom / 1.2))}
              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetWasmZoom}
              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div style={{ width: `${100 * wasmZoom}%` }}>
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
        </div>
      </CardContent>
    </Card>
  );
}
