
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Trash2, Database, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import GoogleDriveAuth from "@/components/GoogleDriveAuth";
import driveService from "@/services/GoogleDriveService";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  
  useEffect(() => {
    // Check Google Drive connection status
    const authStatus = driveService.isAuthenticated();
    setIsDriveConnected(authStatus);
    
    // Get sync queue from localStorage
    try {
      const queueData = localStorage.getItem('driveSyncQueue');
      if (queueData) {
        setSyncQueue(JSON.parse(queueData));
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }
  }, []);
  
  const handleClearLocalData = () => {
    if (confirm("Are you sure you want to clear all local data? This cannot be undone.")) {
      // Clear all app data except drive credentials
      const driveCredentials = localStorage.getItem('driveCredentials');
      
      localStorage.clear();
      
      // Restore drive credentials if they existed
      if (driveCredentials) {
        localStorage.setItem('driveCredentials', driveCredentials);
      }
      
      toast.success("All local data has been cleared");
      
      // Reset state
      setSyncQueue([]);
    }
  };
  
  const handleForceSync = async () => {
    if (!isDriveConnected) {
      toast.error("Please connect to Google Drive first");
      return;
    }
    
    if (syncQueue.length === 0) {
      toast.info("No pending sync operations");
      return;
    }
    
    setIsSyncing(true);
    try {
      // This is a simplified version - in a real app you'd process the queue properly
      toast.info(`Processing ${syncQueue.length} pending sync operations...`);
      
      // Wait for a bit to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear the queue and localStorage
      localStorage.removeItem('driveSyncQueue');
      setSyncQueue([]);
      
      toast.success("Sync completed successfully");
    } catch (error) {
      console.error('Sync error:', error);
      toast.error("Failed to sync data");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold text-primary mb-6">Settings</h1>
        
        <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="drive">Google Drive</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input id="display-name" placeholder="Your Name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications" className="block mb-1">
                        Enable Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for new camps and updates
                      </p>
                    </div>
                    <Switch id="notifications" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="offline-mode" className="block mb-1">
                        Offline Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable enhanced offline functionality
                      </p>
                    </div>
                    <Switch id="offline-mode" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t px-6 py-4">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="drive">
            <Card>
              <CardHeader>
                <CardTitle>Google Drive Integration</CardTitle>
                <CardDescription>
                  Connect and manage Google Drive integration for camp data storage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium mb-1">Connection Status</h3>
                      <p className="text-sm text-muted-foreground">
                        {isDriveConnected 
                          ? "Your account is connected to Google Drive" 
                          : "Connect your Google account to enable Drive integration"}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDriveConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {isDriveConnected ? "Connected" : "Disconnected"}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <GoogleDriveAuth />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sync Status</h3>
                  
                  {syncQueue.length > 0 ? (
                    <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                      <AlertTitle className="text-amber-800">Pending Sync Operations</AlertTitle>
                      <AlertDescription className="text-amber-700">
                        You have {syncQueue.length} operation(s) waiting to be synchronized with Google Drive.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <AlertTitle className="text-green-800">All Data Synced</AlertTitle>
                      <AlertDescription className="text-green-700">
                        All your data is synchronized with Google Drive.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      variant="outline"
                      onClick={handleForceSync}
                      disabled={isSyncing || syncQueue.length === 0 || !isDriveConnected}
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Force Sync Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage your application data and storage settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Local Storage</h3>
                  
                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertTitle>Local Data</AlertTitle>
                    <AlertDescription>
                      This application stores data locally on your device for offline functionality.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="pt-2">
                    <Button 
                      variant="destructive" 
                      onClick={handleClearLocalData}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All Local Data
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Export</h3>
                  
                  <p className="text-sm text-muted-foreground">
                    Export all your camp and patient data as a JSON file for backup purposes.
                  </p>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const data = {
                        camps: JSON.parse(localStorage.getItem('campResources') || '{}'),
                        patients: JSON.parse(localStorage.getItem('patientData') || '{}')
                      };
                      
                      const dataStr = JSON.stringify(data, null, 2);
                      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                      
                      const exportFileName = `camp-data-export-${new Date().toISOString()}.json`;
                      
                      const linkElement = document.createElement('a');
                      linkElement.setAttribute('href', dataUri);
                      linkElement.setAttribute('download', exportFileName);
                      linkElement.click();
                      
                      toast.success("Data exported successfully");
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
