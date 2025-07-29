"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Bar, BarChart, Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"

interface PerformanceChartsProps {
  data: any
}

export default function PerformanceCharts({ data }: PerformanceChartsProps) {
  // Generate sample chart data based on the performance profile
  const timelineData = [
    { time: 0, cpu: 0, memory: 45, network: 0 },
    { time: 200, cpu: 15, memory: 48, network: 25 },
    { time: 400, cpu: 45, memory: 52, network: 60 },
    { time: 600, cpu: 78, memory: 58, network: 40 },
    { time: 800, cpu: 65, memory: 62, network: 20 },
    { time: 1000, cpu: 35, memory: 55, network: 15 },
    { time: 1200, cpu: 25, memory: 50, network: 10 },
    { time: 1400, cpu: 20, memory: 48, network: 5 },
    { time: 1600, cpu: 15, memory: 46, network: 0 },
    { time: 1800, cpu: 10, memory: 45, network: 0 },
    { time: 2000, cpu: 8, memory: 44, network: 0 },
  ]

  const metricsData = [
    { metric: "FCP", value: 800, threshold: 1800, status: "good" },
    {
      metric: "LCP",
      value: 1800,
      threshold: 2500,
      status: "needs-improvement",
    },
    { metric: "FID", value: 50, threshold: 100, status: "good" },
    { metric: "CLS", value: 0.15, threshold: 0.1, status: "poor" },
    { metric: "TTFB", value: 200, threshold: 800, status: "good" },
  ]

  const networkData = [
    { resource: "HTML", size: 15, time: 200 },
    { resource: "CSS", size: 45, time: 150 },
    { resource: "JS", size: 280, time: 400 },
    { resource: "Images", size: 520, time: 600 },
    { resource: "Fonts", size: 85, time: 300 },
    { resource: "API", size: 12, time: 180 },
  ]

  return (
    <div className="grid gap-6">
      {/* CPU, Memory, and Network Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Timeline</CardTitle>
          <CardDescription>CPU usage, memory consumption, and network activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              cpu: {
                label: "CPU Usage (%)",
                color: "hsl(var(--chart-1))",
              },
              memory: {
                label: "Memory (MB)",
                color: "hsl(var(--chart-2))",
              },
              network: {
                label: "Network (KB/s)",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[400px]"
          >
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(value) => `${value}ms`} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="cpu" stroke="var(--color-cpu)" strokeWidth={2} />
              <Line type="monotone" dataKey="memory" stroke="var(--color-memory)" strokeWidth={2} />
              <Line type="monotone" dataKey="network" stroke="var(--color-network)" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Web Vitals */}
        <Card>
          <CardHeader>
            <CardTitle>Core Web Vitals</CardTitle>
            <CardDescription>Key performance metrics that impact user experience</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Value",
                  color: "hsl(var(--chart-1))",
                },
                threshold: {
                  label: "Threshold",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={metricsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="metric" type="category" width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" />
                <Bar dataKey="threshold" fill="var(--color-threshold)" opacity={0.3} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Network Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Loading</CardTitle>
            <CardDescription>Size and loading time of different resource types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                size: {
                  label: "Size (KB)",
                  color: "hsl(var(--chart-1))",
                },
                time: {
                  label: "Load Time (ms)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="resource" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="size" fill="var(--color-size)" />
                <Bar dataKey="time" fill="var(--color-time)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* CPU Usage Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>CPU Usage Distribution</CardTitle>
          <CardDescription>Detailed view of CPU usage patterns during page load</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              cpu: {
                label: "CPU Usage (%)",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]"
          >
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(value) => `${value}ms`} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="cpu" stroke="var(--color-cpu)" fill="var(--color-cpu)" fillOpacity={0.3} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
