"use client";

import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResetSectionProps {
  requestCount: number;
  onReset: () => void;
}

export function ResetSection({ requestCount, onReset }: ResetSectionProps) {
  return (
    <Card className="border-slate-700 bg-slate-800/30">
      <CardContent className="p-4 text-center">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="text-sm text-slate-400">Analysis complete • {requestCount} requests processed</div>
          <Button
            variant="outline"
            onClick={onReset}
            className="border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600"
          >
            <Upload className="mr-2 h-4 w-4" />
            Analyze New Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
