"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text3D, Environment, Float } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, BarChart3, Cpu, Globe, ChevronDown } from "lucide-react"
import Link from "next/link"
import type * as THREE from "three"

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <group ref={groupRef}>
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <Text3D
            font="/fonts/Geist_Bold.json"
            size={2}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            position={[-3, 0, 0]}
          >
            PERF
            <meshPhysicalMaterial
              color="#00ff88"
              transmission={0.9}
              opacity={0.8}
              metalness={0.1}
              roughness={0.1}
              ior={1.5}
              thickness={0.01}
              specularIntensity={1}
              specularColor="#ffffff"
              envMapIntensity={1}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </Text3D>
        </Float>

        {/* Floating cubes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Float
            key={i}
            speed={1 + i * 0.2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
            position={[(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]}
          >
            <mesh ref={meshRef}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshPhysicalMaterial
                color={`hsl(${i * 45}, 70%, 60%)`}
                transmission={0.8}
                opacity={0.7}
                metalness={0.2}
                roughness={0.2}
                ior={1.5}
                thickness={0.01}
              />
            </mesh>
          </Float>
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  )
}

function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{
          background: "radial-gradient(circle, #00ff88 0%, transparent 70%)",
          left: `${mousePosition.x * 0.1}%`,
          top: `${mousePosition.y * 0.1}%`,
          transform: "translate(-50%, -50%)",
          transition: "all 0.3s ease-out",
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl animate-bounce"
        style={{
          background: "radial-gradient(circle, #0088ff 0%, transparent 70%)",
          right: `${mousePosition.x * 0.05}%`,
          bottom: `${mousePosition.y * 0.05}%`,
          animationDelay: "1s",
          animationDuration: "3s",
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full opacity-10 blur-2xl animate-pulse"
        style={{
          background: "radial-gradient(circle, #ff0088 0%, transparent 70%)",
          left: `${50 + mousePosition.x * 0.02}%`,
          top: `${50 + mousePosition.y * 0.02}%`,
          transform: "translate(-50%, -50%)",
          animationDelay: "2s",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-green-400 rounded-full opacity-30 animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 backdrop-blur-sm bg-black/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg" />
          <span className="text-xl font-bold">PerfAnalyzer</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="hover:text-green-400 transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-green-400 transition-colors">
            Pricing
          </Link>
          <Link href="#docs" className="hover:text-green-400 transition-colors">
            Docs
          </Link>
          <Button
            variant="outline"
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black bg-transparent"
          >
            <Link href="/">Try Demo</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                🚀 Next-Gen Performance Analysis
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Unlock Your
                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  {" "}
                  Web Performance
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Advanced Chrome DevTools performance analysis with WASM optimization, GLB complexity insights, and
                multi-protocol support. Built for the future of web development.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-semibold"
              >
                <Link href="/" className="flex items-center">
                  Start Analyzing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 hover:bg-gray-800 bg-transparent">
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">99.9%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">50+</div>
                <div className="text-sm text-gray-400">Metrics</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">10x</div>
                <div className="text-sm text-gray-400">Faster</div>
              </div>
            </div>
          </div>

          <div className="relative h-96 lg:h-[600px]">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Cutting-Edge
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powered by advanced algorithms and machine learning to provide unprecedented insights into your web
              application performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">WASM Analysis</h3>
                <p className="text-gray-400">
                  Deep insights into WebAssembly performance, compilation times, and optimization opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">GLB Optimization</h3>
                <p className="text-gray-400">
                  Analyze 3D model complexity, loading patterns, and rendering performance for GLB files.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Cpu className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Monitoring</h3>
                <p className="text-gray-400">
                  Live performance metrics with advanced timeline visualization and bottleneck detection.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-Protocol</h3>
                <p className="text-gray-400">
                  Support for HTTP/1.1, HTTP/2, HTTP/3, and WebSocket performance analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Optimize
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers who trust PerfAnalyzer for their performance optimization needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-semibold"
              >
                <Link href="/" className="flex items-center">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 hover:bg-gray-800 bg-transparent">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg" />
                <span className="text-xl font-bold">PerfAnalyzer</span>
              </div>
              <p className="text-gray-400">Next-generation performance analysis for modern web applications.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PerfAnalyzer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
