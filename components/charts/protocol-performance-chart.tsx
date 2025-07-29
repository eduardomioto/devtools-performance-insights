"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ProtocolPerformanceChartProps {
  data: any[];
}

export function ProtocolPerformanceChart({ data }: ProtocolPerformanceChartProps) {
  const [protocolZoom, setProtocolZoom] = useState(1);

  const resetProtocolZoom = () => setProtocolZoom(1);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-100 text-sm sm:text-base">Protocol Performance</CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              HTTP/1.1 vs HTTP/2 vs HTTP/3 comparison
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProtocolZoom(Math.min(3, protocolZoom * 1.2))}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProtocolZoom(Math.max(0.5, protocolZoom / 1.2))}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetProtocolZoom}
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
              requests: { label: "Requests", color: "#3b82f6" },
              avgLatency: { label: "Avg Latency (ms)", color: "#ef4444" },
            }}
            className="h-[200px] sm:h-[300px]"
            style={{ transform: `scale(${protocolZoom})`, transformOrigin: "top left" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="protocol" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="requests" fill="#3b82f6" />
                <Bar dataKey="avgLatency" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
