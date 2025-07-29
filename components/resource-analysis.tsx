"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Zap, ImageIcon, Code, FileText, Cpu } from "lucide-react";

interface ResourceAnalysisProps {
  data: any;
}

export default function ResourceAnalysis({ data }: ResourceAnalysisProps) {
  // Categorize network requests
  const requestsByType = data.networkRequests.reduce((acc: any, req: any) => {
    acc[req.type] = acc[req.type] || [];
    acc[req.type].push(req);
    return acc;
  }, {});

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "script":
        return <Code className="w-4 h-4" />;
      case "stylesheet":
        return <FileText className="w-4 h-4" />;
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "wasm":
        return <Cpu className="w-4 h-4" />;
      case "xhr":
      case "fetch":
        return <Database className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "script":
        return "bg-blue-500";
      case "stylesheet":
        return "bg-green-500";
      case "image":
        return "bg-purple-500";
      case "wasm":
        return "bg-orange-500";
      case "xhr":
      case "fetch":
        return "bg-cyan-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLargestResources = () => {
    return [...data.networkRequests].sort((a, b) => b.size - a.size).slice(0, 10);
  };

  const getSlowestResources = () => {
    return [...data.networkRequests].sort((a, b) => b.duration - a.duration).slice(0, 10);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Resource Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {Object.entries(requestsByType).map(([type, requests]: [string, any]) => (
          <Card key={type} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                {getTypeIcon(type)}
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-400 capitalize">{type}</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-100">{requests.length}</p>
                  <p className="text-xs text-slate-500">
                    {(requests.reduce((acc: number, req: any) => acc + req.size, 0) / 1024 / 1024).toFixed(1)}
                    MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="wasm" className="space-y-4">
        <div className="mobile-scroll">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-slate-800/50 border-slate-700 min-w-max lg:min-w-0">
            <TabsTrigger value="wasm" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
              WASM
            </TabsTrigger>
            <TabsTrigger value="glb" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
              3D Models
            </TabsTrigger>
            <TabsTrigger value="largest" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
              Largest
            </TabsTrigger>
            <TabsTrigger value="slowest" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
              Slowest
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="text-xs sm:text-sm data-[state=active]:bg-slate-700">
              Breakdown
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="wasm">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                WebAssembly Modules
              </CardTitle>
              <CardDescription className="text-slate-400">WASM compilation and execution performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.wasmModules.map((module: any, index: number) => (
                  <div key={index} className="border border-slate-600 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-100">{module.name}</h3>
                      <Badge variant="outline" className="border-orange-500 text-orange-400">
                        {(module.size / 1024 / 1024).toFixed(1)}MB
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Load Time</p>
                        <p className="text-slate-100 font-medium">{module.loadTime}ms</p>
                        <Progress value={(module.loadTime / 500) * 100} className="mt-1" />
                      </div>
                      <div>
                        <p className="text-slate-400">Compile Time</p>
                        <p className="text-slate-100 font-medium">{module.compileTime}ms</p>
                        <Progress value={(module.compileTime / 200) * 100} className="mt-1" />
                      </div>
                      <div>
                        <p className="text-slate-400">Instantiate Time</p>
                        <p className="text-slate-100 font-medium">{module.instantiateTime}ms</p>
                        <Progress value={(module.instantiateTime / 100) * 100} className="mt-1" />
                      </div>
                    </div>

                    <div className="bg-slate-700/50 rounded p-3">
                      <p className="text-xs text-slate-400 mb-1">Memory Usage</p>
                      <p className="text-slate-100">{(module.memoryUsage / 1024 / 1024).toFixed(1)}MB</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="glb">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                3D Model Files (GLB)
              </CardTitle>
              <CardDescription className="text-slate-400">3D model complexity and loading performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.glbFiles.map((file: any, index: number) => (
                  <div key={index} className="border border-slate-600 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-100">{file.name}</h3>
                      <Badge variant="outline" className="border-purple-500 text-purple-400">
                        {(file.size / 1024 / 1024).toFixed(1)}MB
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Load Time</p>
                        <p className="text-slate-100 font-medium">{file.loadTime}ms</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Vertices</p>
                        <p className="text-slate-100 font-medium">{file.vertices.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Textures</p>
                        <p className="text-slate-100 font-medium">{file.textures}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Materials</p>
                        <p className="text-slate-100 font-medium">{file.materials}</p>
                      </div>
                    </div>

                    <div className="bg-slate-700/50 rounded p-3">
                      <p className="text-xs text-slate-400 mb-1">Complexity Score</p>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={Math.min(
                            100,
                            ((file.vertices / 1000 + file.textures * 2 + file.materials * 3) / 10) * 100
                          )}
                          className="flex-1"
                        />
                        <span className="text-slate-100 text-sm">
                          {Math.round(((file.vertices / 1000 + file.textures * 2 + file.materials * 3) / 10) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="largest">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Largest Resources</CardTitle>
              <CardDescription className="text-slate-400">Top 10 resources by file size</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getLargestResources().map((resource, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getTypeIcon(resource.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-100 truncate">{resource.url.split("/").pop()}</p>
                        <p className="text-xs text-slate-400">{resource.domain}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {resource.type}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-100">{(resource.size / 1024).toFixed(1)}KB</p>
                      <p className="text-xs text-slate-400">{resource.duration}ms</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slowest">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Slowest Resources</CardTitle>
              <CardDescription className="text-slate-400">Top 10 resources by load time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getSlowestResources().map((resource, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getTypeIcon(resource.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-100 truncate">{resource.url.split("/").pop()}</p>
                        <p className="text-xs text-slate-400">{resource.domain}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {resource.protocol}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-100">{resource.duration}ms</p>
                      <p className="text-xs text-slate-400">{(resource.size / 1024).toFixed(1)}KB</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Resource Type Breakdown</CardTitle>
                <CardDescription className="text-slate-400">Distribution by resource type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(requestsByType).map(([type, requests]: [string, any]) => {
                    const totalSize = requests.reduce((acc: number, req: any) => acc + req.size, 0);
                    const avgDuration =
                      requests.reduce((acc: number, req: any) => acc + req.duration, 0) / requests.length;

                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(type)}
                            <span className="text-sm font-medium text-slate-100 capitalize">{type}</span>
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              {requests.length}
                            </Badge>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-slate-100">{(totalSize / 1024 / 1024).toFixed(1)}MB</p>
                            <p className="text-slate-400">{avgDuration.toFixed(0)}ms avg</p>
                          </div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getTypeColor(type)}`}
                            style={{
                              width: `${(requests.length / data.networkRequests.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Performance Impact</CardTitle>
                <CardDescription className="text-slate-400">Resource impact on page performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                    <h4 className="text-red-400 font-medium mb-2">High Impact Resources</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-red-200">WASM modules: {data.wasmModules.length} files</p>
                      <p className="text-red-200">GLB files: {data.glbFiles.length} files</p>
                      <p className="text-red-200">
                        Large scripts: {requestsByType.script?.filter((r: any) => r.size > 100000).length || 0} files
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
                    <h4 className="text-yellow-400 font-medium mb-2">Medium Impact Resources</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-yellow-200">Images: {requestsByType.image?.length || 0} files</p>
                      <p className="text-yellow-200">Stylesheets: {requestsByType.stylesheet?.length || 0} files</p>
                      <p className="text-yellow-200">
                        XHR/Fetch: {(requestsByType.xhr?.length || 0) + (requestsByType.fetch?.length || 0)} requests
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
                    <h4 className="text-green-400 font-medium mb-2">Low Impact Resources</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-green-200">Fonts: {requestsByType.font?.length || 0} files</p>
                      <p className="text-green-200">Other: {requestsByType.other?.length || 0} files</p>
                      <p className="text-green-200">Documents: {requestsByType.document?.length || 0} files</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
