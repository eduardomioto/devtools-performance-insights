"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Legend, // Add this import
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface AdvancedPerformanceChartsProps {
  data: any;
}

export default function AdvancedPerformanceCharts({
  data,
}: AdvancedPerformanceChartsProps) {
  // Generate advanced timeline data with WASM and GLB events
  const generateTimelineData = () => {
    // Create timeline data points based on actual performance data
    const timelinePoints = [];

    for (let time = 0; time <= 3000; time += 200) {
      const point = {
        time,
        cpu: Math.max(0, 20 + Math.sin(time / 500) * 30 + Math.random() * 20),
        memory: Math.max(0, 50 + (time / 3000) * 40 + Math.random() * 10),
        network: Math.max(0, 30 - (time / 3000) * 25 + Math.random() * 15),
        wasm:
          time > 1000 && time < 1800
            ? Math.max(0, 60 + Math.random() * 30)
            : Math.random() * 5,
        webgl:
          time > 1600 && time < 2400
            ? Math.max(0, 40 + Math.random() * 35)
            : Math.random() * 5,
        gpu:
          time > 1600
            ? Math.max(0, 30 + ((time - 1600) / 1400) * 50 + Math.random() * 20)
            : Math.random() * 10,
      };
      timelinePoints.push(point);
    }

    return timelinePoints;
  };

  const timelineData = generateTimelineData();

  // Protocol performance comparison
  const protocolData = data.protocols.map((protocol: any) => ({
    protocol: protocol.protocol,
    requests: protocol.requests,
    avgLatency: protocol.avgLatency,
    totalSize: protocol.totalSize / 1024, // Convert to KB
    efficiency: protocol.totalSize / protocol.avgLatency / 1000, // KB per ms
  }));

  // WASM performance metrics
  const wasmData = data.wasmModules.map((module: any, index: number) => ({
    name: module.name.replace(".wasm", ""),
    size: module.size / 1024, // KB
    loadTime: module.loadTime,
    compileTime: module.compileTime,
    instantiateTime: module.instantiateTime,
    totalTime: module.loadTime + module.compileTime + module.instantiateTime,
    memoryMB: module.memoryUsage / 1024 / 1024,
  }));

  // GLB file analysis
  const glbData = data.glbFiles.map((file: any) => ({
    name: file.name.replace(".glb", ""),
    sizeMB: file.size / 1024 / 1024,
    loadTime: file.loadTime,
    vertices: file.vertices,
    textures: file.textures,
    materials: file.materials,
    complexity: file.vertices / 1000 + file.textures * 2 + file.materials * 3,
  }));

  // Request distribution by domain
  const domainRequestData = data.domains.map((domain: any) => ({
    domain: domain.domain.replace(".example.com", ""),
    requests: domain.requests,
    sizeMB: domain.totalSize / 1024 / 1024,
    avgResponse: domain.avgResponseTime,
  }));

  // Network waterfall simulation
  const networkWaterfallData = data.networkRequests
    .slice(0, 20)
    .map((req: any, index: number) => ({
      id: index,
      name: req.url.split("/").pop()?.substring(0, 15) + "...",
      start: index * 50 + Math.random() * 100,
      duration: req.duration,
      size: req.size / 1024,
      protocol: req.protocol,
      type: req.type,
    }));

  return (
    <div className="grid gap-4 sm:gap-6">
      {/* Advanced Performance Timeline */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-100 text-sm sm:text-base">
            Advanced Performance Timeline
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs sm:text-sm">
            CPU, Memory, Network, WASM compilation, WebGL rendering, and GPU
            usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              cpu: { label: "CPU (%)", color: "#3b82f6" },
              memory: { label: "Memory (MB)", color: "#8b5cf6" },
              network: { label: "Network (KB/s)", color: "#06b6d4" },
              wasm: { label: "WASM (%)", color: "#10b981" },
              webgl: { label: "WebGL (%)", color: "#f59e0b" },
              gpu: { label: "GPU (%)", color: "#ef4444" },
            }}
            className="h-[250px] sm:h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(value) => `${value}ms`}
                  stroke="#9ca3af"
                  fontSize={12}
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
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                  }}
                  iconType="line"
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color, fontSize: "12px" }}>
                      {value}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="CPU (%)"
                />
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
                <Line
                  type="monotone"
                  dataKey="wasm"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="WASM (%)"
                />
                <Line
                  type="monotone"
                  dataKey="webgl"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="WebGL (%)"
                />
                <Line
                  type="monotone"
                  dataKey="gpu"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  name="GPU (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          {/* Add this right after the ChartContainer closing tag */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Protocol Performance Comparison */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-slate-100 text-sm sm:text-base">
              Protocol Performance
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              HTTP/1.1 vs HTTP/2 vs HTTP/3 comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                requests: { label: "Requests", color: "#3b82f6" },
                avgLatency: { label: "Avg Latency (ms)", color: "#ef4444" },
              }}
              className="h-[200px] sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={protocolData}>
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
          </CardContent>
        </Card>

        {/* WASM Module Performance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-slate-100 text-sm sm:text-base">
              WASM Module Performance
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              Load, compile, and instantiate times
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                <BarChart data={wasmData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={80}
                    stroke="#9ca3af"
                    fontSize={10}
                  />
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
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* GLB File Analysis */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-slate-100 text-sm sm:text-base">
              3D Model Complexity
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              GLB file size vs load time and complexity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sizeMB: { label: "Size (MB)", color: "#f59e0b" },
                loadTime: { label: "Load Time (ms)", color: "#ef4444" },
              }}
              className="h-[200px] sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={glbData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="sizeMB"
                    name="Size (MB)"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => `${value.toFixed(1)}MB`}
                  />
                  <YAxis
                    dataKey="loadTime"
                    name="Load Time (ms)"
                    stroke="#9ca3af"
                    fontSize={12}
                  />
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
          </CardContent>
        </Card>

        {/* Domain Request Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-slate-100 text-sm sm:text-base">
              Domain Distribution
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              Requests and data size by domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                requests: { label: "Requests", color: "#06b6d4" },
                sizeMB: { label: "Size (MB)", color: "#8b5cf6" },
              }}
              className="h-[200px] sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainRequestData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="domain"
                    stroke="#9ca3af"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
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
                  <Bar dataKey="requests" fill="#06b6d4" />
                  <Bar dataKey="sizeMB" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Network Waterfall Visualization */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-100 text-sm sm:text-base">
            Network Waterfall (Top 20 Requests)
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs sm:text-sm">
            Request timing and protocol distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {networkWaterfallData.map(
              (
                req: {
                  id: number;
                  name: string;
                  start: number;
                  duration: number;
                  size: number;
                  protocol: string;
                  type: string;
                },
                index: number,
              ) => (
                <div
                  key={req.id}
                  className="flex items-center space-x-2 text-xs"
                >
                  <div className="w-20 truncate text-slate-300">{req.name}</div>
                  <div className="flex-1 bg-slate-700 rounded-full h-4 relative">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (req.duration / 2000) * 100)}%`,
                        marginLeft: `${(req.start / 3000) * 100}%`,
                      }}
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-600 text-slate-300"
                  >
                    {req.protocol}
                  </Badge>
                  <div className="w-16 text-right text-slate-400">
                    {req.duration}ms
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
