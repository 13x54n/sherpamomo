'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

// Install avatar component if not already installed
// npx shadcn@latest add avatar

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  // Load user profile data from localStorage
  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`sherpamomo_profile_${user.id}`);
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setFormData(prev => ({
            ...prev,
            phone: profile.phone || '',
            address: profile.address || ''
          }));
        } catch (error) {
          console.warn('Failed to parse saved profile:', error);
        }
      }
    }
  }, [user]);

  // Redirect if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading your profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleSave = () => {
    if (user) {
      // Save profile data to localStorage
      const profileData = {
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`sherpamomo_profile_${user.id}`, JSON.stringify(profileData));

      console.log('✅ Profile saved:', profileData);
      toast.success('Profile updated successfully!');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: ''
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.name || ''} />
                    <AvatarFallback className="text-2xl">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <Badge variant="secondary" className="mt-2">
                      Google Account
                    </Badge>
                  </div>

                  <div className="w-full space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member since</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orders</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Personal Information</CardTitle>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm py-2 px-3 bg-muted rounded-md">
                        {user?.name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <p className="text-sm py-2 px-3 bg-muted rounded-md">
                      {user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed (managed by Google)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm py-2 px-3 bg-muted rounded-md">
                        {formData.phone || 'Not provided'}
                      </p>
                    )}
                    {formData.phone && (
                      <p className="text-xs text-muted-foreground">
                        📱 Set during checkout
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </Label>
                    {isEditing ? (
                      <textarea
                        id="address"
                        className="w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md bg-background"
                        placeholder="Enter your delivery address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm py-2 px-3 bg-muted rounded-md min-h-[80px]">
                        {formData.address || 'Not provided'}
                      </p>
                    )}
                    {formData.address && (
                      <p className="text-xs text-muted-foreground">
                        📍 Set during checkout
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Order History</h4>
                      <p className="text-sm text-muted-foreground">View your past orders</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/orders">View Orders</Link>
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Account Settings</h4>
                      <p className="text-sm text-muted-foreground">Manage your preferences</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/settings">Settings</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}