import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-content-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">SM</span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Smart Medicine Drone</p>
            <p className="text-xs text-muted-foreground">Emergency logistics platform</p>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Badge variant="secondary">Live Pilot Program</Badge>
          <Link to="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Log in
          </Link>
          <Link to="/signup" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Sign up
          </Link>
          <Button>Request Demo</Button>
        </div>
      </div>
    </header>
  )
}
