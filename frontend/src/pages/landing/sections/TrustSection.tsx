import { ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { trustItems } from "@/pages/landing/content"

export function TrustSection() {
  return (
    <section className="border-b py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <Card className="overflow-hidden">
          <CardContent className="grid gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:p-10">
            <div>
              <Badge variant="secondary" className="mb-4">
                Compliance & Security
              </Badge>
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                Built with healthcare-grade trust by design
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                The system includes tamper-resistant payload control, encrypted mission telemetry, and complete operational audit trails.
              </p>
            </div>

            <ul className="space-y-3">
              {trustItems.map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 rounded-lg border px-4 py-3"
                  >
                    <ShieldCheck className="size-4 text-emerald-500" />
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
