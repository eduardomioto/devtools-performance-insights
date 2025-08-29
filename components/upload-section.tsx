"use client";

import type React from "react";
import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  Zap,
  Database,
  Cpu,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  X,
  Activity,
  BarChart3,
  Target,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface UploadSectionProps {
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSample: () => void;
}

export function UploadSection({ isLoading, error, uploadProgress, onFileUpload, onLoadSample }: UploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHoveringUpload, setIsHoveringUpload] = useState(false);
  const [isHoveringSample, setIsHoveringSample] = useState(false);
  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type === "application/json" || file.name.endsWith(".json")) {
          const syntheticEvent = {
            target: { files: files },
          } as React.ChangeEvent<HTMLInputElement>;
          onFileUpload(syntheticEvent);
        }
      }
    },
    [onFileUpload]
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left Column - Marketing Content */}
        <div className="space-y-8 lg:pt-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="relative">
              <div className="relative">
                <p className="mt-4 text-xl leading-relaxed text-slate-300 sm:text-base">
                  Uncover deep insights from complex web applications with WASM, 3D graphics, and multi-protocol
                  architectures.
                </p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-100">What You'll Discover</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                <div className="flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-medium text-slate-100">WebAssembly Performance</h3>
                  <p className="text-sm text-slate-400">
                    Analyze WASM compilation times, memory usage, and execution bottlenecks across modules.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                <div className="flex-shrink-0 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-medium text-slate-100">3D Model Optimization</h3>
                  <p className="text-sm text-slate-400">
                    Deep dive into GLB/GLTF files, vertex counts, texture analysis, and rendering performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                <div className="flex-shrink-0 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 p-2">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-medium text-slate-100">Multi-Protocol Analysis</h3>
                  <p className="text-sm text-slate-400">
                    Compare HTTP/1.1, HTTP/2, and HTTP/3 performance across multiple domains.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 text-center">
              <div className="mb-2 flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <div className="mb-1 text-2xl font-bold text-slate-100">200+</div>
              <div className="text-xs text-slate-400">Metrics Tracked</div>
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 text-center">
              <div className="mb-2 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <div className="mb-1 text-2xl font-bold text-slate-100">8+</div>
              <div className="text-xs text-slate-400">Analysis Views</div>
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 text-center">
              <div className="mb-2 flex items-center justify-center">
                <Target className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="mb-1 text-2xl font-bold text-slate-100">50+</div>
              <div className="text-xs text-slate-400">Optimization Tips</div>
            </div>
          </div>
        </div>

        {/* Right Column - Upload Functionality */}
        <div className="space-y-8 lg:pt-8">
          <Card className="sticky top-8 min-w-full overflow-hidden border border-slate-600/50 bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>

            <CardHeader className="relative pb-6 text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-xl text-slate-100">
                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-3 shadow-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                Upload Profile
              </CardTitle>
              <CardDescription className="mt-2 flex items-center justify-center gap-2 text-base text-slate-300">
                Drop your Chrome DevTools performance profile here
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInstructions(true)}
                  className="h-auto p-1 text-slate-400 hover:text-slate-300"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </CardDescription>
            </CardHeader>

            <CardContent className="relative space-y-6 p-6">
              {/* Drag and Drop Zone */}
              <div
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out ${
                  isDragOver
                    ? "border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                    : "border-slate-600 hover:border-slate-500"
                } ${isHoveringUpload ? "bg-slate-700/30" : ""} `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onMouseEnter={() => setIsHoveringUpload(true)}
                onMouseLeave={() => setIsHoveringUpload(false)}
              >
                <div className="p-8">
                  <Label htmlFor="profile-upload" className="cursor-pointer">
                    <div className="space-y-4 text-center">
                      <div
                        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ${
                          isDragOver
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30"
                            : "bg-gradient-to-r from-slate-600 to-slate-700 group-hover:from-slate-500 group-hover:to-slate-600"
                        } `}
                      >
                        <Upload
                          className={`h-6 w-6 transition-colors duration-300 ${
                            isDragOver ? "text-white" : "text-slate-300"
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-100">
                          {isDragOver ? "Drop your file here" : "Choose a performance profile"}
                        </h3>
                        <p className="text-sm text-slate-400">Drag and drop your .json file or click to browse</p>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2 text-xs">
                        <span className="rounded-full border border-slate-600 bg-slate-700 px-2 py-1 text-slate-300">
                          .json only
                        </span>
                        <span className="rounded-full border border-slate-600 bg-slate-700 px-2 py-1 text-slate-300">
                          Max 50MB
                        </span>
                        <span className="rounded-full border border-green-700 bg-green-900/30 px-2 py-1 text-green-400">
                          DevTools
                        </span>
                      </div>
                    </div>
                  </Label>

                  <Input
                    id="profile-upload"
                    type="file"
                    accept=".json"
                    onChange={onFileUpload}
                    disabled={isLoading}
                    className="hidden"
                  />
                </div>

                {/* Progress Bar */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="absolute bottom-0 left-0 right-0 h-2 overflow-hidden bg-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg transition-all duration-500 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Collapsible Sample Data Section */}
              <Collapsible open={isSampleOpen} onOpenChange={setIsSampleOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between rounded-xl border border-slate-600/50 p-3 hover:bg-slate-700/30"
                  >
                    <span className="text-slate-300">Or try sample data</span>
                    {isSampleOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4">
                  <div className="rounded-xl border border-slate-600/30 bg-gradient-to-r from-slate-700/40 to-slate-800/40 p-4">
                    <h4 className="mb-2 text-base font-medium text-slate-100">Complex Sample Profile</h4>
                    <p className="mb-4 text-sm text-slate-300">
                      Explore comprehensive analysis with a realistic web application profile
                    </p>

                    <div className="mb-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded border border-blue-800 bg-blue-900/30 px-2 py-1 text-blue-300">
                        247 requests
                      </span>
                      <span className="rounded border border-purple-800 bg-purple-900/30 px-2 py-1 text-purple-300">
                        3 WASM modules
                      </span>
                      <span className="rounded border border-orange-800 bg-orange-900/30 px-2 py-1 text-orange-300">
                        4 GLB files
                      </span>
                      <span className="rounded border border-cyan-800 bg-cyan-900/30 px-2 py-1 text-cyan-300">
                        5 domains
                      </span>
                    </div>

                    <Button
                      onClick={onLoadSample}
                      disabled={isLoading}
                      onMouseEnter={() => setIsHoveringSample(true)}
                      onMouseLeave={() => setIsHoveringSample(false)}
                      className={`w-full rounded-lg px-6 py-2.5 font-medium transition-all duration-300 ${
                        isLoading
                          ? "cursor-not-allowed bg-slate-600 text-slate-400"
                          : `bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-500 hover:to-purple-500 hover:shadow-xl hover:shadow-blue-500/25 ${isHoveringSample ? "scale-105" : "scale-100"} `
                      } `}
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Load Sample
                        </>
                      )}
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Error Display */}
              {error && (
                <Alert className="border-red-700 bg-red-900/20 shadow-lg">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <AlertDescription className="ml-2 text-sm text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-3 py-6 text-center">
                  <div className="relative">
                    <div className="border-3 mx-auto h-12 w-12 animate-spin rounded-full border-slate-600 border-t-blue-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 animate-pulse text-blue-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-base font-medium text-slate-200">Processing profile...</p>
                    <p className="text-sm text-slate-400">This may take a moment</p>

                    <div className="flex justify-center space-x-2 pt-2">
                      <Skeleton className="h-2 w-16 animate-pulse rounded-full bg-slate-700" />
                      <Skeleton className="h-2 w-12 animate-pulse rounded-full bg-slate-700 delay-100" />
                      <Skeleton className="h-2 w-20 animate-pulse rounded-full bg-slate-700 delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions Modal/Overlay */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-600 bg-slate-800 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
                <FileText className="h-5 w-5" />
                How to Export from Chrome DevTools
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstructions(false)}
                className="p-1 hover:bg-slate-700"
              >
                <X className="h-5 w-5 text-slate-400" />
              </Button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                  1
                </span>
                <p>
                  Open Chrome DevTools (F12) and navigate to the <strong>Performance</strong> tab
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                  2
                </span>
                <p>Click the record button and interact with your application to capture performance data</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                  3
                </span>
                <p>
                  Stop recording and click the <strong>export button</strong> (download icon) to save the profile as a
                  .json file
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                  4
                </span>
                <p>Upload the exported .json file using the form above for detailed analysis</p>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-blue-800 bg-blue-900/20 p-3">
              <p className="text-sm text-blue-200">
                <strong>Pro tip:</strong> For best results, record during complex interactions involving WASM modules,
                3D rendering, or heavy network activity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
