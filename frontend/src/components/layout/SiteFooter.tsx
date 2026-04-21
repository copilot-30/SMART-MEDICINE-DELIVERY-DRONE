export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <p>© {new Date().getFullYear()} Smart Medicine Delivery Drone.</p>
        <p>Built for healthcare speed, safety, and reliability.</p>
      </div>
    </footer>
  )
}
