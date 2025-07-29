"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import AdvancedPerformanceCharts from "@/components/advanced-performance-charts"
import ComplexIssuesAnalysis from "@/components/complex-issues-analysis"
import AdvancedRecommendations from "@/components/advanced-recommendations"
import ResourceAnalysis from "@/components/resource-analysis"
import ProtocolAnalysis from "@/components/protocol-analysis"
import { getCriticalIssuesCount } from "@/lib/performance-utils"
import type { ComplexPerformanceData } from "@/types/profiling-type"

interface AnalysisTabsProps {
  data: ComplexPerformanceData
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AnalysisTabs({ data, activeTab, onTabChange }: AnalysisTabsProps) {
  const criticalIssuesCount = getCriticalIssuesCount(data)

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <div className="mobile-scroll">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-slate-800/50 border-slate-700 min-w-max lg:min-w-0">
          <TabsTrigger value="overview" className="text-xs sm:text-sm data-[state=active]:bg-slate-700 relative">
            Overview
          </TabsTrigger>
          <TabsTrigger value="resources" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
            Resources
            <Badge variant="secondary" className="ml-1 text-xs bg-slate-600">
              {data.wasmModules.length + data.glbFiles.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="protocols" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
            Protocols
            <Badge variant="secondary" className="ml-1 text-xs bg-slate-600">
              {data.protocols.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="charts" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
            Charts
          </TabsTrigger>
          <TabsTrigger value="issues" className="text-xs sm:text-sm data-[state=active]:bg-slate-700 relative">
            Issues
            {criticalIssuesCount > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {criticalIssuesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
            Optimize
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview">
        <AdvancedPerformanceCharts data={data} />
      </TabsContent>
      <TabsContent value="resources">
        <ResourceAnalysis data={data} />
      </TabsContent>
      <TabsContent value="protocols">
        <ProtocolAnalysis data={data} />
      </TabsContent>
      <TabsContent value="charts">
        <AdvancedPerformanceCharts data={data} />
      </TabsContent>
      <TabsContent value="issues">
        <ComplexIssuesAnalysis data={data} />
      </TabsContent>
      <TabsContent value="recommendations">
        <AdvancedRecommendations data={data} />
      </TabsContent>
    </Tabs>
  )
}
