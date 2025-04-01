
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Eye, Save, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define step schemas
const patientDemographicsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().min(1, "Age is required"),
  sex: z.string().min(1, "Sex selection is required"),
});

const historySchema = z.object({
  history: z.string().optional(),
});

const visionSchema = z.object({
  visionRight: z.string().optional(),
  visionLeft: z.string().optional(),
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
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isOfflineSaving, setIsOfflineSaving] = useState(false);
  const [isSavedDialogOpen, setIsSavedDialogOpen] = useState(false);
  const totalSteps = 6;
  
  // Initialize form with default values
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      age: "",
      sex: "",
      history: "",
      visionRight: "",
      visionLeft: "",
      dryRefractionRight: "",
      dryRefractionLeft: "",
      acceptanceRight: "",
      acceptanceLeft: "",
      ocularDiagnosis: "",
      outcome: "",
    },
    mode: "onChange",
  });

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    // Validate current step
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await form.trigger(["name", "age", "sex"]);
    } else if (currentStep === 2) {
      isValid = await form.trigger(["history"]);
      isValid = true; // History is optional
    } else if (currentStep === 3) {
      isValid = await form.trigger(["visionRight", "visionLeft"]);
      isValid = true; // Vision is optional
    } else if (currentStep === 4) {
      isValid = await form.trigger(["dryRefractionRight", "dryRefractionLeft", "acceptanceRight", "acceptanceLeft"]);
      isValid = true; // Refraction is optional
    } else if (currentStep === 5) {
      isValid = await form.trigger(["ocularDiagnosis"]);
      isValid = true; // Diagnosis is optional
    } else if (currentStep === 6) {
      isValid = await form.trigger(["outcome"]);
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveProgress = () => {
    // Simulate saving to local storage for offline functionality
    try {
      const formData = form.getValues();
      localStorage.setItem('patientFormData', JSON.stringify({
        data: formData,
        step: currentStep,
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
      title: "Patient record created",
      description: "The patient record has been successfully created",
    });
    setIsSavedDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Eye className="h-6 w-6" /> SRMC Eye Camp - Patient Entry
              </h1>
              <p className="text-muted-foreground">
                Step {currentStep} of {totalSteps}: {getStepName(currentStep)}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={saveProgress}
              disabled={isOfflineSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isOfflineSaving ? "Saving..." : "Save Progress"}
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Demographics</span>
            <span>History</span>
            <span>Vision</span>
            <span>Refraction</span>
            <span>Diagnosis</span>
            <span>Outcome</span>
          </div>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Patient Demographics */}
              {currentStep === 1 && (
                <div className="space-y-4">
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
                </div>
              )}

              {/* Step 2: History Collection */}
              {currentStep === 2 && (
                <div className="space-y-4">
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
                </div>
              )}

              {/* Step 3: Vision Check */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Vision Check</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="visionRight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Right Eye (OD)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 6/9, 6/12" {...field} />
                          </FormControl>
                          <FormDescription>
                            Record visual acuity
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="visionLeft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Left Eye (OS)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 6/9, 6/12" {...field} />
                          </FormControl>
                          <FormDescription>
                            Record visual acuity
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Dry Refraction and Acceptance */}
              {currentStep === 4 && (
                <div className="space-y-4">
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
                </div>
              )}

              {/* Step 5: Ocular Diagnosis */}
              {currentStep === 5 && (
                <div className="space-y-4">
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
                </div>
              )}

              {/* Step 6: Outcome Selection */}
              {currentStep === 6 && (
                <div className="space-y-4">
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
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNext}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit">
                    Save Patient Record <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                )}
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
              The patient record has been successfully created and saved.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => {
              setIsSavedDialogOpen(false);
              form.reset();
              setCurrentStep(1);
            }}>
              Add Another Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to get step name
function getStepName(step: number): string {
  switch (step) {
    case 1: return "Patient Demographics";
    case 2: return "History Collection";
    case 3: return "Vision Check";
    case 4: return "Refraction Values";
    case 5: return "Ocular Diagnosis";
    case 6: return "Outcome Selection";
    default: return "";
  }
}

export default PatientEntryPage;
