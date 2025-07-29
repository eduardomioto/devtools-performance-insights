"use client";

import type React from "react";

import { useState } from "react";
import { generateComplexSampleData } from "@/lib/sample-data";
import { processRealPerformanceData } from "@/lib/data-processing";
import type { ComplexPerformanceData } from "@/types/profiling-type";

export function usePerformanceData() {
  const [performanceData, setPerformanceData] = useState<ComplexPerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const text = await file.text();
      const data = JSON.parse(text);

      // Enhanced validation for Chrome performance profiles
      if (!data.traceEvents && !data.metadata) {
        throw new Error("Invalid Chrome performance profile format");
      }

      // Process the actual uploaded data
      const processedData = processRealPerformanceData(data);
      setPerformanceData(processedData);
      setUploadProgress(100);
    } catch (err) {
      setError("Failed to parse performance profile. Please ensure it's a valid Chrome DevTools performance profile.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleComplexSampleData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const complexSampleData = generateComplexSampleData();
      setPerformanceData(complexSampleData);
      setIsLoading(false);
    }, 1500);
  };

  const resetData = () => {
    setPerformanceData(null);
    setError(null);
    setUploadProgress(0);
  };

  return {
    performanceData,
    isLoading,
    error,
    uploadProgress,
    handleFileUpload,
    handleComplexSampleData,
    resetData,
  };
}
