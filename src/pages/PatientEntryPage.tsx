
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Eye, Save, ArrowLeft, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Import components
import PatientFormTabs from "@/components/patient-form/PatientFormTabs";
import { patientFormSchema, PatientFormValues } from "@/components/patient-form/schemas";

// Mock camps data
const camps = [{
  id: "1",
  name: "Rural Eye Camp - April 2025",
  location: "Kanchipuram District",
  date: "4/15/2025"
}, {
  id: "2",
  name: "School Screening - March 2025",
  location: "Chennai Public School",
  date: "3/20/2025"
}, {
  id: "3",
  name: "Corporate Eye Camp - February 2025",
  location: "TechSpace Solutions",
  date: "2/10/2025"
}, {
  id: "4",
  name: "Rural Outreach - January 2025",
  location: "Villupuram District",
  date: "1/15/2025"
}];

// Mock patient data for editing
const mockPatients = [{
  id: "p1",
  campId: "1",
  name: "Rajesh Kumar",
  age: "45",
  sex: "male",
  history: "Complains of blurry vision for reading, no previous glasses",
  visionRight: "6/18",
  visionLeft: "6/12",
  dryRefractionRight: "+1.50DS/-0.50DCx90",
  dryRefractionLeft: "+1.75DS/-0.75DCx80",
  acceptanceRight: "+1.25DS/-0.50DCx90",
  acceptanceLeft: "+1.50DS/-0.50DCx85",
  ocularDiagnosis: "Presbyopia, mild astigmatism",
  outcome: "glasses"
}];

const PatientEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { campId, patientId } = useParams<{ campId: string; patientId?: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("demographics");
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);
  const [isOfflineSaving, setIsOfflineSaving] = useState(false);
  const [isSavedDialogOpen, setIsSavedDialogOpen] = useState(false);
  
  const camp = camps.find(c => c.id === campId);
  const existingPatient = patientId ? mockPatients.find(p => p.id === patientId) : null;
  const isEditMode = !!existingPatient;

  // Initialize form with default values or existing patient data
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: existingPatient || {
      name: "",
      age: "",
      sex: "",
      history: "",
      distantVisionRight: "",
      distantVisionLeft: "",
      nearVisionRight: "",
      nearVisionLeft: "",
      rightEyeSph: "",
      rightEyeCyl: "",
      rightEyeAxis: "",
      leftEyeSph: "",
      leftEyeCyl: "",
      leftEyeAxis: "",
      acceptanceRightSph: "",
      acceptanceRightCyl: "",
      acceptanceRightAxis: "",
      acceptanceLeftSph: "",
      acceptanceLeftCyl: "",
      acceptanceLeftAxis: "",
      ocularDiagnosis: "",
      outcome: ""
    },
    mode: "onChange"
  });

  // Update completed tabs based on form data
  useEffect(() => {
    const updateCompletedTabs = () => {
      const formValues = form.getValues();
      const completed: string[] = [];

      // Check demographics
      if (formValues.name && formValues.age && formValues.sex) {
        completed.push("demographics");
      }

      // Check history (optional)
      if (formValues.history) {
        completed.push("history");
      }

      // Check vision
      if (formValues.distantVisionRight || formValues.distantVisionLeft || 
          formValues.nearVisionRight || formValues.nearVisionLeft) {
        completed.push("vision");
      }

      // Check refraction
      if (formValues.rightEyeSph || formValues.rightEyeCyl || formValues.rightEyeAxis || 
          formValues.leftEyeSph || formValues.leftEyeCyl || formValues.leftEyeAxis || 
          formValues.acceptanceRightSph || formValues.acceptanceRightCyl || formValues.acceptanceRightAxis || 
          formValues.acceptanceLeftSph || formValues.acceptanceLeftCyl || formValues.acceptanceLeftAxis) {
        completed.push("refraction");
      }

      // Check diagnosis
      if (formValues.ocularDiagnosis) {
        completed.push("diagnosis");
      }

      // Check outcome
      if (formValues.outcome) {
        completed.push("outcome");
      }
      
      setCompletedTabs(completed);
    };
    
    if (isEditMode) {
      updateCompletedTabs();
    }
  }, [form, isEditMode]);

  const saveProgress = () => {
    // Simulate saving to local storage for offline functionality
    try {
      const formData = form.getValues();
      localStorage.setItem('patientFormData', JSON.stringify({
        data: formData,
        campId,
        patientId,
        activeTab,
        timestamp: new Date().toISOString()
      }));
      
      setIsOfflineSaving(true);
      toast({
        title: "Progress saved",
        description: "Your data has been saved locally"
      });

      // Simulate syncing with server when online
      setTimeout(() => {
        setIsOfflineSaving(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Error saving data",
        description: "There was a problem saving your progress",
        variant: "destructive"
      });
    }
  };

  const onSubmit = (data: PatientFormValues) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your backend
    toast({
      title: isEditMode ? "Patient record updated" : "Patient record created",
      description: isEditMode ? 
        "The patient record has been successfully updated" : 
        "The patient record has been successfully created"
    });
    setIsSavedDialogOpen(true);
  };

  const calculateProgress = () => {
    const totalSections = 6; // Total number of sections
    return completedTabs.length / totalSections * 100;
  };

  if (!camp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Camp Not Found</h2>
            <p className="mb-4">The requested camp could not be found.</p>
            <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/camp/${campId}`)} 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Camp Details
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Eye className="h-6 w-6" /> {camp.name}
              </h1>
              <p className="text-muted-foreground">
                {isEditMode ? "Edit Patient Record" : "New Patient Registration"}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={saveProgress} 
              disabled={isOfflineSaving} 
              className="flex items-center gap-2"
            >
              {isOfflineSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Progress
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <Progress value={calculateProgress()} className="h-2" />
          <div className="mt-2 text-sm text-muted-foreground">
            {completedTabs.length} of 6 sections completed
          </div>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Tabs section with all form components */}
              <PatientFormTabs 
                control={form.control}
                watch={form.watch}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                completedTabs={completedTabs}
              />

              <div className="flex justify-between pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/camp/${campId}`)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Camp
                </Button>
                
                <Button type="submit">
                  {isEditMode ? "Update" : "Save"} Patient Record <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>

      {/* Offline saving indicator */}
      <Sheet open={isOfflineSaving} onOpenChange={setIsOfflineSaving}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Saving Data Offline</SheetTitle>
            <SheetDescription>
              Your data is being saved locally. It will be synchronized with the server when connection is available.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Progress value={100} className="h-2 animate-pulse" />
          </div>
        </SheetContent>
      </Sheet>

      {/* Success Dialog */}
      <Dialog open={isSavedDialogOpen} onOpenChange={setIsSavedDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Patient Record Saved</DialogTitle>
            <DialogDescription>
              The patient record has been successfully {isEditMode ? "updated" : "created"}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-center">
            <Button variant="outline" onClick={() => navigate(`/camp/${campId}`)}>
              Return to Camp
            </Button>
            {!isEditMode && (
              <Button onClick={() => {
                setIsSavedDialogOpen(false);
                form.reset();
                setActiveTab("demographics");
                setCompletedTabs([]);
              }}>
                Add Another Patient
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientEntryPage;
