
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">SRMC Optometry Camp Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email} ({user?.role})
            </p>
          </div>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
          <p className="text-muted-foreground">
            This is the dashboard for {user?.role === "admin" ? "administrators" : "students"}.
          </p>
          
          {user?.role === "admin" && (
            <div className="mt-4 p-4 bg-primary/10 rounded-md">
              <h3 className="font-semibold text-primary">Admin Features</h3>
              <p>As an admin, you can manage camps, assign students, and view analytics.</p>
            </div>
          )}
          
          {user?.role === "student" && (
            <div className="mt-4 p-4 bg-primary/10 rounded-md">
              <h3 className="font-semibold text-primary">Student Features</h3>
              <p>As a student, you can view assigned camps and record patient data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
