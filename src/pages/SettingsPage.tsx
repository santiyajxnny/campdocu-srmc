
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  LogOut, 
  Cloud, 
  User, 
  FileSpreadsheet, 
  Download 
} from 'lucide-react';
import GoogleDriveAuth from '@/components/GoogleDriveAuth';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Account Settings</h1>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </Button>
        </div>
        
        <div className="mb-6 flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </div>
          
          <div>
            <h2 className="text-lg font-medium">{user?.email}</h2>
            <p className="text-sm text-muted-foreground">
              Role: {user?.role === 'admin' ? 'Administrator' : 'Student'}
            </p>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={handleLogout} 
            className="ml-auto"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        {user?.role === 'admin' && (
          <Tabs defaultValue="integrations">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="integrations" className="mt-6 space-y-6">
              <GoogleDriveAuth />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Excel Template
                  </CardTitle>
                  <CardDescription>
                    Download a sample Excel template for patient data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <div className="flex-1">
                      <h3 className="font-medium">Patient Data Template</h3>
                      <p className="text-sm text-muted-foreground">
                        Download this template to see the required fields for patient data
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      // In a real app, this would download an actual template
                      toast.info('Template download feature will be implemented in production');
                    }}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm">{user?.email}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Role</h3>
                      <p className="text-sm">{user?.role === 'admin' ? 'Administrator' : 'Student'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        {user?.role === 'student' && (
          <Card>
            <CardHeader>
              <CardTitle>Student Account</CardTitle>
              <CardDescription>
                View your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm">{user?.email}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Role</h3>
                  <p className="text-sm">Student</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
