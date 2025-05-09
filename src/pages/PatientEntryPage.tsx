import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Eye, Save, ArrowLeft, ArrowRight, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";

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

// Mock patient data for editing
const mockPatients = [
  {
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
  }
];

// Define step schemas
const patientDemographicsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().min(1, "Age is required"),
  sex: z.string().min(1, "Sex selection is required"),
});

const historySchema = z.object({
  history: z.string().optional(),
});

// Update the vision schema to include both distant and near vision
const visionSchema = z.object({
  distantVisionRight: z.string().optional(),
  distantVisionLeft: z.string().optional(),
  nearVisionRight: z.string().optional(),
  nearVisionLeft: z.string().optional(),
});

const refractionSchema = z.object({
  dryRefractionRight: z.string().optional(),
  dryRefractionLeft: z.string().optional(),
  acceptanceRight: z.string().optional(),
  acceptanceLeft: z.string().optional(),
});

const diagnosisSchema = z.object({
  ocularDiagnosis: z.string().optional(),
});

const outcomeSchema = z.object({
  outcome: z.string().min(1, "Outcome selection is required"),
});

// Combined schema for the entire form
const patientFormSchema = patientDemographicsSchema
  .merge(historySchema)
  .merge(visionSchema)
  .merge(refractionSchema)
  .merge(diagnosisSchema)
  .merge(outcomeSchema);

type PatientFormValues = z.infer<typeof patientFormSchema>;

const PatientEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { campId, patientId } = useParams<{ campId: string, patientId?: string }>();
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
      dryRefractionRight: "",
      dryRefractionLeft: "",
      acceptanceRight: "",
      acceptanceLeft: "",
      ocularDiagnosis: "",
      outcome: "",
    },
    mode: "onChange",
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
      if (formValues.distantVisionRight || formValues.distantVisionLeft || formValues.nearVisionRight || formValues.nearVisionLeft) {
        completed.push("vision");
      }
      
      // Check refraction
      if (formValues.dryRefractionRight || formValues.dryRefractionLeft || 
          formValues.acceptanceRight || formValues.acceptanceLeft) {
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
        timestamp: new Date().toISOString(),
      }));
      
      setIsOfflineSaving(true);
      toast({
        title: "Progress saved",
        description: "Your data has been saved locally",
      });
      
      // Simulate syncing with server when online
      setTimeout(() => {
        setIsOfflineSaving(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Error saving data",
        description: "There was a problem saving your progress",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: PatientFormValues) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your backend
    toast({
      title: isEditMode ? "Patient record updated" : "Patient record created",
      description: isEditMode 
        ? "The patient record has been successfully updated" 
        : "The patient record has been successfully created",
    });
    setIsSavedDialogOpen(true);
  };
  
  const calculateProgress = () => {
    const totalSections = 6; // Total number of sections
    return (completedTabs.length / totalSections) * 100;
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
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                  <TabsTrigger 
                    value="demographics"
                    className={completedTabs.includes("demographics") ? "border-b-2 border-green-500" : ""}
                  >
                    Demographics
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history"
                    className={completedTabs.includes("history") ? "border-b-2 border-green-500" : ""}
                  >
                    History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="vision"
                    className={completedTabs.includes("vision") ? "border-b-2 border-green-500" : ""}
                  >
                    Vision
                  </TabsTrigger>
                  <TabsTrigger 
                    value="refraction"
                    className={completedTabs.includes("refraction") ? "border-b-2 border-green-500" : ""}
                  >
                    Refraction
                  </TabsTrigger>
                  <TabsTrigger 
                    value="diagnosis"
                    className={completedTabs.includes("diagnosis") ? "border-b-2 border-green-500" : ""}
                  >
                    Diagnosis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="outcome"
                    className={completedTabs.includes("outcome") ? "border-b-2 border-green-500" : ""}
                  >
                    Outcome
                  </TabsTrigger>
                </TabsList>
                
                {/* Demographics Tab */}
                <TabsContent value="demographics" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Patient Demographics</h2>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter patient's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sex</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient's sex" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">History Collection</h2>
                  
                  <FormField
                    control={form.control}
                    name="history"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical History</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter patient's medical history, complaints, etc." 
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include any relevant medical conditions, ocular history, systemic diseases, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Vision Tab - Updated with distant and near vision */}
                <TabsContent value="vision" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Vision Check</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-2">
                      <div></div>
                      <div className="text-center font-medium">Right Eye (OD)</div>
                      <div className="text-center font-medium">Left Eye (OS)</div>
                    </div>

                    {/* Distant Vision */}
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <div className="flex items-center">
                        <Label className="font-medium">Distant</Label>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1">
                              ?
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p>Distant vision typically measured in 6/X format (metric) or 20/X format (US). Enter numerator/denominator.</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>

                      {/* Right Eye Distant Vision */}
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="distantVisionRight"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="flex items-center">
                                  <Input 
                                    placeholder="6" 
                                    className="w-16 text-center" 
                                    {...field} 
                                  />
                                  <span className="mx-1">/</span>
                                  <Input 
                                    placeholder="6" 
                                    className="w-16 text-center" 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Left Eye Distant Vision */}
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="distantVisionLeft"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="flex items-center">
                                  <Input 
                                    placeholder="6" 
                                    className="w-16 text-center" 
                                    {...field} 
                                  />
                                  <span className="mx-1">/</span>
                                  <Input 
                                    placeholder="6" 
                                    className="w-16 text-center" 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Near Vision */}
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <div className="flex items-center">
                        <Label className="font-medium">Near</Label>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1">
                              ?
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p>Near vision typically measured in N format (N5, N6, etc). Enter N value/distance.</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>

                      {/* Right Eye Near Vision */}
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="nearVisionRight"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="flex items-center">
                                  <Input 
                                    placeholder="N" 
                                    className="w-16 text-center" 
                                    {...field} 
                                  />
                                  <span className="mx-1">/</span>
                                  <Input 
                                    placeholder="cm" 
                                    className="w-16 text-center" 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Left Eye Near Vision */}
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="nearVisionLeft"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="flex items-center">
                                  <Input 
                                    placeholder="N" 
                                    className="w-16 text-center" 
                                    {...field} 
                                  />
                                  <span className="mx-1">/</span>
                                  <Input 
                                    placeholder="cm" 
                                    className="w-16 text-center" 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Refraction Tab */}
                <TabsContent value="refraction" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Refraction Values</h2>
                  
                  <h3 className="text-md font-medium mt-2">Dry Refraction</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dryRefractionRight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Right Eye (OD)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., +1.00DS/-0.50DCx180" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dryRefractionLeft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Left Eye (OS)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., +1.00DS/-0.50DCx180" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <h3 className="text-md font-medium mt-4">Acceptance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="acceptanceRight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Right Eye (OD)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., +0.75DS/-0.50DCx180" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="acceptanceLeft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Left Eye (OS)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., +0.75DS/-0.50DCx180" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Diagnosis Tab */}
                <TabsContent value="diagnosis" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Ocular Diagnosis</h2>
                  
                  <FormField
                    control={form.control}
                    name="ocularDiagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diagnosis</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Myopia, Presbyopia" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter ocular conditions, refractive errors, or other findings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Outcome Tab */}
                <TabsContent value="outcome" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Outcome</h2>
                  
                  <FormField
                    control={form.control}
                    name="outcome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Outcome</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select outcome" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="glasses">Glass Prescription</SelectItem>
                            <SelectItem value="referred">Referred to Hospital</SelectItem>
                            <SelectItem value="followup">Follow-up Required</SelectItem>
                            <SelectItem value="normal">Normal - No Treatment</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the appropriate outcome for this patient
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

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
            <Button 
              variant="outline" 
              onClick={() => navigate(`/camp/${campId}`)}
            >
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
