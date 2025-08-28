"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface DomainDistributionChartProps {
  data: any[];
}

export function DomainDistributionChart({ data }: DomainDistributionChartProps) {
  const [domainZoom, setDomainZoom] = useState(1);
  const resetDomainZoom = () => setDomainZoom(1);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-sm text-slate-100 sm:text-base">Domain Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-slate-400">No domain data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-700 bg-slate-800/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm text-slate-100 sm:text-base">Domain Distribution</CardTitle>
            <CardDescription className="text-xs text-slate-400 sm:text-sm">
              Requests and data size by domain
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDomainZoom(Math.min(3, domainZoom * 1.2))}
              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDomainZoom(Math.max(0.5, domainZoom / 1.2))}
              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetDomainZoom}
              className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div style={{ width: `${100 * domainZoom}%` }}>
            <ChartContainer
              config={{
                requests: { label: "Requests", color: "#06b6d4" },
                sizeMB: { label: "Size (MB)", color: "#8b5cf6" },
              }}
              className="h-[200px] sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="domain" stroke="#9ca3af" fontSize={10} angle={-45} textAnchor="end" height={60} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="requests" fill="#06b6d4" />
                  <Bar dataKey="sizeMB" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
