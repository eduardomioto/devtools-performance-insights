import type {
  ComplexPerformanceData,
  NetworkRequest,
  WasmModule,
  GLBFile,
  DomainInfo,
  ProtocolInfo,
} from "@/types/profiling-type"

// Sample trace events that match Chrome DevTools format - Extended to 45+ seconds
function generateSampleTraceEvents() {
  const events = [
    { name: "navigationStart", ts: 0, dur: 0, cat: "navigation" },
    { name: "domContentLoadedEventEnd", ts: 3200000, dur: 0, cat: "loading" },
    { name: "loadEventEnd", ts: 12500000, dur: 0, cat: "loading" },
    { name: "firstContentfulPaint", ts: 2100000, dur: 0, cat: "loading" },
    { name: "largestContentfulPaint", ts: 5800000, dur: 0, cat: "loading" },
  ]

  // Add multiple large WASM compilation events throughout the timeline
  const wasmModules = [
    { name: "physics-engine.wasm", size: 8500000, startTime: 1500000 },
    { name: "graphics-renderer.wasm", size: 12400000, startTime: 4200000 },
    { name: "audio-processor.wasm", size: 6800000, startTime: 7800000 },
    { name: "ai-inference.wasm", size: 15600000, startTime: 11200000 },
    { name: "compression-lib.wasm", size: 4200000, startTime: 15800000 },
    { name: "crypto-engine.wasm", size: 7200000, startTime: 19400000 },
    { name: "image-processing.wasm", size: 9800000, startTime: 23600000 },
    { name: "video-decoder.wasm", size: 18200000, startTime: 28400000 },
    { name: "ml-models.wasm", size: 22800000, startTime: 33200000 },
    { name: "simulation-core.wasm", size: 11400000, startTime: 38800000 },
  ]

  wasmModules.forEach((module, index) => {
    const compileTime = Math.floor(module.size / 15000) // Realistic compile time based on size
    const instantiateTime = Math.floor(compileTime * 0.3)

    events.push({
      name: "v8.wasm.compiledModule",
      ts: module.startTime,
      dur: compileTime * 1000,
      cat: "wasm",
      args: {
        data: {
          url: `https://cdn.example.com/${module.name}`,
          size: module.size,
        },
      },
    })

    events.push({
      name: "v8.wasm.instantiateModule",
      ts: module.startTime + compileTime * 1000,
      dur: instantiateTime * 1000,
      cat: "wasm",
      args: {
        data: {
          url: `https://cdn.example.com/${module.name}`,
          memoryUsage: module.size * 2, // Memory usage typically 2x file size
        },
      },
    })
  })

  // Add GLB loading events throughout the timeline
  const glbFiles = generateSampleGLBFiles()
  glbFiles.forEach((glb, index) => {
    const startTime = 2000000 + index * 1800000 // Spread GLB loads across timeline
    events.push({
      name: "ResourceSendRequest",
      ts: startTime,
      dur: glb.loadTime * 1000,
      cat: "devtools.timeline",
      args: {
        data: {
          url: `https://models.example.com/${glb.name}`,
          requestMethod: "GET",
          encodedDataLength: glb.size,
          mimeType: "model/gltf-binary",
        },
      },
    })
  })

  // Add CPU intensive tasks throughout the timeline
  for (let i = 0; i < 25; i++) {
    const startTime = i * 1800000 + Math.random() * 1000000
    events.push({
      name: "EvaluateScript",
      ts: startTime,
      dur: Math.floor(Math.random() * 500000) + 100000,
      cat: "devtools.timeline",
    })
  }

  // Add memory pressure events
  for (let i = 0; i < 15; i++) {
    const startTime = i * 3000000 + Math.random() * 1000000
    events.push({
      name: "MinorGC",
      ts: startTime,
      dur: Math.floor(Math.random() * 50000) + 10000,
      cat: "v8",
    })
  }

  // Add WebGL context creation and operations
  for (let i = 0; i < 8; i++) {
    const startTime = 5000000 + i * 5000000
    events.push({
      name: "WebGLRenderingContext.drawArrays",
      ts: startTime,
      dur: Math.floor(Math.random() * 20000) + 5000,
      cat: "gpu",
    })
  }

  return events.sort((a, b) => a.ts - b.ts)
}

// Generate realistic network requests with proper sizes - Increased to 500+ requests
function generateSampleNetworkRequests(): NetworkRequest[] {
  const domains = [
    "app.example.com",
    "cdn.example.com",
    "api.example.com",
    "assets.example.com",
    "models.example.com",
    "textures.example.com",
    "audio.example.com",
    "fonts.example.com",
    "analytics.example.com",
    "static.example.com",
  ]
  const protocols = ["http/1.1", "http/2", "http/3"]
  const types = ["document", "script", "stylesheet", "image", "font", "xhr", "fetch", "wasm", "other", "media"]

  return Array.from({ length: 547 }, (_, i) => {
    const domain = domains[i % domains.length]
    const type = types[Math.floor(Math.random() * types.length)]

    // Generate realistic file sizes based on type
    let size = 1000
    switch (type) {
      case "wasm":
        size = Math.floor(Math.random() * 20000000) + 2000000 // 2MB-22MB
        break
      case "script":
        size = Math.floor(Math.random() * 2000000) + 50000 // 50KB-2MB
        break
      case "stylesheet":
        size = Math.floor(Math.random() * 500000) + 10000 // 10KB-500KB
        break
      case "image":
        size = Math.floor(Math.random() * 5000000) + 100000 // 100KB-5MB
        break
      case "media":
        size = Math.floor(Math.random() * 50000000) + 5000000 // 5MB-55MB
        break
      case "document":
        size = Math.floor(Math.random() * 200000) + 10000 // 10KB-200KB
        break
      case "font":
        size = Math.floor(Math.random() * 500000) + 50000 // 50KB-500KB
        break
      default:
        size = Math.floor(Math.random() * 1000000) + 5000 // 5KB-1MB
    }

    const duration =
      type === "wasm" || type === "media"
        ? Math.floor(Math.random() * 8000) + 1000
        : // 1-9 seconds for large files
          Math.floor(Math.random() * 2000) + 50 // 50ms-2s for others

    return {
      url: `https://${domain}/resource-${i}.${getFileExtension(type)}`,
      method: "GET",
      status: Math.random() > 0.97 ? (Math.random() > 0.5 ? 404 : 500) : 200,
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      domain,
      size,
      duration,
      type,
      priority: type === "wasm" || type === "document" ? "high" : Math.random() > 0.6 ? "medium" : "low",
    }
  })
}

function getFileExtension(type: string): string {
  switch (type) {
    case "wasm":
      return "wasm"
    case "script":
      return "js"
    case "stylesheet":
      return "css"
    case "image":
      return Math.random() > 0.5 ? "jpg" : "png"
    case "font":
      return Math.random() > 0.5 ? "woff2" : "ttf"
    case "media":
      return Math.random() > 0.5 ? "mp4" : "webm"
    case "document":
      return "html"
    default:
      return "bin"
  }
}

// Generate large WASM modules with realistic sizes
function generateSampleWasmModules(): WasmModule[] {
  return [
    {
      name: "physics-engine.wasm",
      size: 8500000, // 8.5MB
      loadTime: 1200,
      compileTime: 580,
      instantiateTime: 180,
      memoryUsage: 33554432, // 32MB
    },
    {
      name: "graphics-renderer.wasm",
      size: 12400000, // 12.4MB
      loadTime: 1800,
      compileTime: 820,
      instantiateTime: 250,
      memoryUsage: 50331648, // 48MB
    },
    {
      name: "audio-processor.wasm",
      size: 6800000, // 6.8MB
      loadTime: 950,
      compileTime: 450,
      instantiateTime: 140,
      memoryUsage: 25165824, // 24MB
    },
    {
      name: "ai-inference.wasm",
      size: 15600000, // 15.6MB
      loadTime: 2400,
      compileTime: 1040,
      instantiateTime: 320,
      memoryUsage: 67108864, // 64MB
    },
    {
      name: "compression-lib.wasm",
      size: 4200000, // 4.2MB
      loadTime: 680,
      compileTime: 280,
      instantiateTime: 85,
      memoryUsage: 16777216, // 16MB
    },
    {
      name: "crypto-engine.wasm",
      size: 7200000, // 7.2MB
      loadTime: 1100,
      compileTime: 480,
      instantiateTime: 150,
      memoryUsage: 29360128, // 28MB
    },
    {
      name: "image-processing.wasm",
      size: 9800000, // 9.8MB
      loadTime: 1500,
      compileTime: 650,
      instantiateTime: 200,
      memoryUsage: 41943040, // 40MB
    },
    {
      name: "video-decoder.wasm",
      size: 18200000, // 18.2MB
      loadTime: 2800,
      compileTime: 1200,
      instantiateTime: 380,
      memoryUsage: 83886080, // 80MB
    },
    {
      name: "ml-models.wasm",
      size: 22800000, // 22.8MB
      loadTime: 3500,
      compileTime: 1520,
      instantiateTime: 480,
      memoryUsage: 104857600, // 100MB
    },
    {
      name: "simulation-core.wasm",
      size: 11400000, // 11.4MB
      loadTime: 1750,
      compileTime: 760,
      instantiateTime: 240,
      memoryUsage: 54525952, // 52MB
    },
  ]
}

// Generate dozens of GLB files with varying complexities
function generateSampleGLBFiles(): GLBFile[] {
  const glbFiles: GLBFile[] = []

  // Large environment GLBs
  const environments = [
    "main-scene",
    "forest-environment",
    "city-landscape",
    "desert-terrain",
    "ocean-world",
    "space-station",
    "underground-cave",
    "mountain-range",
  ]

  environments.forEach((name, index) => {
    glbFiles.push({
      name: `${name}.glb`,
      size: Math.floor(Math.random() * 35000000) + 15000000, // 15-50MB
      loadTime: Math.floor(Math.random() * 4000) + 2000, // 2-6 seconds
      vertices: Math.floor(Math.random() * 300000) + 100000, // 100k-400k vertices
      textures: Math.floor(Math.random() * 40) + 20, // 20-60 textures
      materials: Math.floor(Math.random() * 35) + 15, // 15-50 materials
    })
  })

  // Character models
  const characters = [
    "hero-character",
    "enemy-soldier",
    "npc-civilian",
    "boss-monster",
    "companion-robot",
    "alien-creature",
    "medieval-knight",
    "space-marine",
    "fantasy-wizard",
    "cyberpunk-hacker",
    "zombie-variant",
    "dragon-beast",
  ]

  characters.forEach((name, index) => {
    glbFiles.push({
      name: `${name}.glb`,
      size: Math.floor(Math.random() * 15000000) + 5000000, // 5-20MB
      loadTime: Math.floor(Math.random() * 2500) + 1000, // 1-3.5 seconds
      vertices: Math.floor(Math.random() * 150000) + 50000, // 50k-200k vertices
      textures: Math.floor(Math.random() * 25) + 10, // 10-35 textures
      materials: Math.floor(Math.random() * 20) + 8, // 8-28 materials
    })
  })

  // Vehicles and props
  const vehicles = [
    "sports-car",
    "military-tank",
    "spaceship",
    "helicopter",
    "motorcycle",
    "truck",
    "submarine",
    "fighter-jet",
    "mech-suit",
    "hover-bike",
  ]

  vehicles.forEach((name, index) => {
    glbFiles.push({
      name: `${name}.glb`,
      size: Math.floor(Math.random() * 12000000) + 3000000, // 3-15MB
      loadTime: Math.floor(Math.random() * 2000) + 800, // 0.8-2.8 seconds
      vertices: Math.floor(Math.random() * 100000) + 30000, // 30k-130k vertices
      textures: Math.floor(Math.random() * 20) + 8, // 8-28 textures
      materials: Math.floor(Math.random() * 15) + 6, // 6-21 materials
    })
  })

  // Weapons and items
  const items = [
    "assault-rifle",
    "energy-sword",
    "magic-staff",
    "shield",
    "bow",
    "pistol",
    "grenade",
    "health-potion",
    "key-card",
    "treasure-chest",
    "crystal",
    "artifact",
    "tool-kit",
    "ammo-box",
    "armor-piece",
  ]

  items.forEach((name, index) => {
    glbFiles.push({
      name: `${name}.glb`,
      size: Math.floor(Math.random() * 5000000) + 500000, // 0.5-5.5MB
      loadTime: Math.floor(Math.random() * 1000) + 200, // 0.2-1.2 seconds
      vertices: Math.floor(Math.random() * 25000) + 5000, // 5k-30k vertices
      textures: Math.floor(Math.random() * 10) + 3, // 3-13 textures
      materials: Math.floor(Math.random() * 8) + 2, // 2-10 materials
    })
  })

  // UI and interface elements
  const uiElements = [
    "hud-elements",
    "menu-background",
    "button-set",
    "icon-collection",
    "loading-spinner",
    "progress-bar",
    "notification-panel",
  ]

  uiElements.forEach((name, index) => {
    glbFiles.push({
      name: `${name}.glb`,
      size: Math.floor(Math.random() * 2000000) + 200000, // 0.2-2.2MB
      loadTime: Math.floor(Math.random() * 500) + 100, // 0.1-0.6 seconds
      vertices: Math.floor(Math.random() * 10000) + 1000, // 1k-11k vertices
      textures: Math.floor(Math.random() * 8) + 2, // 2-10 textures
      materials: Math.floor(Math.random() * 6) + 1, // 1-7 materials
    })
  })

  return glbFiles
}

function generateSampleDomainInfo(): DomainInfo[] {
  return [
    {
      domain: "app.example.com",
      requests: 78,
      totalSize: 12400000,
      avgResponseTime: 180,
      protocols: ["http/2", "http/3"],
    },
    {
      domain: "cdn.example.com",
      requests: 156,
      totalSize: 89600000,
      avgResponseTime: 95,
      protocols: ["http/2", "http/3"],
    },
    {
      domain: "api.example.com",
      requests: 89,
      totalSize: 4200000,
      avgResponseTime: 220,
      protocols: ["http/2"],
    },
    {
      domain: "assets.example.com",
      requests: 67,
      totalSize: 45800000,
      avgResponseTime: 340,
      protocols: ["http/2", "http/3"],
    },
    {
      domain: "models.example.com",
      requests: 52,
      totalSize: 248900000,
      avgResponseTime: 2800,
      protocols: ["http/3"],
    },
    {
      domain: "textures.example.com",
      requests: 43,
      totalSize: 156700000,
      avgResponseTime: 1200,
      protocols: ["http/2", "http/3"],
    },
    {
      domain: "audio.example.com",
      requests: 28,
      totalSize: 89400000,
      avgResponseTime: 1800,
      protocols: ["http/3"],
    },
    {
      domain: "fonts.example.com",
      requests: 15,
      totalSize: 2800000,
      avgResponseTime: 150,
      protocols: ["http/2", "http/3"],
    },
    {
      domain: "analytics.example.com",
      requests: 12,
      totalSize: 450000,
      avgResponseTime: 280,
      protocols: ["http/2"],
    },
    {
      domain: "static.example.com",
      requests: 7,
      totalSize: 1200000,
      avgResponseTime: 120,
      protocols: ["http/2"],
    },
  ]
}

function generateSampleProtocolInfo(): ProtocolInfo[] {
  return [
    {
      protocol: "http/3",
      requests: 298,
      totalSize: 456700000,
      avgLatency: 85,
      domains: [
        "cdn.example.com",
        "models.example.com",
        "assets.example.com",
        "textures.example.com",
        "audio.example.com",
        "fonts.example.com",
      ],
    },
    {
      protocol: "http/2",
      requests: 234,
      totalSize: 89400000,
      avgLatency: 120,
      domains: [
        "app.example.com",
        "api.example.com",
        "cdn.example.com",
        "assets.example.com",
        "analytics.example.com",
        "static.example.com",
      ],
    },
    {
      protocol: "http/1.1",
      requests: 15,
      totalSize: 2100000,
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
      "timeline-duration": 45000000, // 45 seconds in microseconds
    },
    categories: ["loading", "navigation", "scripting", "rendering", "painting", "wasm", "webgl", "gpu", "v8"],
    networkRequests: generateSampleNetworkRequests(),
    wasmModules: generateSampleWasmModules(),
    glbFiles: generateSampleGLBFiles(),
    domains: generateSampleDomainInfo(),
    protocols: generateSampleProtocolInfo(),
  }
}

// Export types for use in other files
export type { ComplexPerformanceData, NetworkRequest, WasmModule, GLBFile, DomainInfo, ProtocolInfo }
