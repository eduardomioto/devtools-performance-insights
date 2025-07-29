"use client";

import { PerformanceTimelineChart } from "@/components/charts/performance-timeline-chart";
import { ProtocolPerformanceChart } from "@/components/charts/protocol-performance-chart";
import { WasmPerformanceChart } from "@/components/charts/wasm-performance-chart";
import { GlbComplexityChart } from "@/components/charts/glb-complexity-chart";
import { DomainDistributionChart } from "@/components/charts/domain-distribution-chart";
import { NetworkWaterfallChart } from "@/components/charts/network-waterfall-chart";

interface AdvancedPerformanceChartsProps {
  data: any;
}

export default function AdvancedPerformanceCharts({ data }: AdvancedPerformanceChartsProps) {
  // Generate advanced timeline data with WASM and GLB events
  const generateTimelineData = () => {
    const timelinePoints = [];

    for (let time = 0; time <= 3000; time += 200) {
      const point = {
        time,
        cpu: Math.max(0, 20 + Math.sin(time / 500) * 30 + Math.random() * 20),
        memory: Math.max(0, 50 + (time / 3000) * 40 + Math.random() * 10),
        network: Math.max(0, 30 - (time / 3000) * 25 + Math.random() * 15),
        wasm: time > 1000 && time < 1800 ? Math.max(0, 60 + Math.random() * 30) : Math.random() * 5,
        webgl: time > 1600 && time < 2400 ? Math.max(0, 40 + Math.random() * 35) : Math.random() * 5,
        gpu: time > 1600 ? Math.max(0, 30 + ((time - 1600) / 1400) * 50 + Math.random() * 20) : Math.random() * 10,
      };
      timelinePoints.push(point);
    }

    return timelinePoints;
  };

  const timelineData = generateTimelineData();

  // Protocol performance comparison
  const protocolData = data.protocols.map((protocol: any) => ({
    protocol: protocol.protocol,
    requests: protocol.requests,
    avgLatency: protocol.avgLatency,
    totalSize: protocol.totalSize / 1024, // Convert to KB
    efficiency: protocol.totalSize / protocol.avgLatency / 1000, // KB per ms
  }));

  // WASM performance metrics
  const wasmData = data.wasmModules.map((module: any) => ({
    name: module.name.replace(".wasm", ""),
    size: module.size / 1024, // KB
    loadTime: module.loadTime,
    compileTime: module.compileTime,
    instantiateTime: module.instantiateTime,
    totalTime: module.loadTime + module.compileTime + module.instantiateTime,
    memoryMB: module.memoryUsage / 1024 / 1024,
  }));

  // GLB file analysis
  const glbData = data.glbFiles.map((file: any) => ({
    name: file.name.replace(".glb", ""),
    sizeMB: file.size / 1024 / 1024,
    loadTime: file.loadTime,
    vertices: file.vertices,
    textures: file.textures,
    materials: file.materials,
    complexity: file.vertices / 1000 + file.textures * 2 + file.materials * 3,
  }));

  // Request distribution by domain
  const domainRequestData = data.domains.map((domain: any) => ({
    domain: domain.domain.replace(".example.com", ""),
    requests: domain.requests,
    sizeMB: domain.totalSize / 1024 / 1024,
    avgResponse: domain.avgResponseTime,
  }));

  // Network waterfall simulation
  const networkWaterfallData = data.networkRequests.map((req: any, index: number) => ({
    id: index,
    name: req.url.split("/").pop()?.substring(0, 15) + "...",
    start: index * 50 + Math.random() * 100,
    duration: req.duration,
    size: req.size / 1024,
    protocol: req.protocol,
    type: req.type,
  }));

  return (
    <div className="grid gap-4 sm:gap-6">
      {/* Advanced Performance Timeline */}
      <PerformanceTimelineChart data={timelineData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Protocol Performance Comparison */}
        <ProtocolPerformanceChart data={protocolData} />

        {/* WASM Module Performance */}
        <WasmPerformanceChart data={wasmData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* GLB File Analysis */}
        <GlbComplexityChart data={glbData} />

        {/* Domain Request Distribution */}
        <DomainDistributionChart data={domainRequestData} />
      </div>

      {/* Network Waterfall Visualization */}
      <NetworkWaterfallChart data={networkWaterfallData} />
    </div>
  );
}
