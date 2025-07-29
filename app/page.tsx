"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Upload,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
  Globe,
  Database,
  Info,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AdvancedPerformanceCharts from "@/components/advanced-performance-charts"
import ComplexIssuesAnalysis from "@/components/complex-issues-analysis"
import AdvancedRecommendations from "@/components/advanced-recommendations"
import ResourceAnalysis from "@/components/resource-analysis"
import ProtocolAnalysis from "@/components/protocol-analysis"

interface ComplexPerformanceData {
  traceEvents: any[]
  metadata: any
  categories: string[]
  networkRequests: NetworkRequest[]
  wasmModules: WasmModule[]
  glbFiles: GLBFile[]
  domains: DomainInfo[]
  protocols: ProtocolInfo[]
}

interface NetworkRequest {
  url: string
  method: string
  status: number
  protocol: string
  domain: string
  size: number
  duration: number
  type: string
  priority: string
}

interface WasmModule {
  name: string
  size: number
  loadTime: number
  compileTime: number
  instantiateTime: number
  memoryUsage: number
}

interface GLBFile {
  name: string
  size: number
  loadTime: number
  vertices: number
  textures: number
  materials: number
}

interface DomainInfo {
  domain: string
  requests: number
  totalSize: number
  avgResponseTime: number
  protocols: string[]
}

interface ProtocolInfo {
  protocol: string
  requests: number
  totalSize: number
  avgLatency: number
  domains: string[]
}

export default function HomePage() {
  const [performanceData, setPerformanceData] = useState<ComplexPerformanceData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const text = await file.text()
      const data = JSON.parse(text)

      // Enhanced validation for complex performance profiles
      if (!data.traceEvents && !data.metadata) {
        throw new Error("Invalid Chrome performance profile format")
      }

      // Process and enhance the data
      const processedData = processComplexPerformanceData(data)
      setPerformanceData(processedData)
      setUploadProgress(100)
    } catch (err) {
      setError("Failed to parse performance profile. Please ensure it's a valid Chrome DevTools performance profile.")
    } finally {
      setIsLoading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleComplexSampleData = () => {
    setIsLoading(true)

    // Simulate loading delay for better UX
    setTimeout(() => {
      const complexSampleData: ComplexPerformanceData = {
        traceEvents: generateComplexTraceEvents(),
        metadata: {
          "cpu-family": 6,
          "cpu-model": 142,
          "physical-memory": 34359738368,
          "os-name": "Windows",
          "os-version": "11.0.0",
          "chrome-version": "120.0.6099.109",
        },
        categories: ["loading", "navigation", "scripting", "rendering", "painting", "wasm", "webgl"],
        networkRequests: generateNetworkRequests(),
        wasmModules: generateWasmModules(),
        glbFiles: generateGLBFiles(),
        domains: generateDomainInfo(),
        protocols: generateProtocolInfo(),
      }
      setPerformanceData(complexSampleData)
      setIsLoading(false)
    }, 1500)
  }

  const processComplexPerformanceData = (rawData: any): ComplexPerformanceData => {
    // This would contain real parsing logic for complex Chrome profiles
    return {
      ...rawData,
      networkRequests: generateNetworkRequests(),
      wasmModules: generateWasmModules(),
      glbFiles: generateGLBFiles(),
      domains: generateDomainInfo(),
      protocols: generateProtocolInfo(),
    }
  }

  const getPerformanceScore = () => {
    if (!performanceData) return 0
    // Complex scoring algorithm considering WASM, GLB, protocols, etc.
    const wasmPenalty = performanceData.wasmModules.reduce((acc, mod) => acc + (mod.compileTime > 100 ? 5 : 0), 0)
    const glbPenalty = performanceData.glbFiles.reduce((acc, file) => acc + (file.size > 1000000 ? 10 : 0), 0)
    const requestsPenalty = performanceData.networkRequests.length > 100 ? 15 : 0

    return Math.max(0, 100 - wasmPenalty - glbPenalty - requestsPenalty)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 70) return "text-yellow-400"
    if (score >= 50) return "text-orange-400"
    return "text-red-400"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
    if (score >= 70) return <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
    if (score >= 50) return <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
    return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
  }

  const criticalIssuesCount = performanceData
    ? performanceData.wasmModules.filter((m) => m.compileTime > 100).length +
      performanceData.glbFiles.filter((f) => f.size > 20000000).length +
      (performanceData.networkRequests.length > 200 ? 1 : 0)
    : 0

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Enhanced Header with Status */}
          <div className="text-center space-y-2 sm:space-y-4 px-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Devtools Performance Insights
              </h1>
            </div>
            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto">
              Analyze complex Chrome profiles with WASM, GLB files, HTTP/2-3, and multi-domain architectures
            </p>
            {performanceData && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <Info className="w-4 h-4" />
                <span>
                  Profile loaded • {performanceData.networkRequests.length} requests • {performanceData.domains.length}{" "}
                  domains
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Upload Section */}
          {!performanceData && (
            <Card className="max-w-2xl mx-auto bg-slate-800/50 border-slate-700 shadow-xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-slate-100">
                  <Upload className="w-5 h-5" />
                  Upload Performance Profile
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Chrome DevTools performance profile with complex web applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="profile-upload" className="text-slate-200 font-medium">
                    Performance Profile (.json)
                  </Label>
                  <div className="relative">
                    <Input
                      id="profile-upload"
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                      className="bg-slate-700 border-slate-600 text-slate-100 file:bg-slate-600 file:text-slate-100 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>• Export from Chrome DevTools → Performance tab → Export</p>
                    <p>• Supports profiles with WASM, WebGL, and complex network patterns</p>
                    <p>• File size limit: 50MB</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-800 px-2 text-slate-400">Or</span>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <p className="text-sm text-slate-400">Explore with complex sample data</p>
                  <Button
                    variant="outline"
                    onClick={handleComplexSampleData}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                        Loading Sample...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Load Complex Sample
                      </>
                    )}
                  </Button>
                  <div className="text-xs text-slate-500">
                    Includes: 247 requests, 3 WASM modules, 4 GLB files, 5 domains
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {isLoading && (
                  <div className="text-center py-6 space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400">Processing complex performance data...</p>
                      <div className="flex justify-center space-x-1">
                        <Skeleton className="h-2 w-16 bg-slate-700" />
                        <Skeleton className="h-2 w-12 bg-slate-700" />
                        <Skeleton className="h-2 w-20 bg-slate-700" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Enhanced Analysis Dashboard */}
          {performanceData && (
            <div className="space-y-4 sm:space-y-6">
              {/* Enhanced Quick Stats with Tooltips */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-help">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2">
                          {getScoreIcon(getPerformanceScore())}
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-400">Performance Score</p>
                            <p className={`text-lg sm:text-2xl font-bold ${getScoreColor(getPerformanceScore())}`}>
                              {getPerformanceScore()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Overall performance score based on WASM, GLB, and network metrics</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-help">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-400">Network Requests</p>
                            <p className="text-lg sm:text-2xl font-bold text-blue-400">
                              {performanceData.networkRequests.length}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total HTTP requests across all domains and protocols</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-help">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-400">WASM Modules</p>
                            <p className="text-lg sm:text-2xl font-bold text-purple-400">
                              {performanceData.wasmModules.length}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>WebAssembly modules with compilation and execution metrics</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-help">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-400">3D Models</p>
                            <p className="text-lg sm:text-2xl font-bold text-orange-400">
                              {performanceData.glbFiles.length}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>GLB/GLTF 3D model files with complexity analysis</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-help">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-400">Domains</p>
                            <p className="text-lg sm:text-2xl font-bold text-cyan-400">
                              {performanceData.domains.length}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Unique domains with DNS and connection analysis</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-help">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-400">Critical Issues</p>
                            <p className="text-lg sm:text-2xl font-bold text-red-400">{criticalIssuesCount}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>High-impact performance issues requiring immediate attention</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Critical Issues Alert */}
              {criticalIssuesCount > 0 && (
                <Alert className="bg-red-900/20 border-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-200">
                    <strong>{criticalIssuesCount} critical performance issues</strong> detected that may significantly
                    impact user experience.
                    <Button
                      variant="link"
                      className="text-red-300 p-0 ml-2 h-auto"
                      onClick={() => setActiveTab("issues")}
                    >
                      View Details →
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Enhanced Protocol and Domain Overview */}
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
                      {performanceData.protocols.map((protocol) => (
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
                      ))}
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
                      {performanceData.domains.slice(0, 4).map((domain) => (
                        <div
                          key={domain.domain}
                          className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-slate-300 truncate font-medium">{domain.domain}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-500">{domain.requests} requests</span>
                              <span className="text-xs text-slate-500">•</span>
                              <span className="text-xs text-slate-500">
                                {(domain.totalSize / 1024 / 1024).toFixed(1)}MB
                              </span>
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Main Analysis Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <div className="mobile-scroll">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-slate-800/50 border-slate-700 min-w-max lg:min-w-0">
                    <TabsTrigger
                      value="overview"
                      className="text-xs sm:text-sm data-[state=active]:bg-slate-700 relative"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
                      Resources
                      <Badge variant="secondary" className="ml-1 text-xs bg-slate-600">
                        {performanceData.wasmModules.length + performanceData.glbFiles.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="protocols" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
                      Protocols
                      <Badge variant="secondary" className="ml-1 text-xs bg-slate-600">
                        {performanceData.protocols.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="charts" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
                      Charts
                    </TabsTrigger>
                    <TabsTrigger
                      value="issues"
                      className="text-xs sm:text-sm data-[state=active]:bg-slate-700 relative"
                    >
                      Issues
                      {criticalIssuesCount > 0 && (
                        <Badge variant="destructive" className="ml-1 text-xs">
                          {criticalIssuesCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="recommendations"
                      className="text-xs sm:text-sm data-[state=active]:bg-slate-700"
                    >
                      Optimize
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview">
                  <AdvancedPerformanceCharts data={performanceData} />
                </TabsContent>

                <TabsContent value="resources">
                  <ResourceAnalysis data={performanceData} />
                </TabsContent>

                <TabsContent value="protocols">
                  <ProtocolAnalysis data={performanceData} />
                </TabsContent>

                <TabsContent value="charts">
                  <AdvancedPerformanceCharts data={performanceData} />
                </TabsContent>

                <TabsContent value="issues">
                  <ComplexIssuesAnalysis data={performanceData} />
                </TabsContent>

                <TabsContent value="recommendations">
                  <AdvancedRecommendations data={performanceData} />
                </TabsContent>
              </Tabs>

              {/* Enhanced Reset Section */}
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="text-sm text-slate-400">
                      Analysis complete • {performanceData.networkRequests.length} requests processed
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPerformanceData(null)}
                      className="bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Analyze New Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

// Helper functions to generate complex sample data (keeping existing functions)
function generateComplexTraceEvents() {
  return [
    { name: "navigationStart", ts: 0, dur: 0, cat: "navigation" },
    { name: "domContentLoadedEventEnd", ts: 2400000, dur: 0, cat: "loading" },
    { name: "loadEventEnd", ts: 8500000, dur: 0, cat: "loading" },
    { name: "firstContentfulPaint", ts: 1800000, dur: 0, cat: "loading" },
    { name: "largestContentfulPaint", ts: 4200000, dur: 0, cat: "loading" },
    { name: "wasmCompileStart", ts: 1000000, dur: 500000, cat: "wasm" },
    { name: "wasmInstantiateStart", ts: 1500000, dur: 200000, cat: "wasm" },
    { name: "glbLoadStart", ts: 2000000, dur: 1500000, cat: "webgl" },
  ]
}

function generateNetworkRequests(): NetworkRequest[] {
  const domains = ["app.example.com", "cdn.example.com", "api.example.com", "assets.example.com", "models.example.com"]
  const protocols = ["http/1.1", "http/2", "http/3"]
  const types = ["document", "script", "stylesheet", "image", "font", "xhr", "fetch", "wasm", "other"]

  return Array.from({ length: 247 }, (_, i) => ({
    url: `https://${domains[i % domains.length]}/resource-${i}`,
    method: "GET",
    status: Math.random() > 0.95 ? 404 : 200,
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    domain: domains[i % domains.length],
    size: Math.floor(Math.random() * 500000) + 1000,
    duration: Math.floor(Math.random() * 2000) + 50,
    type: types[Math.floor(Math.random() * types.length)],
    priority: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
  }))
}

function generateWasmModules(): WasmModule[] {
  return [
    {
      name: "physics-engine.wasm",
      size: 2400000,
      loadTime: 450,
      compileTime: 180,
      instantiateTime: 95,
      memoryUsage: 16777216,
    },
    {
      name: "image-processor.wasm",
      size: 1800000,
      loadTime: 320,
      compileTime: 140,
      instantiateTime: 75,
      memoryUsage: 8388608,
    },
    {
      name: "crypto-lib.wasm",
      size: 890000,
      loadTime: 180,
      compileTime: 85,
      instantiateTime: 45,
      memoryUsage: 4194304,
    },
  ]
}

function generateGLBFiles(): GLBFile[] {
  return [
    {
      name: "main-scene.glb",
      size: 15600000,
      loadTime: 2400,
      vertices: 125000,
      textures: 24,
      materials: 18,
    },
    {
      name: "character-model.glb",
      size: 8900000,
      loadTime: 1800,
      vertices: 85000,
      textures: 16,
      materials: 12,
    },
    {
      name: "environment.glb",
      size: 22400000,
      loadTime: 3200,
      vertices: 180000,
      textures: 32,
      materials: 28,
    },
    {
      name: "ui-elements.glb",
      size: 2100000,
      loadTime: 450,
      vertices: 15000,
      textures: 8,
      materials: 6,
    },
  ]
}

function generateDomainInfo(): DomainInfo[] {
  return [
    {
      domain: "app.example.com",
      requests: 45,
      totalSize: 2400000,
      avgResponseTime: 180,
      protocols: ["http/2", "http/3"],
    },
    {
      domain: "cdn.example.com",
      requests: 89,
      totalSize: 15600000,
      avgResponseTime: 95,
      protocols: ["http/2", "http/3"],
    },
    {
      domain: "api.example.com",
      requests: 67,
      totalSize: 890000,
      avgResponseTime: 220,
      protocols: ["http/2"],
    },
    {
      domain: "assets.example.com",
      requests: 34,
      totalSize: 8900000,
      avgResponseTime: 340,
      protocols: ["http/2", "http/3"],
    },
    {
      domain: "models.example.com",
      requests: 12,
      totalSize: 48900000,
      avgResponseTime: 2800,
      protocols: ["http/3"],
    },
  ]
}

function generateProtocolInfo(): ProtocolInfo[] {
  return [
    {
      protocol: "http/3",
      requests: 156,
      totalSize: 45600000,
      avgLatency: 85,
      domains: ["cdn.example.com", "models.example.com", "assets.example.com"],
    },
    {
      protocol: "http/2",
      requests: 78,
      totalSize: 12400000,
      avgLatency: 120,
      domains: ["app.example.com", "api.example.com", "cdn.example.com"],
    },
    {
      protocol: "http/1.1",
      requests: 13,
      totalSize: 890000,
      avgLatency: 280,
      domains: ["legacy.example.com"],
    },
  ]
}
