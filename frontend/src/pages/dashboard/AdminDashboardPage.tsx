import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const metrics = [
  { label: "Active drones", value: "12" },
  { label: "Pending missions", value: "8" },
  { label: "Deliveries today", value: "46" },
  { label: "Avg ETA", value: "14 min" },
]

const missionQueue = [
  { id: "MSN-2181", hospital: "City General", priority: "High", status: "Awaiting dispatch" },
  { id: "MSN-2182", hospital: "North Clinic", priority: "Medium", status: "Loading package" },
  { id: "MSN-2183", hospital: "St. Luke Outpost", priority: "High", status: "Route optimized" },
]

export function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Admin dashboard</p>
            <h1 className="text-3xl font-semibold tracking-tight">Operations overview</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className={cn(buttonVariants({ variant: "outline" }))}>
              Back to landing
            </Link>
            <Button>Create mission</Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">{metric.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mission queue</CardTitle>
            <Badge variant="secondary">Live</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {missionQueue.map((mission) => (
              <div key={mission.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
                <div>
                  <p className="font-medium">{mission.id}</p>
                  <p className="text-sm text-muted-foreground">{mission.hospital}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{mission.priority}</Badge>
                  <Badge>{mission.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
