'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Bell,
  Moon,
  Globe,
  Shield,
  Trash2,
  Save,
  AlertTriangle,
  Check
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

// Install switch and select components if not already installed
// npx shadcn@latest add switch select alert

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotionalEmails: false,

    // Privacy
    profileVisibility: 'private',
    dataSharing: false,

    // Account
    autoLogin: true,
    twoFactorAuth: false,
  });

  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
              <span>Loading settings...</span>
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

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // TODO: Implement settings save API call
      console.log('Saving settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement account deletion
    console.log('Deleting account...');
    toast.error('Account deletion is not implemented yet.');
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">

        <div className="space-y-6">
          {/* Notifications Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive order updates and important notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get text messages for order status updates
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Order Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when your order status changes
                  </p>
                </div>
                <Switch
                  checked={settings.orderUpdates}
                  onCheckedChange={(checked) => updateSetting('orderUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Promotional Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive special offers and promotional content
                  </p>
                </div>
                <Switch
                  checked={settings.promotionalEmails}
                  onCheckedChange={(checked) => updateSetting('promotionalEmails', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto Login</Label>
                  <p className="text-sm text-muted-foreground">
                    Stay logged in across browser sessions
                  </p>
                </div>
                <Switch
                  checked={settings.autoLogin}
                  onCheckedChange={(checked) => updateSetting('autoLogin', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
                  disabled // Not implemented yet
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow anonymous usage data to improve our service
                  </p>
                </div>
                <Switch
                  checked={settings.dataSharing}
                  onCheckedChange={(checked) => updateSetting('dataSharing', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Deleting your account is permanent and cannot be undone. All your data will be removed.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}