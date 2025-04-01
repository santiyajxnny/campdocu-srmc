
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, PlusCircle, Calendar, Users, FileText, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  // Mock camp data
  const camps = [
    {
      id: "1",
      name: "Rural Eye Camp - April 2025",
      location: "Kanchipuram District",
      date: "4/15/2025",
      description: "Monthly eye screening for rural communities",
      patients: 45
    },
    {
      id: "2",
      name: "School Screening - March 2025",
      location: "Chennai Public School",
      date: "3/20/2025",
      description: "Vision screening for school children",
      patients: 112
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">SRMC Optometry Camp Management</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email} ({user?.role})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">{user?.email} ({user?.role})</span>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Eye Camp Dashboard</h2>
            <div className="flex gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/patient-entry">
                  <UserPlus className="mr-2 h-5 w-5" /> Add New Patient
                </Link>
              </Button>
              {user?.role === "admin" && (
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link to="/create-camp">
                    <PlusCircle className="mr-2 h-5 w-5" /> Create New Camp
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg shadow-md p-6 flex items-center">
              <Calendar className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <p className="text-muted-foreground">Total Camps</p>
                <h3 className="text-3xl font-bold">{camps.length}</h3>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 flex items-center">
              <Users className="h-10 w-10 text-green-500 mr-4" />
              <div>
                <p className="text-muted-foreground">Total Patients</p>
                <h3 className="text-3xl font-bold">
                  {camps.reduce((acc, camp) => acc + camp.patients, 0)}
                </h3>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 flex items-center">
              <FileText className="h-10 w-10 text-purple-500 mr-4" />
              <div>
                <p className="text-muted-foreground">Pending Documentation</p>
                <h3 className="text-3xl font-bold">1</h3>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">My Eye Camps</h2>
            <div className="space-y-4">
              {camps.map((camp) => (
                <div key={camp.id} className="bg-card rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{camp.name}</h3>
                      <p className="text-muted-foreground">
                        {camp.location} • {camp.date}
                      </p>
                      <p className="mt-2">{camp.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Patients</p>
                      <p className="text-xl font-bold">{camp.patients}</p>
                      <Button className="mt-3" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
