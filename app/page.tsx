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
import { generateComplexSampleData } from "@/lib/sample-data"
import type {
  ComplexPerformanceData,
  NetworkRequest,
  WasmModule,
  GLBFile,
  DomainInfo,
  ProtocolInfo,
} from "@/types/profiling-type"

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

      // Enhanced validation for Chrome performance profiles
      if (!data.traceEvents && !data.metadata) {
        throw new Error("Invalid Chrome performance profile format")
      }

      // Process the actual uploaded data - NO SAMPLE DATA MIXED IN
      const processedData = processRealPerformanceData(data)
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

    // This is ONLY for demo purposes - generates fake sample data
    setTimeout(() => {
      const complexSampleData = generateComplexSampleData()
      setPerformanceData(complexSampleData)
      setIsLoading(false)
    }, 1500)
  }

  // THIS FUNCTION PROCESSES REAL UPLOADED DATA ONLY
  const processRealPerformanceData = (rawData: any): ComplexPerformanceData => {
    console.log("Processing real Chrome DevTools data:", rawData)

    // Extract trace events from the uploaded file
    const traceEvents = rawData.traceEvents || []
    console.log(`Found ${traceEvents.length} trace events`)

    // Extract metadata from the uploaded file
    const metadata = rawData.metadata || {}

    // Extract categories from actual trace events
    const categories = [...new Set(traceEvents.map((event: any) => event.cat).filter(Boolean))]
    console.log("Categories found:", categories)

    // Process network requests from REAL trace events
    const networkRequests = extractNetworkRequestsFromTraceEvents(traceEvents)
    console.log(`Extracted ${networkRequests.length} network requests`)

    // Process WASM modules from REAL trace events
    const wasmModules = extractWasmModulesFromTraceEvents(traceEvents)
    console.log(`Found ${wasmModules.length} WASM modules`)

    // Process GLB files from REAL trace events
    const glbFiles = extractGLBFilesFromTraceEvents(traceEvents)
    console.log(`Found ${glbFiles.length} GLB files`)

    // Generate domain info from REAL network requests
    const domains = generateDomainInfoFromRealRequests(networkRequests)

    // Generate protocol info from REAL network requests
    const protocols = generateProtocolInfoFromRealRequests(networkRequests)

    return {
      traceEvents,
      metadata,
      categories,
      networkRequests,
      wasmModules,
      glbFiles,
      domains,
      protocols,
    }
  }

  // ENHANCED NETWORK REQUEST EXTRACTION
  const extractNetworkRequestsFromTraceEvents = (traceEvents: any[]): NetworkRequest[] => {
    const requestMap = new Map()
    const resourceSizeMap = new Map() // Track resource sizes separately

    console.log("Extracting network requests from trace events...")

    // First pass: collect all network-related events
    traceEvents.forEach((event) => {
      const args = event.args || {}
      const data = args.data || {}

      // Handle different types of network events
      if (
        event.name === "ResourceSendRequest" ||
        event.name === "ResourceReceiveResponse" ||
        event.name === "ResourceReceivedData" ||
        event.name === "ResourceFinish" ||
        event.name === "ResourceWillSendRequest" ||
        (event.cat?.includes("devtools.timeline") && data.url) ||
        (event.cat?.includes("loading") && data.url)
      ) {
        if (data.url) {
          try {
            const url = new URL(data.url)
            const requestId = data.requestId || event.id || data.url

            // Initialize request if not exists
            if (!requestMap.has(requestId)) {
              const fileExtension = data.url.split(".").pop()?.toLowerCase() || ""
              let resourceType = data.resourceType || data.mimeType || "other"

              // Enhanced type detection
              if (fileExtension === "wasm" || data.mimeType?.includes("wasm")) {
                resourceType = "wasm"
              } else if (
                fileExtension === "glb" ||
                fileExtension === "gltf" ||
                data.mimeType === "model/gltf-binary" ||
                data.mimeType === "model/gltf+json"
              ) {
                resourceType = "glb"
              } else if (fileExtension === "js" || data.mimeType?.includes("javascript")) {
                resourceType = "script"
              } else if (fileExtension === "css" || data.mimeType?.includes("css")) {
                resourceType = "stylesheet"
              } else if (
                ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(fileExtension) ||
                data.mimeType?.startsWith("image/")
              ) {
                resourceType = "image"
              }

              requestMap.set(requestId, {
                url: data.url,
                method: data.requestMethod || "GET",
                status: 200,
                protocol: "http/1.1",
                domain: url.hostname,
                size: 0,
                duration: 0,
                type: resourceType,
                priority: data.priority || "medium",
              })
            }

            const request = requestMap.get(requestId)

            // Update request properties based on event type
            if (event.name === "ResourceSendRequest") {
              request.method = data.requestMethod || request.method
              request.priority = data.priority || request.priority
            }

            if (event.name === "ResourceReceiveResponse") {
              request.status = data.statusCode || request.status
              request.protocol = data.protocol || request.protocol

              // Extract size from response headers and data
              const responseSize =
                data.encodedDataLength ||
                data.decodedBodyLength ||
                data.transferSize ||
                data.resourceSize ||
                data.contentLength ||
                0

              if (responseSize > 0) {
                request.size = Math.max(request.size, responseSize)
                resourceSizeMap.set(requestId, responseSize)
              }
            }

            if (event.name === "ResourceReceivedData") {
              // Accumulate data chunks
              const chunkSize = data.encodedDataLength || data.dataLength || 0
              if (chunkSize > 0) {
                request.size += chunkSize
              }
            }

            if (event.name === "ResourceFinish") {
              // Final size update
              const finalSize =
                data.encodedDataLength ||
                data.decodedBodyLength ||
                data.transferSize ||
                resourceSizeMap.get(requestId) ||
                0

              if (finalSize > 0) {
                request.size = Math.max(request.size, finalSize)
              }
            }

            // Update duration
            if (event.dur) {
              request.duration = Math.max(request.duration, event.dur / 1000) // Convert to ms
            }
          } catch (e) {
            console.warn("Invalid URL in trace event:", data.url, e)
          }
        }
      }
    })

    const extractedRequests = Array.from(requestMap.values())
    console.log(`Extracted ${extractedRequests.length} unique network requests`)

    // Log size distribution for debugging
    const totalSize = extractedRequests.reduce((sum, req) => sum + req.size, 0)
    const sizesByType = extractedRequests.reduce(
      (acc, req) => {
        acc[req.type] = (acc[req.type] || 0) + req.size
        return acc
      },
      {} as Record<string, number>,
    )

    console.log(`Total extracted size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`)
    console.log(
      "Size by type:",
      Object.entries(sizesByType).map(([type, size]) => `${type}: ${(size / 1024).toFixed(1)}KB`),
    )

    return extractedRequests
  }

  // ENHANCED WASM MODULE EXTRACTION
  const extractWasmModulesFromTraceEvents = (traceEvents: any[]): WasmModule[] => {
    const moduleMap = new Map()
    const wasmSizeMap = new Map() // Track WASM sizes from network requests

    console.log("Extracting WASM modules from trace events...")

    // First, collect WASM file sizes from network requests
    traceEvents.forEach((event) => {
      const args = event.args || {}
      const data = args.data || {}

      if (data.url && (data.url.includes(".wasm") || data.mimeType?.includes("wasm"))) {
        const size = data.encodedDataLength || data.decodedBodyLength || data.transferSize || data.resourceSize || 0
        if (size > 0) {
          wasmSizeMap.set(data.url, size)
        }
      }
    })

    // Then process WASM-specific events
    traceEvents.forEach((event) => {
      const args = event.args || {}
      const data = args.data || {}

      if (
        event.name?.toLowerCase().includes("wasm") ||
        event.cat === "wasm" ||
        event.cat === "v8.wasm" ||
        event.name === "v8.wasm.compiledModule" ||
        event.name === "v8.wasm.instantiateModule" ||
        event.name === "v8.wasm.streamFromResponseCallback" ||
        event.name === "wasm.compile" ||
        event.name === "wasm.instantiate" ||
        event.name === "WebAssembly.compile" ||
        event.name === "WebAssembly.instantiate"
      ) {
        const moduleName =
          data.url ||
          data.name ||
          args.url ||
          args.filename ||
          args.scriptName ||
          `wasm-module-${event.ts || Date.now()}`

        if (!moduleMap.has(moduleName)) {
          const fileName = moduleName.split("/").pop() || moduleName
          moduleMap.set(moduleName, {
            name: fileName,
            size: 0,
            loadTime: 0,
            compileTime: 0,
            instantiateTime: 0,
            memoryUsage: 0,
          })
        }

        const module = moduleMap.get(moduleName)
        const durationMs = event.dur ? event.dur / 1000 : 0

        // Extract timing based on event name
        if (event.name?.toLowerCase().includes("compile") || event.name === "v8.wasm.compiledModule") {
          module.compileTime = Math.max(module.compileTime, durationMs)
        } else if (event.name?.toLowerCase().includes("instantiate") || event.name === "v8.wasm.instantiateModule") {
          module.instantiateTime = Math.max(module.instantiateTime, durationMs)
        } else if (event.name?.toLowerCase().includes("stream") || event.name?.toLowerCase().includes("load")) {
          module.loadTime = Math.max(module.loadTime, durationMs)
        }

        // Extract size from multiple sources
        let size = 0
        if (data.url && wasmSizeMap.has(data.url)) {
          size = wasmSizeMap.get(data.url)
        } else {
          size =
            data.size ||
            data.encodedDataLength ||
            data.decodedBodyLength ||
            data.transferSize ||
            data.resourceSize ||
            args.size ||
            args.byteLength ||
            0
        }

        if (size > 0) {
          module.size = Math.max(module.size, size)
        }

        // Extract memory usage
        const memoryUsage =
          data.memoryUsage || data.memory || data.memorySize || args.memoryUsage || args.memory || args.memorySize || 0

        if (memoryUsage > 0) {
          module.memoryUsage = Math.max(module.memoryUsage, memoryUsage)
        }
      }
    })

    const extractedModules = Array.from(moduleMap.values()).filter(
      (module) => module.size > 0 || module.compileTime > 0,
    )
    console.log(`Extracted ${extractedModules.length} WASM modules`)

    // Log detailed WASM information
    extractedModules.forEach((module) => {
      console.log(`WASM Module: ${module.name}`)
      console.log(`  Size: ${(module.size / 1024).toFixed(1)}KB`)
      console.log(`  Compile Time: ${module.compileTime.toFixed(1)}ms`)
      console.log(`  Memory: ${(module.memoryUsage / 1024 / 1024).toFixed(1)}MB`)
    })

    return extractedModules
  }

  // ENHANCED GLB FILE EXTRACTION
  const extractGLBFilesFromTraceEvents = (traceEvents: any[]): GLBFile[] => {
    const fileMap = new Map()
    const glbSizeMap = new Map() // Track GLB sizes from network requests

    console.log("Extracting GLB files from trace events...")

    // First, collect GLB file sizes from network requests
    traceEvents.forEach((event) => {
      const args = event.args || {}
      const data = args.data || {}

      if (
        data.url &&
        (data.url.includes(".glb") ||
          data.url.includes(".gltf") ||
          data.mimeType === "model/gltf-binary" ||
          data.mimeType === "model/gltf+json")
      ) {
        const size = data.encodedDataLength || data.decodedBodyLength || data.transferSize || data.resourceSize || 0
        if (size > 0) {
          glbSizeMap.set(data.url, size)
        }
      }
    })

    // Then process GLB/GLTF-specific events
    traceEvents.forEach((event) => {
      const args = event.args || {}
      const data = args.data || {}

      // Look for 3D model file requests and WebGL events
      if (
        (data.url &&
          (data.url.includes(".glb") ||
            data.url.includes(".gltf") ||
            data.mimeType === "model/gltf-binary" ||
            data.mimeType === "model/gltf+json")) ||
        event.name?.toLowerCase().includes("gltf") ||
        event.name?.toLowerCase().includes("glb") ||
        (event.cat === "loading" && data.mimeType?.includes("model/"))
      ) {
        const fileName = data.url ? data.url.split("/").pop() : `model-${event.ts || Date.now()}`

        if (!fileMap.has(fileName)) {
          fileMap.set(fileName, {
            name: fileName,
            size: 0,
            loadTime: 0,
            vertices: 0,
            textures: 0,
            materials: 0,
          })
        }

        const file = fileMap.get(fileName)

        // Update load time
        if (event.dur) {
          file.loadTime = Math.max(file.loadTime, event.dur / 1000)
        }

        // Extract size from multiple sources
        let size = 0
        if (data.url && glbSizeMap.has(data.url)) {
          size = glbSizeMap.get(data.url)
        } else {
          size =
            data.encodedDataLength ||
            data.decodedBodyLength ||
            data.transferSize ||
            data.resourceSize ||
            data.size ||
            args.size ||
            0
        }

        if (size > 0) {
          file.size = Math.max(file.size, size)
        }

        // Extract 3D model specific data if available
        if (data.vertices || args.vertices) {
          file.vertices = Math.max(file.vertices, data.vertices || args.vertices)
        }
        if (data.textures || args.textures) {
          file.textures = Math.max(file.textures, data.textures || args.textures)
        }
        if (data.materials || args.materials) {
          file.materials = Math.max(file.materials, data.materials || args.materials)
        }

        // Estimate complexity metrics if not available
        if (file.vertices === 0 && file.size > 0) {
          // Rough estimation: 1MB ≈ 10k vertices
          file.vertices = Math.floor((file.size / 1024 / 1024) * 10000)
        }
        if (file.textures === 0 && file.size > 0) {
          // Rough estimation based on file size
          file.textures = Math.max(1, Math.floor(file.size / (1024 * 1024))) // 1 texture per MB
        }
        if (file.materials === 0 && file.textures > 0) {
          // Usually fewer materials than textures
          file.materials = Math.max(1, Math.floor(file.textures / 2))
        }
      }
    })

    const extractedFiles = Array.from(fileMap.values()).filter((file) => file.size > 0)
    console.log(`Extracted ${extractedFiles.length} GLB/GLTF files`)

    // Log detailed GLB information
    extractedFiles.forEach((file) => {
      console.log(`GLB File: ${file.name}`)
      console.log(`  Size: ${(file.size / 1024 / 1024).toFixed(1)}MB`)
      console.log(`  Load Time: ${file.loadTime.toFixed(1)}ms`)
      console.log(`  Vertices: ${file.vertices.toLocaleString()}`)
    })

    return extractedFiles
  }

  const generateDomainInfoFromRealRequests = (requests: NetworkRequest[]): DomainInfo[] => {
    const domainMap = new Map()

    requests.forEach((request) => {
      if (!domainMap.has(request.domain)) {
        domainMap.set(request.domain, {
          domain: request.domain,
          requests: 0,
          totalSize: 0,
          totalResponseTime: 0,
          protocols: new Set(),
        })
      }

      const domain = domainMap.get(request.domain)
      domain.requests++
      domain.totalSize += request.size
      domain.totalResponseTime += request.duration
      domain.protocols.add(request.protocol)
    })

    // Calculate average response times and convert protocols set to array
    return Array.from(domainMap.values()).map((domain) => ({
      domain: domain.domain,
      requests: domain.requests,
      totalSize: domain.totalSize,
      avgResponseTime: domain.requests > 0 ? Math.round(domain.totalResponseTime / domain.requests) : 0,
      protocols: Array.from(domain.protocols),
    }))
  }

  const generateProtocolInfoFromRealRequests = (requests: NetworkRequest[]): ProtocolInfo[] => {
    const protocolMap = new Map()

    requests.forEach((request) => {
      if (!protocolMap.has(request.protocol)) {
        protocolMap.set(request.protocol, {
          protocol: request.protocol,
          requests: 0,
          totalSize: 0,
          totalLatency: 0,
          domains: new Set(),
        })
      }

      const protocol = protocolMap.get(request.protocol)
      protocol.requests++
      protocol.totalSize += request.size
      protocol.totalLatency += request.duration
      protocol.domains.add(request.domain)
    })

    // Calculate average latencies and convert domains set to array
    return Array.from(protocolMap.values()).map((protocol) => ({
      protocol: protocol.protocol,
      requests: protocol.requests,
      totalSize: protocol.totalSize,
      avgLatency: protocol.requests > 0 ? Math.round(protocol.totalLatency / protocol.requests) : 0,
      domains: Array.from(protocol.domains),
    }))
  }

  const getPerformanceScore = () => {
    if (!performanceData) return 0

    // Calculate score based on actual data
    let score = 100

    // Penalize for slow WASM compilation
    const wasmPenalty = performanceData.wasmModules.reduce((acc, mod) => acc + (mod.compileTime > 100 ? 5 : 0), 0)

    // Penalize for large GLB files
    const glbPenalty = performanceData.glbFiles.reduce((acc, file) => acc + (file.size > 1000000 ? 10 : 0), 0)

    // Penalize for too many requests
    const requestsPenalty = performanceData.networkRequests.length > 100 ? 15 : 0

    // Penalize for slow network requests
    const slowRequestsPenalty = performanceData.networkRequests.filter((req) => req.duration > 1000).length * 2

    score = Math.max(0, score - wasmPenalty - glbPenalty - requestsPenalty - slowRequestsPenalty)
    return Math.round(score)
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
      performanceData.networkRequests.filter((r) => r.duration > 2000).length +
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
                      <p className="text-sm text-slate-400">Processing performance data...</p>
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
                      {performanceData.protocols.length > 0 ? (
                        performanceData.protocols.map((protocol) => (
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
                                {(protocol.totalSize / 1024 / 1024).toFixed(1)}
                                MB
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
                      {performanceData.domains.length > 0 ? (
                        performanceData.domains.slice(0, 4).map((domain) => (
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
                                  {(domain.totalSize / 1024 / 1024).toFixed(1)}
                                  MB
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
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm">No domain data available</p>
                      )}
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
