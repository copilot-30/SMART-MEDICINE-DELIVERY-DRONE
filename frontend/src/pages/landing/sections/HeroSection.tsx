import heroImage from "@/assets/hero.png"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { heroStats } from "@/pages/landing/content"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Healthcare Logistics Reimagined
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Deliver life-saving medicine faster with autonomous drones.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-muted-foreground md:text-lg">
            Smart Medicine Delivery Drone helps hospitals and pharmacies ship urgent medication in minutes with real-time tracking and mission-grade safety checks.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg">Start a mission</Button>
            <Button size="lg" variant="outline">
              See platform overview
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <img
              src={heroImage}
              alt="Smart medicine delivery drone in flight"
              className="h-72 w-full object-cover md:h-[26rem]"
            />
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-16 md:grid-cols-3 md:px-6">
        {heroStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="py-6">
              <p className="text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
