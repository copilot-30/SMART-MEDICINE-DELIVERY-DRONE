import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function LoginPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-6 md:py-16">
      <div className="mx-auto w-full max-w-md space-y-4">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Smart Medicine Drone
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Log in</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Use your account to access mission dashboards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@hospital.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            <div>
              <Link to="/dashboard/admin" className={cn(buttonVariants({ variant: "default" }), "w-full")}>
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="font-medium text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
