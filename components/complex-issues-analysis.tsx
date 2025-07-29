"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, Zap, Database, Cpu, ImageIcon, Code, Wifi, Globe } from "lucide-react"

interface ComplexIssuesAnalysisProps {
  data: any
}

interface ComplexIssue {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  category: string
  description: string
  impact: string
  metric: string
  icon: React.ReactNode
  affectedResources: number
  estimatedSavings: string
}

export default function ComplexIssuesAnalysis({ data }: ComplexIssuesAnalysisProps) {
  const complexIssues: ComplexIssue[] = [
    {
      id: "1",
      title: "WASM Compilation Bottleneck",
      severity: "critical",
      category: "WebAssembly",
      description: "Large WASM modules causing significant compilation delays on main thread",
      impact: "Blocks main thread for 180ms+ during compilation phase",
      metric: `${data.wasmModules.filter((m: any) => m.compileTime > 100).length} modules affected`,
      icon: <Cpu className="w-4 h-4" />,
      affectedResources: data.wasmModules.length,
      estimatedSavings: "~400ms FCP improvement",
    },
    {
      id: "2",
      title: "Massive 3D Model Loading",
      severity: "critical",
      category: "3D Graphics",
      description: "GLB files exceeding 20MB causing memory pressure and long load times",
      impact: "Increases LCP by 2.8s and causes memory spikes up to 95MB",
      metric: `${data.glbFiles.filter((f: any) => f.size > 20000000).length} large models`,
      icon: <ImageIcon className="w-4 h-4" />,
      affectedResources: data.glbFiles.length,
      estimatedSavings: "~2.2s LCP improvement",
    },
    {
      id: "3",
      title: "HTTP/1.1 Legacy Requests",
      severity: "high",
      category: "Network Protocol",
      description: "Critical resources still using HTTP/1.1 with connection limits",
      impact: "Head-of-line blocking and connection queue delays",
      metric: `${data.networkRequests.filter((r: any) => r.protocol === "http/1.1").length} legacy requests`,
      icon: <Wifi className="w-4 h-4" />,
      affectedResources: data.networkRequests.filter((r: any) => r.protocol === "http/1.1").length,
      estimatedSavings: "~300ms network improvement",
    },
    {
      id: "4",
      title: "Request Waterfall Cascade",
      severity: "high",
      category: "Network",
      description: "247 requests creating complex dependency chains and network congestion",
      impact: "Network queue saturation and increased connection overhead",
      metric: `${data.networkRequests.length} total requests`,
      icon: <Globe className="w-4 h-4" />,
      affectedResources: data.networkRequests.length,
      estimatedSavings: "~500ms total load time",
    },
    {
      id: "5",
      title: "Cross-Domain Resource Scatter",
      severity: "high",
      category: "DNS/Connection",
      description: "Resources spread across 5+ domains causing DNS lookup and connection overhead",
      impact: "Additional DNS resolution time and connection establishment delays",
      metric: `${data.domains.length} domains`,
      icon: <Database className="w-4 h-4" />,
      affectedResources: data.domains.length,
      estimatedSavings: "~200ms DNS/connection time",
    },
    {
      id: "6",
      title: "WASM Memory Pressure",
      severity: "medium",
      category: "Memory",
      description: "WASM modules consuming excessive memory (29MB total)",
      impact: "Potential memory pressure on low-end devices",
      metric: `${(data.wasmModules.reduce((acc: number, m: any) => acc + m.memoryUsage, 0) / 1024 / 1024).toFixed(0)}MB memory`,
      icon: <Zap className="w-4 h-4" />,
      affectedResources: data.wasmModules.length,
      estimatedSavings: "~15MB memory reduction",
    },
    {
      id: "7",
      title: "Unoptimized Resource Priorities",
      severity: "medium",
      category: "Resource Loading",
      description: "Critical resources not properly prioritized in loading sequence",
      impact: "Suboptimal loading order affecting perceived performance",
      metric: `${data.networkRequests.filter((r: any) => r.priority === "low").length} low-priority critical resources`,
      icon: <Clock className="w-4 h-4" />,
      affectedResources: data.networkRequests.filter((r: any) => r.priority === "low").length,
      estimatedSavings: "~150ms perceived improvement",
    },
    {
      id: "8",
      title: "3D Model Complexity Overhead",
      severity: "medium",
      category: "WebGL",
      description: "High-polygon models causing GPU bottlenecks and rendering delays",
      impact: "Frame drops and rendering performance issues",
      metric: `${data.glbFiles.reduce((acc: number, f: any) => acc + f.vertices, 0).toLocaleString()} total vertices`,
      icon: <ImageIcon className="w-4 h-4" />,
      affectedResources: data.glbFiles.length,
      estimatedSavings: "~30% rendering performance",
    },
    {
      id: "9",
      title: "Protocol Fragmentation",
      severity: "low",
      category: "HTTP Protocol",
      description: "Mixed protocol usage preventing optimal connection reuse",
      impact: "Suboptimal connection pooling and multiplexing",
      metric: `${data.protocols.length} different protocols`,
      icon: <Code className="w-4 h-4" />,
      affectedResources: data.protocols.length,
      estimatedSavings: "~100ms connection optimization",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getSeverityScore = (severity: string) => {
    switch (severity) {
      case "critical":
        return 100
      case "high":
        return 80
      case "medium":
        return 50
      case "low":
        return 25
      default:
        return 0
    }
  }

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-900/20 border-red-800"
      case "high":
        return "bg-orange-900/20 border-orange-800"
      case "medium":
        return "bg-yellow-900/20 border-yellow-800"
      case "low":
        return "bg-blue-900/20 border-blue-800"
      default:
        return "bg-slate-900/20 border-slate-800"
    }
  }

  const categoryStats = complexIssues.reduce(
    (acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const severityStats = complexIssues.reduce(
    (acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const criticalIssues = complexIssues.filter((i) => i.severity === "critical")
  const highIssues = complexIssues.filter((i) => i.severity === "high")
  const mediumIssues = complexIssues.filter((i) => i.severity === "medium")
  const lowIssues = complexIssues.filter((i) => i.severity === "low")

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Critical Issues Alert */}
      {criticalIssues.length > 0 && (
        <Card className="bg-red-900/20 border-red-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Performance Issues Detected
            </CardTitle>
            <CardDescription className="text-red-300">
              {criticalIssues.length} critical issues requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {criticalIssues.map((issue) => (
                <div key={issue.id} className="bg-red-800/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    {issue.icon}
                    <h4 className="font-medium text-red-200">{issue.title}</h4>
                  </div>
                  <p className="text-red-300 text-sm">{issue.estimatedSavings}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-red-400">{severityStats.critical || 0}</div>
              <div className="text-xs sm:text-sm text-slate-400">Critical Issues</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-400">{severityStats.high || 0}</div>
              <div className="text-xs sm:text-sm text-slate-400">High Priority</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">{severityStats.medium || 0}</div>
              <div className="text-xs sm:text-sm text-slate-400">Medium Priority</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-400">{severityStats.low || 0}</div>
              <div className="text-xs sm:text-sm text-slate-400">Low Priority</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues by Category */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Issues by Category</CardTitle>
          <CardDescription className="text-slate-400">
            Distribution of performance issues across different system components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-slate-100">{category}</span>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {count}
                  </Badge>
                </div>
                <Progress value={(count / complexIssues.length) * 100} className="w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Issues Analysis */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="mobile-scroll">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-slate-800/50 border-slate-700 min-w-max lg:min-w-0">
            <TabsTrigger value="all" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
              All Issues
            </TabsTrigger>
            <TabsTrigger value="critical" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
              Critical
            </TabsTrigger>
            <TabsTrigger value="high" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
              High
            </TabsTrigger>
            <TabsTrigger value="medium" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
              Medium
            </TabsTrigger>
            <TabsTrigger value="low" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
              Low
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <IssuesList issues={complexIssues} />
        </TabsContent>

        <TabsContent value="critical">
          <IssuesList issues={criticalIssues} />
        </TabsContent>

        <TabsContent value="high">
          <IssuesList issues={highIssues} />
        </TabsContent>

        <TabsContent value="medium">
          <IssuesList issues={mediumIssues} />
        </TabsContent>

        <TabsContent value="low">
          <IssuesList issues={lowIssues} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function IssuesList({ issues }: { issues: ComplexIssue[] }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getSeverityScore = (severity: string) => {
    switch (severity) {
      case "critical":
        return 100
      case "high":
        return 80
      case "medium":
        return 50
      case "low":
        return 25
      default:
        return 0
    }
  }

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-900/20 border-red-800"
      case "high":
        return "bg-orange-900/20 border-orange-800"
      case "medium":
        return "bg-yellow-900/20 border-yellow-800"
      case "low":
        return "bg-blue-900/20 border-blue-800"
      default:
        return "bg-slate-900/20 border-slate-800"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-100">Detailed Issues Analysis</CardTitle>
        <CardDescription className="text-slate-400">
          {issues.length} issues with comprehensive impact assessment and optimization potential
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue.id} className={`border rounded-lg p-4 space-y-3 ${getSeverityBgColor(issue.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  {issue.icon}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-100">{issue.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant={getSeverityColor(issue.severity) as any} className="text-xs">
                        {issue.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {issue.category}
                      </Badge>
                      <span className="text-xs text-slate-400">{issue.metric}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-medium text-slate-100">{issue.estimatedSavings}</div>
                  <Progress value={getSeverityScore(issue.severity)} className="w-20 mt-1" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-300">{issue.description}</p>
                <div
                  className={`rounded p-3 border ${
                    issue.severity === "critical"
                      ? "bg-red-800/20 border-red-700"
                      : issue.severity === "high"
                        ? "bg-orange-800/20 border-orange-700"
                        : issue.severity === "medium"
                          ? "bg-yellow-800/20 border-yellow-700"
                          : "bg-blue-800/20 border-blue-700"
                  }`}
                >
                  <p className="text-sm font-medium mb-1">
                    <strong>Performance Impact:</strong>
                  </p>
                  <p className="text-sm">{issue.impact}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-600">
                <span>Affected Resources: {issue.affectedResources}</span>
                <span>Optimization Potential: {issue.estimatedSavings}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
