"use client"

import { useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DashboardHeader } from "@/components/dashboard-header"
import { UploadSection } from "@/components/upload-section"
import { PerformanceStats } from "@/components/performance-stats"
import { CriticalIssuesAlert } from "@/components/critical-issues-alert"
import { ProtocolDomainOverview } from "@/components/protocol-domain-overview"
import { AnalysisTabs } from "@/components/analysis-tabs"
import { ResetSection } from "@/components/reset-section"
import { usePerformanceData } from "@/hooks/use-performance-data"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { performanceData, isLoading, error, uploadProgress, handleFileUpload, handleComplexSampleData, resetData } =
    usePerformanceData()

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <DashboardHeader performanceData={performanceData} />

          {!performanceData && (
            <UploadSection
              isLoading={isLoading}
              error={error}
              uploadProgress={uploadProgress}
              onFileUpload={handleFileUpload}
              onLoadSample={handleComplexSampleData}
            />
          )}

          {performanceData && (
            <div className="space-y-4 sm:space-y-6">
              <PerformanceStats data={performanceData} />
              <CriticalIssuesAlert data={performanceData} onViewDetails={() => setActiveTab("issues")} />
              <ProtocolDomainOverview data={performanceData} />
              <AnalysisTabs data={performanceData} activeTab={activeTab} onTabChange={setActiveTab} />
              <ResetSection requestCount={performanceData.networkRequests.length} onReset={resetData} />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
