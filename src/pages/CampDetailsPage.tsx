
// If this file doesn't exist yet, let's create a basic version that shows the Google Drive links
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, ArrowLeft, FileSpreadsheet, Folder, UserPlus, RefreshCw, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import driveService from "@/services/GoogleDriveService";
import GoogleDriveAuth from "@/components/GoogleDriveAuth";

// Mock camps data
const camps = [
  {
    id: "1",
    name: "Rural Eye Camp - April 2025",
    location: "Kanchipuram District",
    date: "4/15/2025",
  },
  {
    id: "2",
    name: "School Screening - March 2025",
    location: "Chennai Public School",
    date: "3/20/2025",
  },
  {
    id: "3",
    name: "Corporate Eye Camp - February 2025",
    location: "TechSpace Solutions",
    date: "2/10/2025",
  },
  {
    id: "4",
    name: "Rural Outreach - January 2025",
    location: "Villupuram District",
    date: "1/15/2025",
  }
];

const CampDetailsPage = () => {
  const { campId } = useParams<{ campId: string }>();
  const navigate = useNavigate();
  const [camp, setCamp] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("patients");
  const [isSyncing, setIsSyncing] = useState(false);
  const [driveResources, setDriveResources] = useState<{
    folderId: string;
    spreadsheetId: string;
    folderUrl: string;
    spreadsheetUrl: string;
  } | null>(null);

  useEffect(() => {
    // Find camp data
    const campData = camps.find(c => c.id === campId);
    if (campData) {
      setCamp(campData);
    }

    // Load patients for this camp from localStorage
    const savedPatients = JSON.parse(localStorage.getItem('patientData') || '{}');
    const campPatients = savedPatients[campId as string] || [];
    setPatients(campPatients);
    
    // Load Drive resources for this camp
    const savedResources = JSON.parse(localStorage.getItem('campResources') || '{}');
    if (savedResources[campId as string]) {
      setDriveResources(savedResources[campId as string]);
    }
  }, [campId]);

  const handleSyncToDrive = async () => {
    if (!driveService.isAuthenticated()) {
      toast.error("Please connect to Google Drive first");
      return;
    }
    
    if (!campId || patients.length === 0 || !driveResources?.spreadsheetId) {
      toast.error("Nothing to sync or missing spreadsheet ID");
      return;
    }
    
    setIsSyncing(true);
    try {
      const success = await driveService.syncPatientData(
        campId,
        patients,
        driveResources.spreadsheetId
      );
      
      if (success) {
        toast.success("Patient data successfully synced to Google Sheets");
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Failed to sync data");
    } finally {
      setIsSyncing(false);
    }
  };

  if (!camp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Camp Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The requested camp could not be found.</p>
            <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">{camp.name}</h1>
            <p className="text-muted-foreground">
              {camp.location} • {camp.date}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/patient-entry/${campId}`)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Patient
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{patients.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Referred Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {patients.filter(p => p.outcome === 'referred').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Glasses Prescribed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {patients.filter(p => p.outcome === 'glasses').length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="patients" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="resources">Google Drive Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Records</CardTitle>
                <CardDescription>
                  View and manage all patients registered during this camp
                </CardDescription>
              </CardHeader>
              <CardContent>
                {patients.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">No patient records found</p>
                    <Button onClick={() => navigate(`/patient-entry/${campId}`)}>
                      <Plus className="mr-2 h-4 w-4" /> Add First Patient
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Age/Sex</TableHead>
                          <TableHead>Vision (OD/OS)</TableHead>
                          <TableHead>Diagnosis</TableHead>
                          <TableHead>Outcome</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patients.map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell className="font-medium">{patient.name}</TableCell>
                            <TableCell>{patient.age}/{patient.sex}</TableCell>
                            <TableCell>{patient.visionRight || '-'}/{patient.visionLeft || '-'}</TableCell>
                            <TableCell>{patient.ocularDiagnosis || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={patient.outcome === 'referred' ? 'destructive' : 'default'}>
                                {patient.outcome === 'glasses' ? 'Glass Prescription' : 
                                 patient.outcome === 'referred' ? 'Referred to Hospital' :
                                 patient.outcome === 'followup' ? 'Follow-up Required' :
                                 patient.outcome === 'normal' ? 'No Treatment' : '-'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => navigate(`/patient-entry/${campId}/${patient.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              {patients.length > 0 && (
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    Total: {patients.length} patient{patients.length !== 1 ? 's' : ''}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleSyncToDrive}
                    disabled={isSyncing || !driveResources?.spreadsheetId || !driveService.isAuthenticated()}
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Syncing to Drive...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Sync to Google Sheets
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Google Drive Resources</CardTitle>
                <CardDescription>
                  Access and manage camp resources stored on Google Drive
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!driveResources ? (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                      <h3 className="text-amber-800 font-medium mb-2">No Drive Resources Found</h3>
                      <p className="text-amber-700 text-sm mb-4">
                        This camp doesn't have any Google Drive resources configured yet.
                      </p>
                      {!driveService.isAuthenticated() && (
                        <div className="mt-4">
                          <p className="text-sm mb-2">Connect to Google Drive to create resources</p>
                          <GoogleDriveAuth />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <Folder className="h-10 w-10 text-blue-500 shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">Camp Folder</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          All camp documents and resources
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <a 
                            href={driveResources.folderUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <Folder className="mr-2 h-4 w-4" />
                            Open Folder
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <FileSpreadsheet className="h-10 w-10 text-green-600 shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">Patient Records Spreadsheet</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Excel sheet with all patient data
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm">
                            <a 
                              href={driveResources.spreadsheetUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <FileSpreadsheet className="mr-2 h-4 w-4" />
                              Open Spreadsheet
                            </a>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSyncToDrive}
                            disabled={isSyncing}
                          >
                            {isSyncing ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Syncing...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Sync Data Now
                              </>
                            )}
                          </Button>
                          
                          <Button asChild variant="outline" size="sm">
                            <a 
                              href={`https://docs.google.com/spreadsheets/d/${driveResources.spreadsheetId}/export?format=xlsx`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download XLSX
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <UserPlus className="h-10 w-10 text-purple-500 shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">Share Access</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Share camp resources with additional team members
                        </p>
                        <div className="text-sm">
                          <p>Share permissions are managed through Google Drive.</p>
                          <Button 
                            asChild 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                          >
                            <a 
                              href={driveResources.folderUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Manage Sharing
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CampDetailsPage;
