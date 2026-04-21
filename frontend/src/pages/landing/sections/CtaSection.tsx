import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="rounded-2xl border bg-secondary/50 px-6 py-10 text-center md:px-10 md:py-14">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Ready to launch your medicine delivery network?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
            Deploy safer and faster emergency medicine operations with a platform built for hospitals, pharmacies, and logistics teams.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg">
              Book a technical walkthrough
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline">
              Download capability brief
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
