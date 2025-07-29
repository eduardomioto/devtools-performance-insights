# Performance Evaluation Rules

This document outlines the comprehensive performance evaluation rules and thresholds used by the Devtools Performance Insights.

## 📊 Overall Performance Score Calculation

The performance score is calculated using a penalty-based system starting from 100 points:

\`\`\`typescript
Performance Score = 100 - WASM Penalties - GLB Penalties - Network Penalties - Protocol Penalties
\`\`\`

### Score Categories

| Score Range | Category | Description | Action Required |
|-------------|----------|-------------|-----------------|
| 90-100 | 🟢 Excellent | Optimal performance | Monitor and maintain |
| 70-89 | 🟡 Good | Minor optimizations | Implement quick wins |
| 50-69 | 🟠 Fair | Significant improvements needed | Address high-priority issues |
| 0-49 | 🔴 Poor | Critical performance problems | Immediate action required |

## 🧮 WebAssembly (WASM) Evaluation Rules

### Compilation Time Thresholds

| Metric | Threshold | Penalty | Severity | Impact |
|--------|-----------|---------|----------|---------|
| Compile Time | > 100ms | 5 points | High | Main thread blocking |
| Compile Time | > 200ms | 10 points | Critical | Significant UI freeze |
| Compile Time | > 500ms | 20 points | Critical | Unacceptable delay |

### Memory Usage Thresholds

| Metric | Threshold | Penalty | Severity | Impact |
|--------|-----------|---------|----------|---------|
| Memory Usage | > 16MB per module | 3 points | Medium | Memory pressure |
| Memory Usage | > 32MB per module | 8 points | High | Potential OOM |
| Total WASM Memory | > 64MB | 15 points | Critical | Device limitations |

### Load Time Evaluation

| Metric | Threshold | Penalty | Severity | Impact |
|--------|-----------|---------|----------|---------|
| Load Time | > 500ms | 2 points | Low | Network delay |
| Load Time | > 1000ms | 5 points | Medium | User perception |
| Load Time | > 2000ms | 10 points | High | Abandonment risk |

### WASM Performance Rules

1. **Streaming Compilation Rule**: Modules not using `WebAssembly.instantiateStreaming()` receive a 5-point penalty
2. **Main Thread Blocking Rule**: Compilation on main thread > 50ms receives escalating penalties
3. **Memory Efficiency Rule**: Memory usage > 2x file size indicates inefficient allocation
4. **Instantiation Speed Rule**: Instantiation time > 100ms suggests complex module dependencies

## 🎮 3D Model (GLB) Evaluation Rules

### File Size Thresholds

| Metric | Threshold | Penalty | Severity | Impact |
|--------|-----------|---------|----------|---------|
| GLB File Size | > 5MB | 2 points | Low | Slow loading |
| GLB File Size | > 10MB | 5 points | Medium | Network strain |
| GLB File Size | > 20MB | 10 points | High | Mobile unfriendly |
| GLB File Size | > 50MB | 25 points | Critical | Prohibitive size |

### Complexity Scoring

The complexity score is calculated as:
\`\`\`
Complexity = (Vertices / 1000) + (Textures × 2) + (Materials × 3)
\`\`\`

| Complexity Score | Threshold | Penalty | Severity | Impact |
|------------------|-----------|---------|----------|---------|
| Complexity | > 50 | 3 points | Medium | GPU strain |
| Complexity | > 100 | 8 points | High | Frame drops |
| Complexity | > 200 | 15 points | Critical | Rendering issues |

### 3D Performance Rules

1. **LOD Implementation Rule**: Models without Level-of-Detail receive complexity-based penalties
2. **Texture Compression Rule**: Uncompressed textures > 1MB each receive 2-point penalties
3. **Geometry Optimization Rule**: Vertex count > 100k without justification receives penalties
4. **Material Efficiency Rule**: > 20 materials per model suggests optimization opportunities

## 🌐 Network Protocol Evaluation Rules

### HTTP Version Penalties

| Protocol | Usage Threshold | Penalty | Severity | Rationale |
|----------|----------------|---------|----------|-----------|
| HTTP/1.1 | Any usage | 5 points per 10 requests | High | Legacy protocol limitations |
| HTTP/1.1 | > 50% of requests | 15 points | Critical | Missing modern optimizations |
| Mixed Protocols | > 3 different versions | 5 points | Medium | Connection fragmentation |

### Request Count Thresholds

| Metric | Threshold | Penalty | Severity | Impact |
|--------|-----------|---------|----------|---------|
| Total Requests | > 100 | 5 points | Medium | Network congestion |
| Total Requests | > 200 | 15 points | High | Waterfall delays |
| Total Requests | > 300 | 25 points | Critical | Overwhelming network |

### Protocol Performance Rules

1. **HTTP/3 Adoption Rule**: Sites not using HTTP/3 for > 50% of requests receive penalties
2. **Connection Reuse Rule**: > 10 connections to same domain suggests poor multiplexing
3. **Request Prioritization Rule**: Critical resources without high priority receive penalties
4. **Protocol Consistency Rule**: Mixed protocols across domains reduce efficiency

## 🏗️ Domain Architecture Evaluation Rules

### Domain Count Thresholds

| Metric | Threshold | Penalty | Severity | Impact |
|--------|-----------|---------|----------|---------|
| Unique Domains | > 5 | 3 points | Medium | DNS overhead |
| Unique Domains | > 10 | 8 points | High | Connection limits |
| Unique Domains | > 15 | 15 points | Critical | Excessive fragmentation |

### DNS Performance Rules

1. **Domain Consolidation Rule**: > 5 domains for < 100 requests suggests over-fragmentation
2. **DNS Prefetch Rule**: Missing dns-prefetch for external domains receives penalties
3. **Connection Coalescing Rule**: Domains not supporting connection sharing receive penalties
4. **CDN Efficiency Rule**: Static assets not served from CDN domains receive penalties

## ⚡ Core Web Vitals Integration

### First Contentful Paint (FCP)

| Threshold | Score | Penalty | Classification |
|-----------|-------|---------|----------------|
| < 1.8s | 0 | None | Good |
| 1.8s - 3.0s | 5 | Medium | Needs Improvement |
| > 3.0s | 15 | High | Poor |

### Largest Contentful Paint (LCP)

| Threshold | Score | Penalty | Classification |
|-----------|-------|---------|----------------|
| < 2.5s | 0 | None | Good |
| 2.5s - 4.0s | 8 | Medium | Needs Improvement |
| > 4.0s | 20 | Critical | Poor |

### First Input Delay (FID)

| Threshold | Score | Penalty | Classification |
|-----------|-------|---------|----------------|
| < 100ms | 0 | None | Good |
| 100ms - 300ms | 5 | Medium | Needs Improvement |
| > 300ms | 15 | High | Poor |

### Cumulative Layout Shift (CLS)

| Threshold | Score | Penalty | Classification |
|-----------|-------|---------|----------------|
| < 0.1 | 0 | None | Good |
| 0.1 - 0.25 | 5 | Medium | Needs Improvement |
| > 0.25 | 12 | High | Poor |

## 🔍 Issue Classification System

### Critical Issues (Immediate Action Required)

1. **WASM Compilation > 200ms**: Blocks main thread significantly
2. **GLB Files > 20MB**: Prohibitive for mobile users
3. **HTTP/1.1 for Critical Resources**: Missing modern optimizations
4. **LCP > 4.0s**: Poor user experience
5. **Total Memory > 100MB**: Device limitations

### High Priority Issues (Address Within 2 Weeks)

1. **WASM Compilation 100-200ms**: Noticeable delays
2. **GLB Files 10-20MB**: Mobile performance impact
3. **> 200 Network Requests**: Network congestion
4. **> 10 Domains**: DNS and connection overhead
5. **FCP > 3.0s**: Slow perceived performance

### Medium Priority Issues (Address Within Month)

1. **WASM Memory > 16MB per module**: Memory pressure
2. **GLB Complexity > 50**: GPU performance impact
3. **Mixed Protocol Usage**: Suboptimal connections
4. **CLS > 0.1**: Layout stability issues
5. **Missing Resource Hints**: Optimization opportunities

### Low Priority Issues (Optimization Opportunities)

1. **WASM Load Time > 500ms**: Network optimization
2. **GLB Files 5-10MB**: Compression opportunities
3. **5-10 Domains**: Minor consolidation benefits
4. **HTTP/2 Only Usage**: HTTP/3 upgrade potential
5. **Unoptimized Images**: Format and compression improvements

## 📈 Performance Budgets

### Recommended Budgets by Application Type

#### Standard Web Application
- **Total Page Weight**: < 2MB
- **JavaScript Bundle**: < 500KB
- **Images**: < 1MB
- **Network Requests**: < 50
- **Domains**: < 3

#### WASM-Heavy Application
- **WASM Modules**: < 5MB total
- **Compilation Time**: < 100ms total
- **Memory Usage**: < 32MB total
- **Load Time**: < 1s per module

#### 3D/WebGL Application
- **GLB Models**: < 10MB total
- **Texture Memory**: < 50MB
- **Vertex Count**: < 500k total
- **Draw Calls**: < 100 per frame

#### Multi-Domain Architecture
- **Unique Domains**: < 5
- **DNS Lookups**: < 10
- **Connection Count**: < 20
- **Protocol Versions**: ≤ 2

## 🎯 Optimization Priority Matrix

| Impact | Effort | Priority | Examples |
|--------|--------|----------|----------|
| High | Low | 🔴 Critical | Image compression, HTTP/3 upgrade |
| High | Medium | 🟠 High | WASM streaming, GLB LOD system |
| High | High | 🟡 Medium | Architecture refactoring, CDN migration |
| Medium | Low | 🟢 Low | Resource hints, minor optimizations |

## 🔄 Continuous Monitoring Rules

### Performance Regression Detection

1. **Score Drop > 10 points**: Investigate immediately
2. **New Critical Issues**: Block deployment
3. **Budget Exceeded**: Require optimization
4. **Core Web Vitals Degradation**: Priority fix

### Automated Thresholds

- **Performance Score**: Must maintain > 70
- **Critical Issues**: Zero tolerance
- **High Priority Issues**: < 3 allowed
- **Budget Overruns**: < 10% acceptable

---

*These rules are based on web performance best practices, Core Web Vitals guidelines, and real-world performance impact studies. Thresholds may be adjusted based on specific application requirements and user demographics.*
