import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import LabReportDemo from "./pages/LabReportDemo";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import SummaryMetricsPage from "./pages/SummaryMetricsPage";
import Hospitals from "./pages/Hospitals";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(saved);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/info" element={<Landing />} />
            <Route path="/" element={<Index />} />
            <Route path="/lab-report-demo/:labResultId" element={<LabReportDemo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/users" element={<Users />} />
            <Route path="/summary-metrics" element={<SummaryMetricsPage />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
  
export default App;
