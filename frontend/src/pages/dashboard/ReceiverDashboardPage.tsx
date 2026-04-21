import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const deliveries = [
  { id: "PKG-901", medicine: "Insulin pack", eta: "8 min", progress: 76 },
  { id: "PKG-902", medicine: "Emergency antibiotics", eta: "13 min", progress: 48 },
]

export function ReceiverDashboardPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Receiver dashboard</p>
            <h1 className="text-3xl font-semibold tracking-tight">Incoming deliveries</h1>
          </div>
          <Link to="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to landing
          </Link>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Delivery status board</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deliveries.map((item) => (
              <div key={item.id} className="rounded-md border p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{item.id}</p>
                    <p className="text-sm text-muted-foreground">{item.medicine}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">ETA {item.eta}</Badge>
                    <Badge>In transit</Badge>
                  </div>
                </div>
                <Progress value={item.progress} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
