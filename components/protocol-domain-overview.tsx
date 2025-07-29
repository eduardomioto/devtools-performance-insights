import { Zap, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ComplexPerformanceData } from "@/types/profiling-type"

interface ProtocolDomainOverviewProps {
  data: ComplexPerformanceData
}

export function ProtocolDomainOverview({ data }: ProtocolDomainOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-100 text-sm sm:text-base flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Protocol Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.protocols.length > 0 ? (
              data.protocols.map((protocol) => (
                <div
                  key={protocol.protocol}
                  className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className={`text-xs border-slate-600 ${
                        protocol.protocol === "http/3"
                          ? "text-green-400 border-green-600"
                          : protocol.protocol === "http/2"
                            ? "text-blue-400 border-blue-600"
                            : "text-orange-400 border-orange-600"
                      }`}
                    >
                      {protocol.protocol.toUpperCase()}
                    </Badge>
                    <span className="text-xs sm:text-sm text-slate-300">{protocol.requests} requests</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm text-slate-300">
                      {(protocol.totalSize / 1024 / 1024).toFixed(1)}MB
                    </span>
                    <p className="text-xs text-slate-500">{protocol.avgLatency}ms avg</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No protocol data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-100 text-sm sm:text-base flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Top Domains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.domains.length > 0 ? (
              data.domains.slice(0, 4).map((domain) => (
                <div key={domain.domain} className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-300 truncate font-medium">{domain.domain}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{domain.requests} requests</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-500">{(domain.totalSize / 1024 / 1024).toFixed(1)}MB</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs sm:text-sm font-medium ${
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
              <p className="text-slate-400 text-sm">No domain data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
