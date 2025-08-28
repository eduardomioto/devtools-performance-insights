"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D, Environment, Float } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, BarChart3, Cpu, Globe, ChevronDown } from "lucide-react";
import Link from "next/link";
import type * as THREE from "three";

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

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
  );
}

function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Gradient orbs */}
      <div
        className="absolute h-96 w-96 animate-pulse rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #00ff88 0%, transparent 70%)",
          left: `${mousePosition.x * 0.1}%`,
          top: `${mousePosition.y * 0.1}%`,
          transform: "translate(-50%, -50%)",
          transition: "all 0.3s ease-out",
        }}
      />
      <div
        className="absolute h-80 w-80 animate-bounce rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, #0088ff 0%, transparent 70%)",
          right: `${mousePosition.x * 0.05}%`,
          bottom: `${mousePosition.y * 0.05}%`,
          animationDelay: "1s",
          animationDuration: "3s",
        }}
      />
      <div
        className="absolute h-64 w-64 animate-pulse rounded-full opacity-10 blur-2xl"
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
          className="absolute h-2 w-2 animate-bounce rounded-full bg-green-400 opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between bg-black/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-green-400 to-blue-500" />
          <span className="text-xl font-bold">PerfAnalyzer</span>
        </div>
        <div className="hidden items-center space-x-8 md:flex">
          <Link href="#features" className="transition-colors hover:text-green-400">
            Features
          </Link>
          <Link href="#pricing" className="transition-colors hover:text-green-400">
            Pricing
          </Link>
          <Link href="#docs" className="transition-colors hover:text-green-400">
            Docs
          </Link>
          <Button
            variant="outline"
            className="border-green-400 bg-transparent text-green-400 hover:bg-green-400 hover:text-black"
          >
            <Link href="/">Try Demo</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen items-center">
        <div className="container mx-auto grid items-center gap-12 px-6 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="border-green-400/30 bg-green-400/20 text-green-400">
                🚀 Next-Gen Performance Analysis
              </Badge>
              <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                Unlock Your
                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  {" "}
                  Web Performance
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-gray-300">
                Advanced Chrome DevTools performance analysis with WASM optimization, GLB complexity insights, and
                multi-protocol support. Built for the future of web development.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-400 to-blue-500 font-semibold text-black hover:from-green-500 hover:to-blue-600"
              >
                <Link href="/" className="flex items-center">
                  Start Analyzing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 bg-transparent hover:bg-gray-800">
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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 bg-gradient-to-b from-transparent to-gray-900/50 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
              Cutting-Edge
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Features
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-300">
              Powered by advanced algorithms and machine learning to provide unprecedented insights into your web
              application performance.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/50">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-transform group-hover:scale-110">
                  <Zap className="h-8 w-8 text-black" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">WASM Analysis</h3>
                <p className="text-gray-400">
                  Deep insights into WebAssembly performance, compilation times, and optimization opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/50">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-transform group-hover:scale-110">
                  <BarChart3 className="h-8 w-8 text-black" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">GLB Optimization</h3>
                <p className="text-gray-400">
                  Analyze 3D model complexity, loading patterns, and rendering performance for GLB files.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/50">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-transform group-hover:scale-110">
                  <Cpu className="h-8 w-8 text-black" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Real-time Monitoring</h3>
                <p className="text-gray-400">
                  Live performance metrics with advanced timeline visualization and bottleneck detection.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/50">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-transform group-hover:scale-110">
                  <Globe className="h-8 w-8 text-black" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Multi-Protocol</h3>
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
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
              Ready to
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Optimize
              </span>
              ?
            </h2>
            <p className="mb-8 text-xl text-gray-300">
              Join thousands of developers who trust PerfAnalyzer for their performance optimization needs.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-400 to-blue-500 font-semibold text-black hover:from-green-500 hover:to-blue-600"
              >
                <Link href="/" className="flex items-center">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 bg-transparent hover:bg-gray-800">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 bg-gray-900/50 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-green-400 to-blue-500" />
                <span className="text-xl font-bold">PerfAnalyzer</span>
              </div>
              <p className="text-gray-400">Next-generation performance analysis for modern web applications.</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PerfAnalyzer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
