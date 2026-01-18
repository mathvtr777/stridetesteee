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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/training" element={<Training />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/run" element={<LiveRun />} />
          <Route path="/share/:id" element={<ShareRun />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/safety" element={<SafetyMap />} />
          <Route path="/safety/report" element={<ReportRisk />} />
          <Route path="/safety/risk/:id" element={<RiskIntel />} />
          <Route path="/safety/plan" element={<PlanSafeRoute />} />
          <Route path="/auth/register" element={<CreateAccount />} />
          <Route path="/auth/login" element={<Login />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
