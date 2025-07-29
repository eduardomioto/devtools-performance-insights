// =============================================================================
// SAMPLE DATA GENERATOR FOR DEMO PURPOSES ONLY
// This file contains all the sample/fake data generation functions
// Used only when user clicks "Load Complex Sample" button
// =============================================================================

export interface NetworkRequest {
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

export interface WasmModule {
  name: string
  size: number
  loadTime: number
  compileTime: number
  instantiateTime: number
  memoryUsage: number
}

export interface GLBFile {
  name: string
  size: number
  loadTime: number
  vertices: number
  textures: number
  materials: number
}

export interface DomainInfo {
  domain: string
  requests: number
  totalSize: number
  avgResponseTime: number
  protocols: string[]
}

export interface ProtocolInfo {
  protocol: string
  requests: number
  totalSize: number
  avgLatency: number
  domains: string[]
}

export interface ComplexPerformanceData {
  traceEvents: any[]
  metadata: any
  categories: string[]
  networkRequests: NetworkRequest[]
  wasmModules: WasmModule[]
  glbFiles: GLBFile[]
  domains: DomainInfo[]
  protocols: ProtocolInfo[]
}

// Generate complex sample data for demo purposes
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

function generateSampleTraceEvents() {
  return [
    { name: "navigationStart", ts: 0, dur: 0, cat: "navigation" },
    { name: "domContentLoadedEventEnd", ts: 2400000, dur: 0, cat: "loading" },
    { name: "loadEventEnd", ts: 8500000, dur: 0, cat: "loading" },
    { name: "firstContentfulPaint", ts: 1800000, dur: 0, cat: "loading" },
    { name: "largestContentfulPaint", ts: 4200000, dur: 0, cat: "loading" },
    { name: "wasmCompileStart", ts: 1000000, dur: 500000, cat: "wasm" },
    { name: "wasmInstantiateStart", ts: 1500000, dur: 200000, cat: "wasm" },
    { name: "glbLoadStart", ts: 2000000, dur: 1500000, cat: "webgl" },
    // Add more realistic Chrome DevTools trace events
    {
      name: "ResourceSendRequest",
      ts: 100000,
      dur: 0,
      cat: "devtools.timeline",
      args: {
        data: {
          url: "https://app.example.com/main.js",
          requestId: "1",
          requestMethod: "GET",
          priority: "high",
        },
      },
    },
    {
      name: "ResourceReceiveResponse",
      ts: 150000,
      dur: 0,
      cat: "devtools.timeline",
      args: {
        data: {
          url: "https://app.example.com/main.js",
          requestId: "1",
          statusCode: 200,
          encodedDataLength: 125000,
          protocol: "http/2",
        },
      },
    },
    {
      name: "v8.wasm.compiledModule",
      ts: 1000000,
      dur: 180000,
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
      ts: 1200000,
      dur: 95000,
      cat: "wasm",
      args: {
        data: {
          url: "https://cdn.example.com/physics-engine.wasm",
          memoryUsage: 16777216,
        },
      },
    },
  ]
}

function generateSampleNetworkRequests(): NetworkRequest[] {
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

function generateSampleWasmModules(): WasmModule[] {
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

function generateSampleGLBFiles(): GLBFile[] {
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
