import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import LabReportDemo from "./pages/LabReportDemo";
import GenomicReport from "./pages/GenomicReport";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import SummaryMetricsPage from "./pages/SummaryMetricsPage";
import Hospitals from "./pages/Hospitals";
import Landing from "./pages/Landing";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";

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
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/info" element={<Landing />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lab-report-demo/:labResultId"
              element={
                <ProtectedRoute>
                  <LabReportDemo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/genomic-report/:id"
              element={
                <ProtectedRoute>
                  <GenomicReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/summary-metrics"
              element={
                <ProtectedRoute>
                  <SummaryMetricsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospitals"
              element={
                <ProtectedRoute>
                  <Hospitals />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
  
export default App;
