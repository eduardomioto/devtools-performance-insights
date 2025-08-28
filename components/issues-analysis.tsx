"use client";

import type React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Clock, Zap, ImageIcon, Code, Wifi } from "lucide-react";

interface IssuesAnalysisProps {
  data: any;
}

interface Issue {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  category: string;
  description: string;
  impact: string;
  metric: string;
  icon: React.ReactNode;
}

export default function IssuesAnalysis({ data }: IssuesAnalysisProps) {
  const issues: Issue[] = [
    {
      id: "1",
      title: "Large JavaScript Bundle",
      severity: "high",
      category: "JavaScript",
      description: "Main JavaScript bundle is 280KB, causing slow initial load times",
      impact: "Delays First Contentful Paint by ~400ms",
      metric: "Bundle Size: 280KB",
      icon: <Code className="h-4 w-4" />,
    },
    {
      id: "2",
      title: "Unoptimized Images",
      severity: "high",
      category: "Images",
      description: "Large images without proper compression and modern formats",
      impact: "Increases Largest Contentful Paint by ~600ms",
      metric: "Total Image Size: 520KB",
      icon: <ImageIcon className="h-4 w-4" />,
    },
    {
      id: "3",
      title: "Cumulative Layout Shift",
      severity: "medium",
      category: "Layout",
      description: "Elements shifting during page load causing poor user experience",
      impact: "CLS score of 0.15 (above recommended 0.1)",
      metric: "CLS: 0.15",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: "4",
      title: "Render-Blocking Resources",
      severity: "medium",
      category: "CSS",
      description: "CSS files blocking the rendering of above-the-fold content",
      impact: "Delays First Contentful Paint",
      metric: "3 blocking resources",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: "5",
      title: "Long Tasks",
      severity: "medium",
      category: "JavaScript",
      description: "JavaScript execution blocking the main thread for extended periods",
      impact: "Potential input delay and poor responsiveness",
      metric: "2 tasks > 50ms",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      id: "6",
      title: "Inefficient Network Usage",
      severity: "low",
      category: "Network",
      description: "Multiple small requests instead of bundled resources",
      impact: "Increased connection overhead",
      metric: "12 HTTP requests",
      icon: <Wifi className="h-4 w-4" />,
    },
    {
      id: "7",
      title: "Missing Resource Hints",
      severity: "low",
      category: "HTML",
      description: "No preload or prefetch hints for critical resources",
      impact: "Missed optimization opportunities",
      metric: "0 resource hints",
      icon: <Clock className="h-4 w-4" />,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getSeverityScore = (severity: string) => {
    switch (severity) {
      case "high":
        return 90;
      case "medium":
        return 60;
      case "low":
        return 30;
      default:
        return 0;
    }
  };

  const categoryStats = issues.reduce(
    (acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {issues.filter((i) => i.severity === "high").length}
              </div>
              <div className="text-sm text-gray-600">High Priority Issues</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {issues.filter((i) => i.severity === "medium").length}
              </div>
              <div className="text-sm text-gray-600">Medium Priority Issues</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {issues.filter((i) => i.severity === "low").length}
              </div>
              <div className="text-sm text-gray-600">Low Priority Issues</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Issues by Category</CardTitle>
          <CardDescription>Distribution of performance issues across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{category}</span>
                  <Badge variant="outline">{count} issues</Badge>
                </div>
                <Progress value={(count / issues.length) * 100} className="w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Issues Analysis</CardTitle>
          <CardDescription>Complete list of identified performance issues with impact assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issues.map((issue) => (
              <div key={issue.id} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {issue.icon}
                    <h3 className="font-semibold">{issue.title}</h3>
                    <Badge variant={getSeverityColor(issue.severity) as any}>{issue.severity.toUpperCase()}</Badge>
                    <Badge variant="outline">{issue.category}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{issue.metric}</div>
                    <Progress value={getSeverityScore(issue.severity)} className="mt-1 w-20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{issue.description}</p>
                  <div className="rounded border border-orange-200 bg-orange-50 p-2">
                    <p className="text-sm text-orange-800">
                      <strong>Impact:</strong> {issue.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
