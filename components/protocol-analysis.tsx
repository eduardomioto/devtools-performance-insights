"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Wifi,
  Globe,
  Zap,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface ProtocolAnalysisProps {
  data: any;
}

export default function ProtocolAnalysis({ data }: ProtocolAnalysisProps) {
  // Protocol efficiency metrics
  const protocolEfficiency = data.protocols.map((protocol: any) => ({
    protocol: protocol.protocol,
    efficiency: (protocol.totalSize / protocol.avgLatency / 1000).toFixed(2), // KB per ms
    requests: protocol.requests,
    avgLatency: protocol.avgLatency,
    totalSizeMB: (protocol.totalSize / 1024 / 1024).toFixed(1),
    domains: protocol.domains.length,
  }));

  // Domain performance by protocol
  const domainProtocolData = data.domains.map((domain: any) => ({
    domain: domain.domain.replace(".example.com", ""),
    http1: domain.protocols.includes("http/1.1") ? domain.requests * 0.1 : 0,
    http2: domain.protocols.includes("http/2") ? domain.requests * 0.4 : 0,
    http3: domain.protocols.includes("http/3") ? domain.requests * 0.5 : 0,
    totalRequests: domain.requests,
    avgResponse: domain.avgResponseTime,
  }));

  // Connection multiplexing analysis
  const multiplexingData = [
    {
      protocol: "HTTP/1.1",
      maxConnections: 6,
      efficiency: 30,
      color: "#ef4444",
    },
    { protocol: "HTTP/2", maxConnections: 1, efficiency: 85, color: "#3b82f6" },
    { protocol: "HTTP/3", maxConnections: 1, efficiency: 95, color: "#10b981" },
  ];

  // Request priority analysis
  const priorityData = data.networkRequests.reduce((acc: any, req: any) => {
    const key = `${req.protocol}-${req.priority}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const priorityChartData = Object.entries(priorityData).map(([key, count]) => {
    const [protocol, priority] = key.split("-");
    return { protocol, priority, count };
  });
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Protocol Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.protocols.map((protocol: any, index: number) => (
          <Card
            key={protocol.protocol}
            className="bg-slate-800/50 border-slate-700"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-100 flex items-center gap-2 text-sm sm:text-base">
                <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />
                {protocol.protocol.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-400">Requests</p>
                  <p className="text-slate-100 font-bold text-lg">
                    {protocol.requests}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Avg Latency</p>
                  <p className="text-slate-100 font-bold text-lg">
                    {protocol.avgLatency}ms
                  </p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-1">Total Size</p>
                <p className="text-slate-100 font-medium">
                  {(protocol.totalSize / 1024 / 1024).toFixed(1)}MB
                </p>
                <Progress
                  value={
                    (protocol.totalSize /
                      Math.max(
                        ...data.protocols.map((p: any) => p.totalSize),
                      )) *
                    100
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {protocol.domains.slice(0, 3).map((domain: string) => (
                  <Badge
                    key={domain}
                    variant="outline"
                    className="text-xs border-slate-600 text-slate-300"
                  >
                    {domain.replace(".example.com", "")}
                  </Badge>
                ))}
                {protocol.domains.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-600 text-slate-300"
                  >
                    +{protocol.domains.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Protocol Efficiency Comparison */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Protocol Efficiency
            </CardTitle>
            <CardDescription className="text-slate-400">
              Data throughput per latency unit (KB/ms)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                efficiency: { label: "Efficiency (KB/ms)", color: "#3b82f6" },
                avgLatency: { label: "Avg Latency (ms)", color: "#ef4444" },
              }}
              className="h-[200px] sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={protocolEfficiency}>
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
                  <Bar dataKey="efficiency" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Connection Multiplexing */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Connection Multiplexing
            </CardTitle>
            <CardDescription className="text-slate-400">
              Protocol efficiency and connection limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {multiplexingData.map((item) => (
                <div key={item.protocol} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-slate-100">
                        {item.protocol}
                      </span>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-slate-100">
                        {item.efficiency}% efficient
                      </p>
                      <p className="text-slate-400">
                        {item.maxConnections} connection
                        {item.maxConnections > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Progress value={item.efficiency} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Domain Protocol Distribution */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Domain Protocol Distribution
          </CardTitle>
          <CardDescription className="text-slate-400">
            Protocol usage across different domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              http1: { label: "HTTP/1.1", color: "#ef4444" },
              http2: { label: "HTTP/2", color: "#3b82f6" },
              http3: { label: "HTTP/3", color: "#10b981" },
            }}
            className="h-[250px] sm:h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainProtocolData}>
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
                <Bar dataKey="http1" stackId="a" fill="#ef4444" />
                <Bar dataKey="http2" stackId="a" fill="#3b82f6" />
                <Bar dataKey="http3" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Request Priority Analysis */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Request Priority Distribution
            </CardTitle>
            <CardDescription className="text-slate-400">
              Priority levels across protocols
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["high", "medium", "low"].map((priority) => {
                const priorityRequests = data.networkRequests.filter(
                  (req: any) => req.priority === priority,
                );
                const percentage =
                  (priorityRequests.length / data.networkRequests.length) * 100;

                return (
                  <div key={priority} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={`border-slate-600 ${
                            priority === "high"
                              ? "text-red-400"
                              : priority === "medium"
                                ? "text-yellow-400"
                                : "text-green-400"
                          }`}
                        >
                          {priority.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-slate-300">
                          {priorityRequests.length} requests
                        </span>
                      </div>
                      <span className="text-sm text-slate-400">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Protocol Performance Issues */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Protocol Issues
            </CardTitle>
            <CardDescription className="text-slate-400">
              Identified protocol-related performance issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.protocols.some((p: any) => p.protocol === "http/1.1") && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <h4 className="text-red-400 font-medium">
                      HTTP/1.1 Usage Detected
                    </h4>
                  </div>
                  <p className="text-red-200 text-sm">
                    {
                      data.protocols.find((p: any) => p.protocol === "http/1.1")
                        ?.requests
                    }{" "}
                    requests still using HTTP/1.1
                  </p>
                  <p className="text-red-300 text-xs mt-1">
                    Consider upgrading to HTTP/2 or HTTP/3 for better
                    performance
                  </p>
                </div>
              )}

              {data.domains.some((d: any) => d.avgResponseTime > 1000) && (
                <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-yellow-400 font-medium">
                      High Latency Domains
                    </h4>
                  </div>
                  <p className="text-yellow-200 text-sm">
                    {
                      data.domains.filter((d: any) => d.avgResponseTime > 1000)
                        .length
                    }{" "}
                    domains with &gt;1s response time
                  </p>
                  <p className="text-yellow-300 text-xs mt-1">
                    Consider CDN optimization or server location improvements
                  </p>
                </div>
              )}

              {data.networkRequests.length > 100 && (
                <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wifi className="w-4 h-4 text-orange-400" />
                    <h4 className="text-orange-400 font-medium">
                      High Request Count
                    </h4>
                  </div>
                  <p className="text-orange-200 text-sm">
                    {data.networkRequests.length} total requests detected
                  </p>
                  <p className="text-orange-300 text-xs mt-1">
                    Consider request bundling and resource optimization
                  </p>
                </div>
              )}

              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <h4 className="text-blue-400 font-medium">
                    Protocol Recommendations
                  </h4>
                </div>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Migrate remaining HTTP/1.1 requests to HTTP/2+</li>
                  <li>• Implement HTTP/3 for improved performance</li>
                  <li>• Use connection coalescing where possible</li>
                  <li>• Optimize request prioritization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
