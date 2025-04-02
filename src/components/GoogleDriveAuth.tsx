
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Google, LogOut, RefreshCw } from 'lucide-react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import driveService from '@/services/GoogleDriveService';
import { toast } from 'sonner';

// This is a dummy client ID - you will need to replace it with your own from Google Cloud Console
const CLIENT_ID = 'YOUR_GOOGLE_OAUTH_CLIENT_ID';

const GoogleDriveAuth: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = driveService.isAuthenticated();
    setIsAuthenticated(authStatus);
  }, []);

  const handleLoginSuccess = (response: any) => {
    setLoading(true);
    try {
      // Extract token and expiry
      const result = driveService.setCredentials(
        response.access_token || response.credential, 
        response.expires_in || 3600
      );
      
      if (result) {
        setIsAuthenticated(true);
        toast.success('Successfully connected to Google Drive');
      } else {
        toast.error('Failed to authenticate with Google Drive');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    driveService.logout();
    setIsAuthenticated(false);
    toast.info('Logged out from Google Drive');
  };

  if (loading) {
    return (
      <Button variant="outline" disabled className="w-full">
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button variant="outline" onClick={handleLogout} className="w-full">
        <LogOut className="h-4 w-4 mr-2" />
        Disconnect Google Drive
      </Button>
    );
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => toast.error('Login failed')}
          theme="outline"
          text="signin_with"
          width="100%"
          useOneTap
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleDriveAuth;
