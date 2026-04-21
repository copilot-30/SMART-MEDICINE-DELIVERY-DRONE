import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"

import { ChallengeSolutionSection } from "./sections/ChallengeSolutionSection"
import { CtaSection } from "./sections/CtaSection"
import { FeaturesSection } from "./sections/FeaturesSection"
import { HeroSection } from "./sections/HeroSection"
import { HowItWorksSection } from "./sections/HowItWorksSection"
import { TrustSection } from "./sections/TrustSection"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <ChallengeSolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TrustSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
