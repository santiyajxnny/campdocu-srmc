
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LogOut, 
  PlusCircle, 
  Calendar, 
  Users, 
  FileText, 
  UserPlus, 
  MapPin,
  Filter,
  ChevronDown,
  ChartBar,
  ChartPie
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  LineChart,
  Line
} from "recharts";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterStudent, setFilterStudent] = useState("all");

  // Mock camp data with additional metrics
  const camps = [
    {
      id: "1",
      name: "Rural Eye Camp - April 2025",
      location: "Kanchipuram District",
      date: "4/15/2025",
      description: "Monthly eye screening for rural communities",
      patients: 45,
      latitude: 12.8342,
      longitude: 79.7036,
      students: ["Aarav Singh", "Priya Patel"],
      diagnoses: {
        "Refractive Error": 23,
        "Cataract": 8,
        "Glaucoma": 4,
        "Diabetic Retinopathy": 3,
        "Other": 7
      },
      outcomes: {
        "Prescription": 32,
        "Referral": 13
      }
    },
    {
      id: "2",
      name: "School Screening - March 2025",
      location: "Chennai Public School",
      date: "3/20/2025",
      description: "Vision screening for school children",
      patients: 112,
      latitude: 13.0827,
      longitude: 80.2707,
      students: ["Rahul Kumar", "Ananya Sharma", "Vikram Mehta"],
      diagnoses: {
        "Refractive Error": 78,
        "Amblyopia": 12,
        "Strabismus": 5,
        "Conjunctivitis": 10,
        "Other": 7
      },
      outcomes: {
        "Prescription": 92,
        "Referral": 20
      }
    },
    {
      id: "3",
      name: "Corporate Eye Camp - February 2025",
      location: "TechSpace Solutions",
      date: "2/10/2025",
      description: "Vision checkup for corporate employees",
      patients: 68,
      latitude: 12.9716,
      longitude: 77.5946,
      students: ["Aarav Singh", "Neha Reddy"],
      diagnoses: {
        "Refractive Error": 42,
        "Computer Vision Syndrome": 15,
        "Dry Eye": 8,
        "Other": 3
      },
      outcomes: {
        "Prescription": 58,
        "Referral": 10
      }
    },
    {
      id: "4",
      name: "Rural Outreach - January 2025",
      location: "Villupuram District",
      date: "1/15/2025",
      description: "Comprehensive eye care for rural villages",
      patients: 93,
      latitude: 11.9401,
      longitude: 79.4861,
      students: ["Vikram Mehta", "Priya Patel", "Ananya Sharma"],
      diagnoses: {
        "Refractive Error": 47,
        "Cataract": 25,
        "Glaucoma": 5,
        "Pterygium": 9,
        "Other": 7
      },
      outcomes: {
        "Prescription": 56,
        "Referral": 37
      }
    }
  ];

  // Calculate total patients
  const totalPatients = camps.reduce((sum, camp) => sum + camp.patients, 0);

  // Prepare diagnosis data for the pie chart
  const diagnosisData = camps.reduce((result, camp) => {
    Object.entries(camp.diagnoses).forEach(([diagnosis, count]) => {
      if (result[diagnosis]) {
        result[diagnosis] += count;
      } else {
        result[diagnosis] = count;
      }
    });
    return result;
  }, {} as Record<string, number>);

  const diagnosisPieData = Object.entries(diagnosisData).map(([name, value]) => ({ name, value }));

  // Prepare outcome data for the pie chart
  const outcomeData = camps.reduce((result, camp) => {
    Object.entries(camp.outcomes).forEach(([outcome, count]) => {
      if (result[outcome]) {
        result[outcome] += count;
      } else {
        result[outcome] = count;
      }
    });
    return result;
  }, {} as Record<string, number>);

  const outcomePieData = Object.entries(outcomeData).map(([name, value]) => ({ name, value }));

  // Colors for the pie charts
  const DIAGNOSIS_COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];
  const OUTCOME_COLORS = ['#0088FE', '#00C49F'];

  // Monthly trends data
  const monthlyTrendsData = [
    { month: 'Jan', patients: 93 },
    { month: 'Feb', patients: 68 },
    { month: 'Mar', patients: 112 },
    { month: 'Apr', patients: 45 },
    { month: 'May', patients: 0 },
    { month: 'Jun', patients: 0 }
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

          {/* Filters Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" /> Dashboard Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium mb-1">Date Range</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={filterDateRange}
                    onChange={(e) => setFilterDateRange(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="thisYear">This Year</option>
                    <option value="lastYear">Last Year</option>
                    <option value="last3Months">Last 3 Months</option>
                    <option value="last6Months">Last 6 Months</option>
                  </select>
                </div>
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kanchipuram">Kanchipuram</option>
                    <option value="Villupuram">Villupuram</option>
                  </select>
                </div>
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium mb-1">Student Participation</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={filterStudent}
                    onChange={(e) => setFilterStudent(e.target.value)}
                  >
                    <option value="all">All Students</option>
                    <option value="Aarav Singh">Aarav Singh</option>
                    <option value="Priya Patel">Priya Patel</option>
                    <option value="Rahul Kumar">Rahul Kumar</option>
                    <option value="Ananya Sharma">Ananya Sharma</option>
                    <option value="Vikram Mehta">Vikram Mehta</option>
                    <option value="Neha Reddy">Neha Reddy</option>
                  </select>
                </div>
                <div className="w-full md:w-auto flex items-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Total Camps</CardTitle>
                <Calendar className="h-6 w-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{camps.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {camps.length > 0 ? `${camps.filter(c => new Date(c.date) > new Date()).length} upcoming` : "No camps scheduled"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Total Patients</CardTitle>
                <Users className="h-6 w-6 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalPatients}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all camps
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Referral Rate</CardTitle>
                <FileText className="h-6 w-6 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.round((outcomeData.Referral / totalPatients) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {outcomeData.Referral} patients referred to hospital
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="h-5 w-5" /> Monthly Patient Volume
                </CardTitle>
                <CardDescription>Number of patients examined per month</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="patients" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Prescription vs Referral */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartPie className="h-5 w-5" /> Prescription vs. Referral
                </CardTitle>
                <CardDescription>Distribution of patient outcomes</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={outcomePieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {outcomePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={OUTCOME_COLORS[index % OUTCOME_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Diagnosis Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartPie className="h-5 w-5" /> Diagnosis Distribution
                </CardTitle>
                <CardDescription>Common eye conditions diagnosed</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-96 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={diagnosisPieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={40}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {diagnosisPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DIAGNOSIS_COLORS[index % DIAGNOSIS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Geographical Distribution
                </CardTitle>
                <CardDescription>Camp locations and patient count</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-96 bg-gray-100 rounded-md flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Map View</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Interactive map showing camp locations would display here.<br />
                      Connect Mapbox or Google Maps API for implementation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Camps Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Eye Camps</CardTitle>
              <CardDescription>Overview of all camps in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Camp Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead className="text-right">Patients</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {camps.map((camp) => (
                    <TableRow key={camp.id}>
                      <TableCell className="font-medium">{camp.name}</TableCell>
                      <TableCell>{camp.location}</TableCell>
                      <TableCell>{camp.date}</TableCell>
                      <TableCell>{camp.students.length} students</TableCell>
                      <TableCell className="text-right">{camp.patients}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
