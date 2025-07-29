import type {
  ComplexPerformanceData,
  NetworkRequest,
  WasmModule,
  GLBFile,
  DomainInfo,
  ProtocolInfo,
} from "@/types/profiling-type"

export function processRealPerformanceData(rawData: any): ComplexPerformanceData {
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
function extractNetworkRequestsFromTraceEvents(traceEvents: any[]): NetworkRequest[] {
  const requestMap = new Map()
  const resourceSizeMap = new Map()

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
            const chunkSize = data.encodedDataLength || data.dataLength || 0
            if (chunkSize > 0) {
              request.size += chunkSize
            }
          }

          if (event.name === "ResourceFinish") {
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
            request.duration = Math.max(request.duration, event.dur / 1000)
          }
        } catch (e) {
          console.warn("Invalid URL in trace event:", data.url, e)
        }
      }
    }
  })

  const extractedRequests = Array.from(requestMap.values())
  console.log(`Extracted ${extractedRequests.length} unique network requests`)

  return extractedRequests
}

// ENHANCED WASM MODULE EXTRACTION
function extractWasmModulesFromTraceEvents(traceEvents: any[]): WasmModule[] {
  const moduleMap = new Map()
  const wasmSizeMap = new Map()

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
        data.url || data.name || args.url || args.filename || args.scriptName || `wasm-module-${event.ts || Date.now()}`

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

  const extractedModules = Array.from(moduleMap.values()).filter((module) => module.size > 0 || module.compileTime > 0)

  console.log(`Extracted ${extractedModules.length} WASM modules`)
  return extractedModules
}

// ENHANCED GLB FILE EXTRACTION
function extractGLBFilesFromTraceEvents(traceEvents: any[]): GLBFile[] {
  const fileMap = new Map()
  const glbSizeMap = new Map()

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
        file.vertices = Math.floor((file.size / 1024 / 1024) * 10000)
      }
      if (file.textures === 0 && file.size > 0) {
        file.textures = Math.max(1, Math.floor(file.size / (1024 * 1024)))
      }
      if (file.materials === 0 && file.textures > 0) {
        file.materials = Math.max(1, Math.floor(file.textures / 2))
      }
    }
  })

  const extractedFiles = Array.from(fileMap.values()).filter((file) => file.size > 0)
  console.log(`Extracted ${extractedFiles.length} GLB/GLTF files`)

  return extractedFiles
}

function generateDomainInfoFromRealRequests(requests: NetworkRequest[]): DomainInfo[] {
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

function generateProtocolInfoFromRealRequests(requests: NetworkRequest[]): ProtocolInfo[] {
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
