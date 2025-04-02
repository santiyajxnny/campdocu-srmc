
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import DashboardPage from "./pages/DashboardPage";
import CreateCampPage from "./pages/CreateCampPage";
import PatientEntryPage from "./pages/PatientEntryPage";
import CampDetailsPage from "./pages/CampDetailsPage";
import SettingsPage from "./pages/SettingsPage";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-camp"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <CreateCampPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/camp/:campId"
                  element={
                    <ProtectedRoute>
                      <CampDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient-entry/:campId"
                  element={
                    <ProtectedRoute>
                      <PatientEntryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient-entry/:campId/:patientId"
                  element={
                    <ProtectedRoute>
                      <PatientEntryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
