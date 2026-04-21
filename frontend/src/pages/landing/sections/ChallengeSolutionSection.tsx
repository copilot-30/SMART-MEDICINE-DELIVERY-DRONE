import { CheckCircle2, AlertTriangle } from "lucide-react"

import { SectionHeader } from "@/components/common/SectionHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { outcomes, painPoints } from "@/pages/landing/content"

export function ChallengeSolutionSection() {
  return (
    <section className="border-b py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Why it matters"
          title="Critical medicine should move at emergency speed"
          description="We remove traffic, terrain, and handoff friction from healthcare delivery.
"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="size-5 text-amber-500" />
                Current delivery challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {painPoints.map((item) => (
                  <li key={item} className="text-muted-foreground">
                    • {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="size-5 text-emerald-500" />
                What the platform unlocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {outcomes.map((item) => (
                  <li key={item} className="text-muted-foreground">
                    • {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
