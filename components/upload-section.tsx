"use client";

import type React from "react";

import { Upload, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface UploadSectionProps {
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSample: () => void;
}

export function UploadSection({ isLoading, error, uploadProgress, onFileUpload, onLoadSample }: UploadSectionProps) {
  return (
    <Card className="max-w-2xl mx-auto bg-slate-800/50 border-slate-700 shadow-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-slate-100">
          <Upload className="w-5 h-5" />
          Upload Performance Profile
        </CardTitle>
        <CardDescription className="text-slate-400">
          Chrome DevTools performance profile with complex web applications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="profile-upload" className="text-slate-200 font-medium">
            Performance Profile (.json)
          </Label>
          <div className="relative">
            <Input
              id="profile-upload"
              type="file"
              accept=".json"
              onChange={onFileUpload}
              disabled={isLoading}
              className="bg-slate-700 border-slate-600 text-slate-100 file:bg-slate-600 file:text-slate-100 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div
                className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            )}
          </div>
          <div className="text-xs text-slate-500 space-y-1">
            <p>• Export from Chrome DevTools → Performance tab → Export</p>
            <p>• Supports profiles with WASM, WebGL, and complex network patterns</p>
            <p>• File size limit: 50MB</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-800 px-2 text-slate-400">Or</span>
          </div>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-slate-400">Explore with complex sample data</p>
          <Button
            variant="outline"
            onClick={onLoadSample}
            disabled={isLoading}
            className="bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                Loading Sample...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Load Complex Sample
              </>
            )}
          </Button>
          <div className="text-xs text-slate-500">Includes: 247 requests, 3 WASM modules, 4 GLB files, 5 domains</div>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="text-center py-6 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Processing performance data...</p>
              <div className="flex justify-center space-x-1">
                <Skeleton className="h-2 w-16 bg-slate-700" />
                <Skeleton className="h-2 w-12 bg-slate-700" />
                <Skeleton className="h-2 w-20 bg-slate-700" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
