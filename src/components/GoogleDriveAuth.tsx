
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  FileSpreadsheet, 
  CloudCheck, 
  CloudOff, 
  RefreshCw, 
  LogOut, 
  AlertCircle, 
  HelpCircle 
} from 'lucide-react';
import driveService from '@/services/GoogleDriveService';
import { toast } from 'sonner';

// Your OAuth client id should be replaced with a real one
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'; 
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets'
].join(' ');

let tokenClient: google.accounts.oauth2.TokenClient;

const GoogleDriveAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGApiLoaded, setIsGApiLoaded] = useState(false);
  
  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = driveService.isAuthenticated();
      setIsAuthenticated(authStatus);
    };
    
    checkAuthStatus();
    
    // Load Google API scripts
    const loadGoogleAPIs = () => {
      const gsiScript = document.createElement('script');
      gsiScript.src = 'https://accounts.google.com/gsi/client';
      gsiScript.async = true;
      gsiScript.defer = true;
      gsiScript.onload = () => initializeGoogleAuth();
      
      document.head.appendChild(gsiScript);
    };
    
    if (!window.google) {
      loadGoogleAPIs();
    } else {
      initializeGoogleAuth();
    }
  }, []);
  
  const initializeGoogleAuth = () => {
    if (!window.google) return;
    
    try {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: handleTokenResponse,
      });
      setIsGApiLoaded(true);
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
      toast.error('Failed to initialize Google authentication');
    }
  };
  
  const handleTokenResponse = (response: any) => {
    if (response.error) {
      console.error('Token error:', response);
      toast.error('Authentication failed');
      setIsLoading(false);
      return;
    }
    
    // Store tokens and initialize API
    const success = driveService.setCredentials(
      response.access_token,
      response.expires_in
    );
    
    if (success) {
      setIsAuthenticated(true);
      toast.success('Successfully connected to Google Drive');
    } else {
      toast.error('Failed to initialize Google Drive connection');
    }
    
    setIsLoading(false);
  };
  
  const handleAuth = () => {
    if (!window.google || !tokenClient) {
      toast.error('Google API not loaded yet. Please try again in a moment.');
      return;
    }
    
    setIsLoading(true);
    
    if (!isAuthenticated) {
      // Request authentication
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  };
  
  const handleLogout = () => {
    driveService.logout();
    setIsAuthenticated(false);
    toast.info('Disconnected from Google Drive');
  };
  
  if (!isGApiLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" /> 
            Google Drive Integration
          </CardTitle>
          <CardDescription>
            Loading Google authentication services...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" /> 
          Google Drive Integration
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Connect to Google Drive to automatically create Excel sheets for each camp and sync patient data.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          {isAuthenticated 
            ? "Your account is connected to Google Drive" 
            : "Connect your Google account to enable Excel integration"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-3 rounded-lg border p-4">
          {isAuthenticated ? (
            <CloudCheck className="h-8 w-8 text-green-500" />
          ) : (
            <CloudOff className="h-8 w-8 text-muted-foreground" />
          )}
          
          <div className="flex-1">
            <h3 className="font-medium">
              {isAuthenticated ? "Connected" : "Not Connected"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isAuthenticated 
                ? "Google Drive and Sheets are ready to use" 
                : "Click connect to authorize access to Google Drive"}
            </p>
          </div>
          
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          ) : (
            <Button 
              onClick={handleAuth} 
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              Connect
            </Button>
          )}
        </div>
        
        {!isAuthenticated && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Important Instructions:</p>
              <ol className="ml-4 mt-1 list-decimal">
                <li>You'll be redirected to Google's login page</li>
                <li>Login with your Google account</li>
                <li>Grant the required permissions</li>
                <li>This connection allows automatic creation of Excel sheets for each camp</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
      
      {isAuthenticated && (
        <CardFooter className="bg-muted/50 px-6 py-3">
          <p className="text-xs text-muted-foreground">
            New camp data will automatically be synced with Google Sheets
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default GoogleDriveAuth;
