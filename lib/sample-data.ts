import type {
  ComplexPerformanceData,
  NetworkRequest,
  WasmModule,
  GLBFile,
  DomainInfo,
  ProtocolInfo,
} from "@/types/profiling-type"

// Sample trace events that match Chrome DevTools format
function generateSampleTraceEvents() {
  return [
    { name: "navigationStart", ts: 0, dur: 0, cat: "navigation" },
    { name: "domContentLoadedEventEnd", ts: 2400000, dur: 0, cat: "loading" },
    { name: "loadEventEnd", ts: 8500000, dur: 0, cat: "loading" },
    { name: "firstContentfulPaint", ts: 1800000, dur: 0, cat: "loading" },
    { name: "largestContentfulPaint", ts: 4200000, dur: 0, cat: "loading" },
    {
      name: "v8.wasm.compiledModule",
      ts: 1000000,
      dur: 500000,
      cat: "wasm",
      args: {
        data: {
          url: "https://cdn.example.com/physics-engine.wasm",
          size: 2400000,
        },
      },
    },
    {
      name: "v8.wasm.instantiateModule",
      ts: 1500000,
      dur: 200000,
      cat: "wasm",
      args: {
        data: {
          url: "https://cdn.example.com/physics-engine.wasm",
          memoryUsage: 16777216,
        },
      },
    },
    {
      name: "ResourceSendRequest",
      ts: 2000000,
      dur: 1500000,
      cat: "devtools.timeline",
      args: {
        data: {
          url: "https://models.example.com/main-scene.glb",
          requestMethod: "GET",
          encodedDataLength: 15600000,
          mimeType: "model/gltf-binary",
        },
      },
    },
  ]
}

// Generate realistic network requests with proper sizes
function generateSampleNetworkRequests(): NetworkRequest[] {
  const domains = ["app.example.com", "cdn.example.com", "api.example.com", "assets.example.com", "models.example.com"]
  const protocols = ["http/1.1", "http/2", "http/3"]
  const types = ["document", "script", "stylesheet", "image", "font", "xhr", "fetch", "wasm", "other"]

  return Array.from({ length: 247 }, (_, i) => {
    const domain = domains[i % domains.length]
    const type = types[Math.floor(Math.random() * types.length)]

    // Generate realistic file sizes based on type
    let size = 1000
    switch (type) {
      case "wasm":
        size = Math.floor(Math.random() * 3000000) + 500000 // 0.5-3.5MB
        break
      case "script":
        size = Math.floor(Math.random() * 500000) + 10000 // 10KB-500KB
        break
      case "stylesheet":
        size = Math.floor(Math.random() * 100000) + 5000 // 5KB-100KB
        break
      case "image":
        size = Math.floor(Math.random() * 2000000) + 50000 // 50KB-2MB
        break
      case "document":
        size = Math.floor(Math.random() * 50000) + 5000 // 5KB-50KB
        break
      default:
        size = Math.floor(Math.random() * 100000) + 1000 // 1KB-100KB
    }

    return {
      url: `https://${domain}/resource-${i}.${type === "wasm" ? "wasm" : type === "script" ? "js" : type === "stylesheet" ? "css" : "html"}`,
      method: "GET",
      status: Math.random() > 0.95 ? 404 : 200,
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      domain,
      size,
      duration: Math.floor(Math.random() * 2000) + 50,
      type,
      priority: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
    }
  })
}

// Generate WASM modules with proper sizes
function generateSampleWasmModules(): WasmModule[] {
  return [
    {
      name: "physics-engine.wasm",
      size: 2400000, // 2.4MB
      loadTime: 450,
      compileTime: 180,
      instantiateTime: 95,
      memoryUsage: 16777216, // 16MB
    },
    {
      name: "image-processor.wasm",
      size: 1800000, // 1.8MB
      loadTime: 320,
      compileTime: 140,
      instantiateTime: 75,
      memoryUsage: 8388608, // 8MB
    },
    {
      name: "crypto-lib.wasm",
      size: 890000, // 890KB
      loadTime: 180,
      compileTime: 85,
      instantiateTime: 45,
      memoryUsage: 4194304, // 4MB
    },
  ]
}

// Generate GLB files with proper sizes
function generateSampleGLBFiles(): GLBFile[] {
  return [
    {
      name: "main-scene.glb",
      size: 15600000, // 15.6MB
      loadTime: 2400,
      vertices: 125000,
      textures: 24,
      materials: 18,
    },
    {
      name: "character-model.glb",
      size: 8900000, // 8.9MB
      loadTime: 1800,
      vertices: 85000,
      textures: 16,
      materials: 12,
    },
    {
      name: "environment.glb",
      size: 22400000, // 22.4MB
      loadTime: 3200,
      vertices: 180000,
      textures: 32,
      materials: 28,
    },
    {
      name: "ui-elements.glb",
      size: 2100000, // 2.1MB
      loadTime: 450,
      vertices: 15000,
      textures: 8,
      materials: 6,
    },
  ]
}

function generateSampleDomainInfo(): DomainInfo[] {
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

function generateSampleProtocolInfo(): ProtocolInfo[] {
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

export function generateComplexSampleData(): ComplexPerformanceData {
  return {
    traceEvents: generateSampleTraceEvents(),
    metadata: {
      "cpu-family": 6,
      "cpu-model": 142,
      "physical-memory": 34359738368,
      "os-name": "Windows",
      "os-version": "11.0.0",
      "chrome-version": "120.0.6099.109",
    },
    categories: ["loading", "navigation", "scripting", "rendering", "painting", "wasm", "webgl"],
    networkRequests: generateSampleNetworkRequests(),
    wasmModules: generateSampleWasmModules(),
    glbFiles: generateSampleGLBFiles(),
    domains: generateSampleDomainInfo(),
    protocols: generateSampleProtocolInfo(),
  }
}

// Export types for use in other files
export type { ComplexPerformanceData, NetworkRequest, WasmModule, GLBFile, DomainInfo, ProtocolInfo }
