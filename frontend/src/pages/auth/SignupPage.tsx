import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function SignupPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-6 md:py-16">
      <div className="mx-auto w-full max-w-md space-y-4">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Smart Medicine Drone
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign up</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>Register as an admin or receiver to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@hospital.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create a strong password" />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Link to="/dashboard/admin" className={cn(buttonVariants({ variant: "default" }))}>
                Create Admin Account
              </Link>
              <Link to="/dashboard/receiver" className={cn(buttonVariants({ variant: "secondary" }))}>
                Create Receiver Account
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
