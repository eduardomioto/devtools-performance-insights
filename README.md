# Devtools Performance Insights

A comprehensive Next.js application for analyzing complex Chrome DevTools performance profiles, with specialized support for WebAssembly (WASM), 3D models (GLB), HTTP/2-3 protocols, and multi-domain architectures.

## 🛡️ Security

[![Snyk Security](https://snyk.io/test/github/eduardomioto/chrome-performance-analyzer/badge.svg)](https://snyk.io/test/github/eduardomioto/devtools-performance-insights)
[![Security Rating](https://img.shields.io/badge/security-A+-brightgreen.svg)](https://github.com/eduardomioto/devtools-performance-insights/security)

We take security seriously. This project uses **Snyk** for comprehensive security scanning:
- 🔍 **Dependency Scanning**: Continuous monitoring of npm packages
- 📝 **Code Analysis**: Static analysis for security vulnerabilities  
- 🐳 **Container Security**: Docker image vulnerability scanning
- 🏗️ **Infrastructure**: Security configuration validation

[View Security Policy →](SECURITY.md) | [Security Scanning Details →](docs/SECURITY_SCANNING.md)

## 🚀 Features

- **Complex Profile Analysis**: Parse and analyze Chrome DevTools performance profiles
- **WebAssembly Support**: Detailed WASM compilation and execution metrics
- **3D Model Analysis**: GLB/GLTF file complexity and loading performance
- **Protocol Comparison**: HTTP/1.1, HTTP/2, and HTTP/3 performance analysis
- **Multi-Domain Architecture**: Cross-domain resource and DNS analysis
- **Interactive Charts**: Advanced visualizations with Recharts
- **Mobile-Responsive**: Optimized for desktop and mobile devices
- **Dark Theme**: Professional dark UI optimized for performance analysis

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm package manager
- Modern web browser with JavaScript enabled

## 🛠️ Installation & Setup

1. **Clone the repository**
   
   ```bash
   git clone <repository-url>
   cd chrome-performance-analyzer
   ```

2. **Install dependencies**
   
   ```bash
   yarn install
   ```

3. **Run the development server**
   
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔒 Security Scanning

This project includes comprehensive security scanning with Snyk:

```bash
# Run security audit locally
yarn audit

# Check for vulnerabilities with Snyk (requires Snyk CLI)
yarn snyk test

# Monitor project for new vulnerabilities
yarn snyk monitor
```

### Automated Security Checks
- ✅ **Every Push**: Dependency and code vulnerability scanning
- ✅ **Every PR**: Delta security analysis for new changes  
- ✅ **Daily**: Comprehensive security audit
- ✅ **Container**: Docker image security scanning
- ✅ **IaC**: Infrastructure configuration security

## 📊 How to Use

### 1. Obtaining Performance Profiles

**From Chrome DevTools:**
1. Open Chrome DevTools (F12)
2. Go to the **Performance** tab
3. Click the record button (circle icon)
4. Perform the actions you want to analyze
5. Stop recording
6. Click **Export** (download icon) to save as JSON

**Supported Profile Types:**
- Standard web application profiles
- WebAssembly-heavy applications
- 3D/WebGL applications with GLB models
- Multi-domain architectures
- HTTP/2 and HTTP/3 enabled sites

### 2. Uploading Profiles

- **File Upload**: Drag and drop or select JSON files up to 50MB
- **Sample Data**: Use the "Load Complex Sample" for demonstration

### 3. Understanding the Interface

The analyzer provides six main analysis views:

- **Overview**: Performance timeline and key metrics
- **Resources**: WASM modules and 3D model analysis
- **Protocols**: HTTP protocol performance comparison
- **Charts**: Advanced visualizations and correlations
- **Issues**: Identified performance problems
- **Optimize**: Actionable recommendations with code examples

## 📈 Understanding the Metrics

### Performance Score (0-100)
A composite score based on:
- **WASM Compilation Time**: Penalties for >100ms compile times
- **3D Model Size**: Penalties for >20MB GLB files
- **Request Count**: Penalties for >200 network requests
- **Protocol Efficiency**: Bonus for HTTP/3 usage

**Score Ranges:**
- 🟢 **90-100**: Excellent performance
- 🟡 **70-89**: Good performance, minor optimizations needed
- 🟠 **50-69**: Fair performance, significant improvements possible
- 🔴 **0-49**: Poor performance, critical issues present

### Core Web Vitals Integration

The analyzer maps Chrome profile data to Core Web Vitals:

- **FCP (First Contentful Paint)**: Time to first visual content
- **LCP (Largest Contentful Paint)**: Time to largest content element
- **FID (First Input Delay)**: Input responsiveness
- **CLS (Cumulative Layout Shift)**: Visual stability
- **TTFB (Time to First Byte)**: Server response time

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for custom configuration:

```env
# Optional: Custom API endpoints
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Optional: Analytics configuration
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=false

# Security: Snyk configuration
SNYK_TOKEN=your-snyk-api-token
SNYK_ORG_ID=your-organization-id
```

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Security**: Snyk for vulnerability scanning

### Project Structure

```
chrome-performance-analyzer/
├── app/
│   ├── globals.css          # Global styles and theme
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main application page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── advanced-performance-charts.tsx
│   ├── complex-issues-analysis.tsx
│   ├── advanced-recommendations.tsx
│   ├── resource-analysis.tsx
│   └── protocol-analysis.tsx
├── docs/
│   ├── performance-rules.md # Performance evaluation rules
│   └── SECURITY_SCANNING.md # Security documentation
├── .github/
│   ├── workflows/           # GitHub Actions
│   ├── FUNDING.yml          # Sponsorship configuration
│   └── dependabot.yml      # Dependency updates
├── public/                  # Static assets
├── Dockerfile              # Container configuration
├── .snyk                   # Snyk configuration
├── README.md               # This file
└── package.json           # Dependencies and scripts
```

## 🧪 Development

### Running Tests

```bash
yarn test
```

### Security Testing

```bash
# Run security audit
yarn audit

# Run Snyk security scan (requires Snyk CLI)
yarn snyk test

# Check for license issues
yarn snyk test --print-deps
```

### Building for Production

```bash
yarn build
yarn start
```

### Linting and Formatting

```bash
yarn lint
yarn format
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation for API changes
- Ensure mobile responsiveness
- **Run security scans** before submitting PRs

[**Contributing Guide →**](CONTRIBUTING.md) | [**Code of Conduct →**](CODE_OF_CONDUCT.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [Performance Rules](docs/performance-rules.md)
- **Security**: Review [Security Policy](SECURITY.md)
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions for questions
- **Email**: Contact the maintainers for enterprise support

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release with full Chrome profile analysis
- WebAssembly and 3D model support
- HTTP/2-3 protocol analysis
- Mobile-responsive dark theme UI
- Comprehensive performance recommendations
- **Security**: Integrated Snyk security scanning
- **Sponsorship**: Complete funding infrastructure

[**View Full Changelog →**](CHANGELOG.md)

---

**Built with ❤️ for the web performance community**

[![Security](https://img.shields.io/badge/security-Snyk-4C4A73.svg)](https://snyk.io/)
[![Sponsors](https://img.shields.io/badge/sponsors-welcome-brightgreen.svg)](SPONSORS.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)


## 🧩 Alternatives
- [Speedscope](https://www.speedscope.app/) ![Speedscope Icon](https://www.speedscope.app/favicon.ico)
- [Perfetto UI](https://ui.perfetto.dev/) ![Perfetto Icon](https://ui.perfetto.dev/favicon.ico)Alternatives

