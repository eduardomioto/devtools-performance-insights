"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getCriticalIssuesCount } from "@/lib/performance-utils";
import type { ComplexPerformanceData } from "@/types/profiling-type";

interface CriticalIssuesAlertProps {
  data: ComplexPerformanceData;
  onViewDetails: () => void;
}

export function CriticalIssuesAlert({ data, onViewDetails }: CriticalIssuesAlertProps) {
  const criticalIssuesCount = getCriticalIssuesCount(data);

  if (criticalIssuesCount === 0) return null;

  return (
    <Alert className="bg-red-900/20 border-red-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-red-200">
        <strong>{criticalIssuesCount} critical performance issues</strong> detected that may significantly impact user
        experience.
        <Button variant="link" className="text-red-300 p-0 ml-2 h-auto" onClick={onViewDetails}>
          View Details →
        </Button>
      </AlertDescription>
    </Alert>
  );
}
