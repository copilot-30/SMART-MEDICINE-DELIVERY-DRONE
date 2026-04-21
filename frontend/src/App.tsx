import "./App.css"

import { TooltipProvider } from "@/components/ui/tooltip"
import { LandingPage } from "@/pages/landing/LandingPage"

export default function App() {
	return (
		<TooltipProvider>
			<LandingPage />
		</TooltipProvider>
	)
}
