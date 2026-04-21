import { SectionHeader } from "@/components/common/SectionHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { features } from "@/pages/landing/content"

export function FeaturesSection() {
  return (
    <section className="border-b py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Platform capabilities"
          title="Built for mission-critical healthcare logistics"
          description="Everything from dispatch to proof-of-delivery is designed for safety, speed, and operational control."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <span className="grid size-9 place-content-center rounded-md bg-secondary">
                      <Icon className="size-5" />
                    </span>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
