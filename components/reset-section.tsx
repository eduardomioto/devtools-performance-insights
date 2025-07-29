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
    <Card className="bg-slate-800/30 border-slate-700">
      <CardContent className="p-4 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="text-sm text-slate-400">Analysis complete • {requestCount} requests processed</div>
          <Button
            variant="outline"
            onClick={onReset}
            className="bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600"
          >
            <Upload className="w-4 h-4 mr-2" />
            Analyze New Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
