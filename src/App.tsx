import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Training from "./pages/Training";
import Profile from "./pages/Profile";
import LiveRun from "./pages/LiveRun";
import ShareRun from "./pages/ShareRun";
import Goals from "./pages/Goals";
import SafetyMap from "./pages/safety/SafetyMap";
import ReportRisk from "./pages/safety/ReportRisk";
import RiskIntel from "./pages/safety/RiskIntel";
import PlanSafeRoute from "./pages/safety/PlanSafeRoute";
import NotFound from "./pages/NotFound";
import CreateAccount from "./pages/auth/CreateAccount";
import Login from "./pages/auth/Login";
import { AuthGuard } from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/auth/register" element={<CreateAccount />} />
          <Route path="/auth/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/explore" element={<AuthGuard><Explore /></AuthGuard>} />
          <Route path="/training" element={<AuthGuard><Training /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="/run" element={<AuthGuard><LiveRun /></AuthGuard>} />
          <Route path="/share/:id" element={<AuthGuard><ShareRun /></AuthGuard>} />
          <Route path="/goals" element={<AuthGuard><Goals /></AuthGuard>} />

          <Route path="/safety" element={<AuthGuard><SafetyMap /></AuthGuard>} />
          <Route path="/safety/report" element={<AuthGuard><ReportRisk /></AuthGuard>} />
          <Route path="/safety/risk/:id" element={<AuthGuard><RiskIntel /></AuthGuard>} />
          <Route path="/safety/plan" element={<AuthGuard><PlanSafeRoute /></AuthGuard>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
