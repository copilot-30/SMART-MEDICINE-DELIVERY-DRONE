import { SectionHeader } from "@/components/common/SectionHeader"
import { Card, CardContent } from "@/components/ui/card"
import { timeline } from "@/pages/landing/content"

export function HowItWorksSection() {
  return (
    <section className="border-b py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="How it works"
          title="From request to delivery in four secure steps"
          description="A streamlined flow that keeps operators informed and recipients safe."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {timeline.map((step, index) => (
            <Card key={step.title}>
              <CardContent className="pt-6">
                <p className="text-sm font-semibold text-muted-foreground">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
