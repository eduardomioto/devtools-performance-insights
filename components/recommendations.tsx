"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Lightbulb, Target, Zap, Code2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RecommendationsProps {
  data: any
}

interface Recommendation {
  id: string
  title: string
  priority: "high" | "medium" | "low"
  category: string
  description: string
  implementation: string[]
  expectedImprovement: string
  difficulty: "easy" | "medium" | "hard"
  icon: React.ReactNode
}

export default function Recommendations({ data }: RecommendationsProps) {
  const recommendations: Recommendation[] = [
    {
      id: "1",
      title: "Implement Code Splitting",
      priority: "high",
      category: "JavaScript",
      description: "Split your JavaScript bundle into smaller chunks to reduce initial load time",
      implementation: [
        "Use dynamic imports for route-based code splitting",
        "Implement component-level lazy loading",
        "Configure webpack bundle splitting",
        "Use React.lazy() for component splitting",
      ],
      expectedImprovement: "Reduce FCP by 30-40% (~400ms)",
      difficulty: "medium",
      icon: <Code2 className="w-4 h-4" />,
    },
    {
      id: "2",
      title: "Optimize Images",
      priority: "high",
      category: "Images",
      description: "Compress and serve images in modern formats with proper sizing",
      implementation: [
        "Convert images to WebP/AVIF format",
        "Implement responsive images with srcset",
        "Use image compression tools",
        "Add lazy loading for below-the-fold images",
      ],
      expectedImprovement: "Reduce LCP by 25-35% (~600ms)",
      difficulty: "easy",
      icon: <Target className="w-4 h-4" />,
    },
    {
      id: "3",
      title: "Eliminate Render-Blocking Resources",
      priority: "high",
      category: "CSS",
      description: "Optimize CSS delivery to prevent blocking of page rendering",
      implementation: [
        "Inline critical CSS in HTML head",
        "Load non-critical CSS asynchronously",
        "Remove unused CSS rules",
        "Use media queries for conditional CSS loading",
      ],
      expectedImprovement: "Improve FCP by 15-25% (~200ms)",
      difficulty: "medium",
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: "4",
      title: "Fix Layout Shifts",
      priority: "medium",
      category: "Layout",
      description: "Prevent unexpected layout shifts during page load",
      implementation: [
        "Set explicit dimensions for images and videos",
        "Reserve space for dynamic content",
        "Use CSS aspect-ratio property",
        "Avoid inserting content above existing content",
      ],
      expectedImprovement: "Reduce CLS from 0.15 to <0.1",
      difficulty: "easy",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      id: "5",
      title: "Optimize JavaScript Execution",
      priority: "medium",
      category: "JavaScript",
      description: "Reduce main thread blocking and improve responsiveness",
      implementation: [
        "Break up long-running tasks",
        "Use web workers for heavy computations",
        "Implement requestIdleCallback for non-critical work",
        "Optimize third-party scripts loading",
      ],
      expectedImprovement: "Reduce FID by 20-30ms",
      difficulty: "hard",
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      id: "6",
      title: "Add Resource Hints",
      priority: "low",
      category: "HTML",
      description: "Use preload, prefetch, and preconnect to optimize resource loading",
      implementation: [
        "Add preload hints for critical resources",
        "Use prefetch for next-page resources",
        "Implement preconnect for external domains",
        "Add dns-prefetch for third-party domains",
      ],
      expectedImprovement: "Improve perceived performance by 10-15%",
      difficulty: "easy",
      icon: <ArrowRight className="w-4 h-4" />,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const highPriorityRecs = recommendations.filter((r) => r.priority === "high")
  const mediumPriorityRecs = recommendations.filter((r) => r.priority === "medium")
  const lowPriorityRecs = recommendations.filter((r) => r.priority === "low")

  const quickWins = recommendations.filter((r) => r.difficulty === "easy")
  const impactfulChanges = recommendations.filter((r) => r.priority === "high")

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Performance Optimization Roadmap
          </CardTitle>
          <CardDescription>Prioritized recommendations to improve your application's performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{highPriorityRecs.length}</div>
              <div className="text-sm text-red-700">High Priority</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{mediumPriorityRecs.length}</div>
              <div className="text-sm text-yellow-700">Medium Priority</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{quickWins.length}</div>
              <div className="text-sm text-green-700">Quick Wins</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Tabs */}
      <Tabs defaultValue="priority" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="priority">By Priority</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="quick-wins">Quick Wins</TabsTrigger>
        </TabsList>

        <TabsContent value="priority" className="space-y-4">
          {/* High Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">High Priority Recommendations</CardTitle>
              <CardDescription>Address these issues first for maximum impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highPriorityRecs.map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medium Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-600">Medium Priority Recommendations</CardTitle>
              <CardDescription>Important optimizations for continued improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mediumPriorityRecs.map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-600">Low Priority Recommendations</CardTitle>
              <CardDescription>Nice-to-have optimizations for polish</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowPriorityRecs.map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          {["JavaScript", "Images", "CSS", "Layout", "HTML"].map((category) => {
            const categoryRecs = recommendations.filter((r) => r.category === category)
            if (categoryRecs.length === 0) return null

            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category} Optimizations</CardTitle>
                  <CardDescription>{categoryRecs.length} recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryRecs.map((rec) => (
                      <RecommendationCard key={rec.id} recommendation={rec} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="quick-wins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Quick Wins</CardTitle>
              <CardDescription>Easy to implement optimizations with good impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quickWins.map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {recommendation.icon}
          <h3 className="font-semibold">{recommendation.title}</h3>
          <Badge variant={getPriorityColor(recommendation.priority) as any}>
            {recommendation.priority.toUpperCase()}
          </Badge>
          <Badge variant="outline">{recommendation.category}</Badge>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recommendation.difficulty)}`}
          >
            {recommendation.difficulty}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600">{recommendation.description}</p>

      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <p className="text-sm text-blue-800 font-medium mb-2">Expected Improvement:</p>
        <p className="text-sm text-blue-700">{recommendation.expectedImprovement}</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Implementation Steps:</p>
        <ul className="text-sm text-gray-600 space-y-1">
          {recommendation.implementation.map((step, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
