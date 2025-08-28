import { Zap, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ComplexPerformanceData } from "@/types/profiling-type";

interface ProtocolDomainOverviewProps {
  data: ComplexPerformanceData;
}

export function ProtocolDomainOverview({ data }: ProtocolDomainOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-slate-100 sm:text-base">
            <Zap className="h-4 w-4" />
            Protocol Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.protocols.length > 0 ? (
              data.protocols.map((protocol) => (
                <div
                  key={protocol.protocol}
                  className="flex items-center justify-between rounded-lg bg-slate-700/30 p-2"
                >
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className={`border-slate-600 text-xs ${
                        protocol.protocol === "http/3"
                          ? "border-green-600 text-green-400"
                          : protocol.protocol === "http/2"
                            ? "border-blue-600 text-blue-400"
                            : "border-orange-600 text-orange-400"
                      }`}
                    >
                      {protocol.protocol.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-300 sm:text-sm">{protocol.requests} requests</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-300 sm:text-sm">
                      {(protocol.totalSize / 1024 / 1024).toFixed(1)}MB
                    </span>
                    <p className="text-xs text-slate-500">{protocol.avgLatency}ms avg</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No protocol data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-slate-100 sm:text-base">
            <Globe className="h-4 w-4" />
            Top Domains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.domains.length > 0 ? (
              data.domains.slice(0, 4).map((domain) => (
                <div key={domain.domain} className="flex items-center justify-between rounded-lg bg-slate-700/30 p-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-300 sm:text-sm">{domain.domain}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-slate-500">{domain.requests} requests</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-500">{(domain.totalSize / 1024 / 1024).toFixed(1)}MB</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-medium sm:text-sm ${
                        domain.avgResponseTime > 1000
                          ? "text-red-400"
                          : domain.avgResponseTime > 500
                            ? "text-yellow-400"
                            : "text-green-400"
                      }`}
                    >
                      {domain.avgResponseTime}ms
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No domain data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
