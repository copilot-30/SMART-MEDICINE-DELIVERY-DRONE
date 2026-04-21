import type { LucideIcon } from "lucide-react"
import {
  Activity,
  BatteryCharging,
  MapPinned,
  PackageCheck,
  Radar,
  ShieldCheck,
  Timer,
  Wifi,
} from "lucide-react"

interface Stat {
  label: string
  value: string
}

interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

interface TimelineStep {
  title: string
  description: string
}

interface TrustItem {
  label: string
  icon: LucideIcon
}

export const heroStats: Stat[] = [
  { label: "Avg. delivery time", value: "14 min" },
  { label: "Flight reliability", value: "99.2%" },
  { label: "Coverage radius", value: "45 km" },
]

export const features: Feature[] = [
  {
    title: "Autonomous route intelligence",
    description:
      "Real-time obstacle avoidance and dynamic rerouting ensure urgent payloads arrive safely.",
    icon: Radar,
  },
  {
    title: "Temperature-safe payload box",
    description:
      "Medical-grade compartment keeps sensitive medicine stable from dispatch to doorstep.",
    icon: ShieldCheck,
  },
  {
    title: "Live mission visibility",
    description:
      "Track every dispatch with GPS telemetry, ETA updates, and delivery proof.",
    icon: MapPinned,
  },
  {
    title: "Rapid turnaround ops",
    description:
      "Fast battery swap and automated checks reduce downtime between critical missions.",
    icon: BatteryCharging,
  },
]

export const painPoints: string[] = [
  "Road traffic delays emergency medicine by hours.",
  "Remote clinics struggle to maintain consistent stock.",
  "Manual dispatching creates avoidable handoff errors.",
]

export const outcomes: string[] = [
  "Reduce critical medicine wait times by up to 80%.",
  "Deliver to hard-to-reach areas in all-day windows.",
  "Automate mission logs for compliance and analytics.",
]

export const timeline: TimelineStep[] = [
  {
    title: "Request submitted",
    description: "A hospital or pharmacy places a mission request through the dispatch dashboard.",
  },
  {
    title: "Drone prepared",
    description: "Payload is sealed, verified, and assigned to the nearest available smart dock.",
  },
  {
    title: "Autonomous flight",
    description: "The drone follows a secure corridor with live telemetry and safety monitoring.",
  },
  {
    title: "Proof of delivery",
    description: "Recipient confirms delivery, and mission records are saved automatically.",
  },
]

export const trustItems: TrustItem[] = [
  { label: "End-to-end encrypted telemetry", icon: Wifi },
  { label: "Cold-chain compliance monitoring", icon: Activity },
  { label: "Smart lock and recipient verification", icon: PackageCheck },
  { label: "Mission SLA tracking and alerts", icon: Timer },
]
