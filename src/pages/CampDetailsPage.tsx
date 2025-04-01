
import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  UserPlus, 
  Download, 
  Search, 
  Calendar,
  MapPin,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Mock data - would be replaced with real data from API or context
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

// Mock patient data
const mockPatients = [
  {
    id: "p1",
    campId: "1",
    name: "Rajesh Kumar",
    age: 45,
    sex: "Male",
    diagnosis: "Refractive Error",
    outcome: "Prescription",
    visionRight: "6/18",
    visionLeft: "6/12",
    examined: true,
    completed: true
  },
  {
    id: "p2",
    campId: "1",
    name: "Lakshmi Devi",
    age: 62,
    sex: "Female",
    diagnosis: "Cataract",
    outcome: "Referral",
    visionRight: "6/60",
    visionLeft: "6/36",
    examined: true,
    completed: true
  },
  {
    id: "p3",
    campId: "1",
    name: "Anil Sharma",
    age: 35,
    sex: "Male",
    diagnosis: "Dry Eye",
    outcome: "Prescription",
    visionRight: "6/9",
    visionLeft: "6/9",
    examined: true,
    completed: true
  },
  {
    id: "p4",
    campId: "1",
    name: "Meena Patel",
    age: 52,
    sex: "Female",
    diagnosis: "Glaucoma",
    outcome: "Referral",
    visionRight: "6/24",
    visionLeft: "6/18",
    examined: true,
    completed: true
  },
  {
    id: "p5",
    campId: "1",
    name: "Suresh Iyer",
    age: 40,
    sex: "Male",
    diagnosis: null,
    outcome: null,
    visionRight: "6/6",
    visionLeft: "6/9",
    examined: false,
    completed: false
  },
  {
    id: "p6",
    campId: "2",
    name: "Priya Mehta",
    age: 12,
    sex: "Female",
    diagnosis: "Refractive Error",
    outcome: "Prescription",
    visionRight: "6/12",
    visionLeft: "6/12",
    examined: true,
    completed: true
  },
  {
    id: "p7",
    campId: "3",
    name: "Vikram Choudhary",
    age: 34,
    sex: "Male",
    diagnosis: "Computer Vision Syndrome",
    outcome: "Prescription",
    visionRight: "6/6",
    visionLeft: "6/6",
    examined: true,
    completed: true
  }
];

const CampDetailsPage: React.FC = () => {
  const { campId } = useParams<{ campId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const camp = camps.find(c => c.id === campId);
  
  if (!camp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Camp Not Found</CardTitle>
            <CardDescription>The requested camp could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Filter patients for this camp and by search query
  const campPatients = mockPatients
    .filter(patient => patient.campId === campId)
    .filter(patient => 
      searchQuery === "" || 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  // Calculate stats
  const totalExamined = campPatients.filter(p => p.examined).length;
  const pendingExaminations = campPatients.length - totalExamined;
  const prescriptionCount = campPatients.filter(p => p.outcome === "Prescription").length;
  const referralCount = campPatients.filter(p => p.outcome === "Referral").length;
  
  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Patient data is being exported to Excel"
    });
  };
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">{camp.name}</h1>
            <p className="text-muted-foreground">
              {camp.date} • {camp.location}
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate(`/patient-entry/${campId}`)}
            >
              <Link to={`/patient-entry/${campId}`}>
                <UserPlus className="mr-2 h-5 w-5" /> Add New Patient
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportData}
            >
              <Download className="mr-2 h-5 w-5" /> Export Data
            </Button>
          </div>
        </div>
        
        {/* Camp details cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Date</CardTitle>
              <Calendar className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{camp.date}</div>
              <p className="text-xs text-muted-foreground mt-1">Camp day</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Location</CardTitle>
              <MapPin className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{camp.location}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Lat: {camp.latitude}, Long: {camp.longitude}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Students</CardTitle>
              <Users className="h-6 w-6 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{camp.students.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {camp.students.join(", ")}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Patient progress cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Patients</div>
              <div className="text-2xl font-bold mt-1">{campPatients.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Examined</div>
              <div className="text-2xl font-bold mt-1">{totalExamined}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Pending</div>
              <div className="text-2xl font-bold mt-1">{pendingExaminations}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Referral Rate</div>
              <div className="text-2xl font-bold mt-1">
                {campPatients.length > 0 ? Math.round((referralCount / totalExamined) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Patient search and list */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>All patients registered for this camp</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age/Sex</TableHead>
                  <TableHead>Vision (OD/OS)</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      {searchQuery ? "No patients matching your search" : "No patients registered for this camp yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  campPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.age} / {patient.sex.charAt(0)}</TableCell>
                      <TableCell>{patient.visionRight || '-'} / {patient.visionLeft || '-'}</TableCell>
                      <TableCell>{patient.diagnosis || 'Not examined'}</TableCell>
                      <TableCell>
                        {patient.outcome === "Prescription" ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Prescription
                          </span>
                        ) : patient.outcome === "Referral" ? (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                            Referral
                          </span>
                        ) : (
                          "Pending"
                        )}
                      </TableCell>
                      <TableCell>
                        {patient.completed ? (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Completed
                          </span>
                        ) : patient.examined ? (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            Partial
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            Registered
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/patient-entry/${campId}/${patient.id}`)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {campPatients.length > 0 && (
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
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampDetailsPage;
