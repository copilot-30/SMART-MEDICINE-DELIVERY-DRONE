import "./App.css"

import { TooltipProvider } from "@/components/ui/tooltip"
import { AdminDashboardPage } from "@/pages/dashboard/AdminDashboardPage"
import { ReceiverDashboardPage } from "@/pages/dashboard/ReceiverDashboardPage"
import { LoginPage } from "@/pages/auth/LoginPage"
import { LandingPage } from "@/pages/landing/LandingPage"
import { SignupPage } from "@/pages/auth/SignupPage"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

export default function App() {
	return (
		<TooltipProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/dashboard/admin" element={<AdminDashboardPage />} />
					<Route path="/dashboard/receiver" element={<ReceiverDashboardPage />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	)
}
