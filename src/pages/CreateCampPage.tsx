
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Folder, FileSpreadsheet, MapPin, PlusCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import driveService from "@/services/GoogleDriveService";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock student data (would come from API in production)
const STUDENTS = [
  { id: "1", email: "test1@srmc.com", name: "Student One" },
  { id: "2", email: "test2@srmc.com", name: "Student Two" },
  { id: "3", email: "test3@srmc.com", name: "Student Three" },
  { id: "4", email: "test4@srmc.com", name: "Student Four" },
  { id: "5", email: "test5@srmc.com", name: "Student Five" },
];

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Camp name must be at least 3 characters" }),
  date: z.date({ required_error: "Please select a date for the camp" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  useGeolocation: z.boolean().default(false),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  assignedStudents: z.array(z.string()).min(1, { message: "Please assign at least one student" }),
  useGoogleDrive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCampPage = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [resourceLinks, setResourceLinks] = useState<{driveUrl: string, excelUrl: string}>({
    driveUrl: "",
    excelUrl: ""
  });
  const [geoLocation, setGeoLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isDriveAuthenticated, setIsDriveAuthenticated] = useState(() => driveService.isAuthenticated());

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      useGeolocation: false,
      assignedStudents: [],
      useGoogleDrive: true,
    },
  });

  const useGoogleDrive = form.watch("useGoogleDrive");

  // Check Google Drive authentication when the component mounts
  React.useEffect(() => {
    setIsDriveAuthenticated(driveService.isAuthenticated());
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setGeoLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        uiToast({
          title: "Location captured",
          description: `Latitude: ${position.coords.latitude.toFixed(4)}, Longitude: ${position.coords.longitude.toFixed(4)}`,
        });
      }, () => {
        uiToast({
          title: "Location error",
          description: "Unable to retrieve your location",
          variant: "destructive",
        });
      });
    } else {
      uiToast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Include geolocation data if available
      const campData = {
        ...data,
        geoLocation: geoLocation,
      };
      
      console.log("Creating camp with data:", campData);
      
      let driveResources = null;
      
      // If Google Drive integration is enabled and authenticated, create resources
      if (data.useGoogleDrive && isDriveAuthenticated) {
        // Get selected student emails for sharing
        const studentEmails = data.assignedStudents.map(id => {
          const student = STUDENTS.find(s => s.id === id);
          return student ? student.email : '';
        }).filter(email => email !== '');
        
        driveResources = await driveService.createCampResources(
          data.name,
          data.date,
          studentEmails
        );
        
        if (driveResources) {
          // Store camp resources in localStorage (in a real app, this would go to a database)
          const campId = `camp-${Date.now()}`;
          const campResources = JSON.parse(localStorage.getItem('campResources') || '{}');
          campResources[campId] = driveResources;
          localStorage.setItem('campResources', JSON.stringify(campResources));
          
          setResourceLinks({
            driveUrl: driveResources.folderUrl,
            excelUrl: driveResources.spreadsheetUrl
          });
        }
      } else {
        // Simulate API call for non-Drive workflow
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Use mock URLs if Drive integration is not used
        setResourceLinks({
          driveUrl: "#", // Mock URL
          excelUrl: "#"  // Mock URL
        });
      }
      
      setShowSuccessDialog(true);
      
    } catch (error) {
      console.error("Error creating camp:", error);
      uiToast({
        title: "Failed to create camp",
        description: "There was an error creating your camp. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setShowSuccessDialog(false);
    navigate("/"); // Navigate back to dashboard
    toast.success("Camp created successfully");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <PlusCircle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Create New Eye Camp</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Camp Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Rural Eye Screening Camp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select camp date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Chennai Public School" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="useGeolocation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked && !geoLocation) {
                            handleGetLocation();
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Capture precise location coordinates
                      </FormLabel>
                      <FormDescription>
                        This helps map the exact location of the camp for future reference
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {geoLocation && (
                <Alert className="bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                  <AlertTitle>Location captured</AlertTitle>
                  <AlertDescription>
                    Coordinates: {geoLocation.lat.toFixed(4)}, {geoLocation.lng.toFixed(4)}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter details about the camp purpose, target audience, etc."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useGoogleDrive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked && !isDriveAuthenticated) {
                          toast.info('Please connect to Google Drive in the settings page first', {
                            action: {
                              label: 'Go to Settings',
                              onClick: () => navigate('/settings')
                            }
                          });
                        }
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Create Google Drive resources
                    </FormLabel>
                    <FormDescription>
                      Automatically create a Google Drive folder and Excel sheet for this camp
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {useGoogleDrive && !isDriveAuthenticated && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Google Drive not connected</AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <p>You need to connect your Google Drive account first.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-fit"
                    onClick={() => navigate('/settings')}
                  >
                    Go to Settings
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="assignedStudents"
              render={() => (
                <FormItem>
                  <FormLabel>Assign Students</FormLabel>
                  <div className="space-y-4">
                    {STUDENTS.map((student) => (
                      <FormField
                        key={student.id}
                        control={form.control}
                        name="assignedStudents"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={student.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(student.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedList = checked
                                      ? [...field.value, student.id]
                                      : field.value?.filter(
                                          (value) => value !== student.id
                                        );
                                    field.onChange(updatedList);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {student.name} ({student.email})
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || (useGoogleDrive && !isDriveAuthenticated)}
                className="bg-primary text-primary-foreground"
              >
                {isSubmitting ? "Creating..." : "Create Camp & Setup Resources"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Success Dialog with Resource Links */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Camp Created Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              {useGoogleDrive && isDriveAuthenticated 
                ? "The following resources have been created for your camp."
                : "Your camp has been created."}
            </DialogDescription>
          </DialogHeader>
          
          {useGoogleDrive && isDriveAuthenticated && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent">
                <Folder className="h-10 w-10 text-blue-500" />
                <div className="flex-1">
                  <h3 className="font-medium">Google Drive Folder</h3>
                  <p className="text-sm text-muted-foreground">Contains all camp documents</p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                  <a href={resourceLinks.driveUrl} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </Button>
              </div>
              
              <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent">
                <FileSpreadsheet className="h-10 w-10 text-green-600" />
                <div className="flex-1">
                  <h3 className="font-medium">Excel Sheet</h3>
                  <p className="text-sm text-muted-foreground">For patient data documentation</p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                  <a href={resourceLinks.excelUrl} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleFinish} className="w-full">
              Return to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCampPage;
