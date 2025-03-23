
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, signOut } from '@/firebase/authService';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, LogOut, UserCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      setUser(currentUser);
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const userInitials = user?.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : 'U';

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-muted"></div>
            <div className="mt-4 h-6 w-32 bg-muted rounded"></div>
            <div className="mt-2 h-4 w-24 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="mt-4 text-2xl font-bold">{user.displayName || 'User'}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              <UserCircle size={16} className="mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  value={user.displayName || ''} 
                  onChange={() => {}} 
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user.email || ''} 
                  onChange={() => {}} 
                  disabled
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed
              </p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Manage your notifications and settings
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily news digests
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about breaking news
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark theme
                    </p>
                  </div>
                  <Switch checked={document.documentElement.classList.contains('dark')} 
                    onCheckedChange={(checked) => {
                      if (checked) {
                        document.documentElement.classList.add('dark');
                        localStorage.setItem('theme', 'dark');
                      } else {
                        document.documentElement.classList.remove('dark');
                        localStorage.setItem('theme', 'light');
                      }
                    }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Reading History</CardTitle>
              <CardDescription>
                Articles you've recently viewed
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Your reading history will appear here as you read articles.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
