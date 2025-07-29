# Contributing to Advanced Chrome Performance Analyzer

Thank you for your interest in contributing to the Advanced Chrome Performance Analyzer! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new functionality or improvements
- **Code Contributions**: Submit bug fixes, features, or optimizations
- **Documentation**: Improve guides, API docs, or examples
- **Testing**: Help test new features and report issues
- **Community Support**: Help other users in discussions and issues

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm
- Git
- A GitHub account

### Development Setup

1. **Fork the repository**
   \`\`\`bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/chrome-performance-analyzer.git
   cd chrome-performance-analyzer
   \`\`\`

2. **Add upstream remote**
   \`\`\`bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/chrome-performance-analyzer.git
   \`\`\`

3. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

4. **Set up environment**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   \`\`\`

5. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Verify setup**
   - Open http://localhost:3000
   - Upload a performance profile or use sample data
   - Ensure all features work correctly

## 🔄 Development Workflow

### Branch Strategy

We use a **feature branch workflow**:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Individual features
- `bugfix/issue-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

### Making Changes

1. **Create a feature branch**
   \`\`\`bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Make your changes**
   - Follow our coding standards (see below)
   - Write tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   \`\`\`bash
   npm run test
   npm run lint
   npm run type-check
   npm run build
   \`\`\`

4. **Commit your changes**
   \`\`\`bash
   git add .
   git commit -m "feat: add new performance metric analysis"
   \`\`\`

5. **Push and create PR**
   \`\`\`bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   \`\`\`

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
\`\`\`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**
\`\`\`bash
feat(wasm): add streaming compilation analysis
fix(charts): resolve mobile responsiveness issue
docs(readme): update installation instructions
test(protocol): add HTTP/3 analysis tests
\`\`\`

## 📝 Coding Standards

### TypeScript Guidelines

- **Strict Mode**: Always use TypeScript strict mode
- **Type Safety**: Prefer explicit types over `any`
- **Interfaces**: Use interfaces for object shapes
- **Enums**: Use const assertions or union types instead of enums

\`\`\`typescript
// ✅ Good
interface PerformanceMetric {
  name: string
  value: number
  threshold: number
}

const METRIC_TYPES = ['fcp', 'lcp', 'fid', 'cls'] as const
type MetricType = typeof METRIC_TYPES[number]

// ❌ Avoid
const data: any = {}
enum MetricTypes { FCP, LCP, FID, CLS }
\`\`\`

### React Guidelines

- **Functional Components**: Use function components with hooks
- **Props Interface**: Always define props interfaces
- **Event Handlers**: Use proper event types
- **Performance**: Use `useMemo` and `useCallback` appropriately

\`\`\`typescript
// ✅ Good
interface ChartProps {
  data: PerformanceData
  onMetricSelect?: (metric: string) => void
}

export function PerformanceChart({ data, onMetricSelect }: ChartProps) {
  const processedData = useMemo(() => processData(data), [data])
  
  const handleClick = useCallback((metric: string) => {
    onMetricSelect?.(metric)
  }, [onMetricSelect])

  return <div>{/* component JSX */}</div>
}
\`\`\`

### CSS/Styling Guidelines

- **Tailwind CSS**: Use Tailwind utility classes
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Ensure all components support dark theme
- **Accessibility**: Include proper ARIA attributes

\`\`\`tsx
// ✅ Good
<button
  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             disabled:opacity-50 disabled:cursor-not-allowed
             sm:px-6 sm:py-3"
  aria-label="Analyze performance profile"
  disabled={isLoading}
>
  {isLoading ? 'Analyzing...' : 'Analyze'}
</button>
\`\`\`

### File Organization

\`\`\`
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── charts/           # Chart components
│   └── analysis/         # Analysis components
├── lib/                  # Utility functions
│   ├── utils.ts          # General utilities
│   ├── performance.ts    # Performance analysis logic
│   └── constants.ts      # Application constants
├── types/                # TypeScript type definitions
│   ├── performance.ts    # Performance-related types
│   └── index.ts          # Exported types
└── hooks/                # Custom React hooks
    ├── usePerformance.ts # Performance analysis hook
    └── useCharts.ts      # Chart-related hook
\`\`\`

## 🧪 Testing Guidelines

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

### Writing Tests

\`\`\`typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react'
import { PerformanceChart } from '../PerformanceChart'

describe('PerformanceChart', () => {
  const mockData = {
    metrics: [
      { name: 'FCP', value: 1200, threshold: 1800 }
    ]
  }

  it('renders performance metrics correctly', () => {
    render(<PerformanceChart data={mockData} />)
    
    expect(screen.getByText('FCP')).toBeInTheDocument()
    expect(screen.getByText('1200ms')).toBeInTheDocument()
  })

  it('calls onMetricSelect when metric is clicked', () => {
    const onMetricSelect = jest.fn()
    render(<PerformanceChart data={mockData} onMetricSelect={onMetricSelect} />)
    
    fireEvent.click(screen.getByText('FCP'))
    expect(onMetricSelect).toHaveBeenCalledWith('FCP')
  })
})
\`\`\`

### Test Commands

\`\`\`bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
\`\`\`

## 📚 Documentation Guidelines

### Code Documentation

- **JSDoc Comments**: Document complex functions
- **README Updates**: Keep README.md current
- **Type Documentation**: Document complex types
- **Examples**: Provide usage examples

\`\`\`typescript
/**
 * Analyzes WebAssembly module performance metrics
 * @param wasmData - Raw WASM performance data from Chrome profile
 * @param options - Analysis configuration options
 * @returns Processed WASM metrics with performance scores
 * @example
 * \`\`\`typescript
 * const metrics = analyzeWasmPerformance(profileData.wasm, {
 *   includeMemoryAnalysis: true,
 *   compilationThreshold: 100
 * })
 * ```
 */
export function analyzeWasmPerformance(
  wasmData: RawWasmData,
  options: WasmAnalysisOptions = {}
): WasmMetrics {
  // Implementation
}
\`\`\`

### Documentation Updates

When making changes, update relevant documentation:

- **README.md**: Installation, usage, features
- **API Documentation**: Function signatures and examples
- **Performance Rules**: Update `docs/performance-rules.md`
- **Contributing Guide**: This file for process changes

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Test with latest version** to ensure bug still exists
3. **Reproduce consistently** with minimal steps
4. **Check browser compatibility** if UI-related

### Bug Report Template

\`\`\`markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Upload file '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g., Windows 11, macOS 13.0]
- Browser: [e.g., Chrome 120.0]
- Node.js: [e.g., 18.17.0]
- App Version: [e.g., 1.2.0]

**Performance Profile**
If applicable, attach the performance profile that caused the issue.

**Screenshots**
Add screenshots to help explain the problem.

**Additional Context**
Any other context about the problem.
\`\`\`

## 💡 Feature Requests

### Before Requesting

1. **Check existing issues** for similar requests
2. **Consider the scope** - does it fit the project goals?
3. **Think about implementation** - is it technically feasible?

### Feature Request Template

\`\`\`markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How do you envision this feature working?

**Alternatives Considered**
What other solutions have you considered?

**Use Cases**
Specific scenarios where this feature would be useful.

**Implementation Ideas**
Any thoughts on how this could be implemented?

**Additional Context**
Screenshots, mockups, or examples that help explain the feature.
\`\`\`

## 🔍 Code Review Process

### For Contributors

- **Self-review**: Review your own code before submitting
- **Test thoroughly**: Ensure all tests pass
- **Documentation**: Update relevant documentation
- **Small PRs**: Keep pull requests focused and manageable

### Review Criteria

Reviewers will check for:

- **Functionality**: Does the code work as intended?
- **Code Quality**: Is the code clean and maintainable?
- **Performance**: Are there any performance implications?
- **Security**: Are there any security concerns?
- **Testing**: Are there adequate tests?
- **Documentation**: Is documentation updated?

### Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Peer Review**: At least one maintainer reviews
3. **Feedback**: Address review comments
4. **Approval**: Maintainer approves the PR
5. **Merge**: PR is merged to develop branch

## 🏷️ Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Workflow

1. **Feature Freeze**: Stop adding new features
2. **Testing**: Comprehensive testing of develop branch
3. **Release Branch**: Create release branch from develop
4. **Bug Fixes**: Only critical bug fixes in release branch
5. **Release**: Merge to main and tag version
6. **Deploy**: Deploy to production
7. **Post-Release**: Merge back to develop

## 🤝 Community Guidelines

### Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Requests**: Code contributions and reviews

### Getting Help

- **Documentation**: Check README and docs/ folder
- **Search Issues**: Look for existing solutions
- **Ask Questions**: Use GitHub Discussions
- **Contact Maintainers**: For sensitive issues

## 🎯 Contribution Areas

### High Priority

- **Performance Optimizations**: Improve analysis speed
- **Browser Compatibility**: Support more browsers
- **Mobile Experience**: Enhance mobile usability
- **Accessibility**: Improve screen reader support
- **Documentation**: Expand guides and examples

### Medium Priority

- **New Analysis Features**: Additional performance metrics
- **Export Functionality**: Different export formats
- **Comparison Tools**: Compare multiple profiles
- **Integration**: CI/CD pipeline integration

### Low Priority

- **UI Enhancements**: Visual improvements
- **Advanced Features**: Power user functionality
- **Localization**: Multi-language support

## 📊 Metrics and Goals

### Project Metrics

We track:
- **Performance**: Analysis speed and accuracy
- **Usability**: User experience and accessibility
- **Reliability**: Bug reports and uptime
- **Community**: Contributors and user engagement

### Success Criteria

- **Fast Analysis**: < 5 seconds for typical profiles
- **High Accuracy**: > 95% correct issue identification
- **Good UX**: Intuitive interface for all skill levels
- **Active Community**: Regular contributions and discussions

## 🙏 Recognition

### Contributors

All contributors are recognized in:
- **README.md**: Contributors section
- **Release Notes**: Contribution highlights
- **GitHub**: Contributor graphs and statistics

### Maintainers

Current maintainers:
- [@maintainer1](https://github.com/maintainer1) - Project Lead
- [@maintainer2](https://github.com/maintainer2) - Technical Lead
- [@maintainer3](https://github.com/maintainer3) - Community Manager

## 📞 Contact

- **General Questions**: Use GitHub Discussions
- **Security Issues**: See [SECURITY.md](SECURITY.md)
- **Maintainer Contact**: [maintainers@project.com](mailto:maintainers@project.com)

---

Thank you for contributing to the Advanced Chrome Performance Analyzer! Your contributions help make web performance analysis better for everyone. 🚀
