export interface ComplexPerformanceData {
  traceEvents: any[];
  metadata: any;
  categories: string[];
  networkRequests: NetworkRequest[];
  wasmModules: WasmModule[];
  glbFiles: GLBFile[];
  domains: DomainInfo[];
  protocols: ProtocolInfo[];
}

export interface NetworkRequest {
  url: string;
  method: string;
  status: number;
  protocol: string;
  domain: string;
  size: number;
  duration: number;
  type: string;
  priority: string;
}

export interface WasmModule {
  name: string;
  size: number;
  loadTime: number;
  compileTime: number;
  instantiateTime: number;
  memoryUsage: number;
}

export interface GLBFile {
  name: string;
  size: number;
  loadTime: number;
  vertices: number;
  textures: number;
  materials: number;
}

export interface DomainInfo {
  domain: string;
  requests: number;
  totalSize: number;
  avgResponseTime: number;
  protocols: string[];
}

export interface ProtocolInfo {
  protocol: string;
  requests: number;
  totalSize: number;
  avgLatency: number;
  domains: string[];
}
