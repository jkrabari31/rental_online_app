import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { useAppStore } from '@/store';
import { Save, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isTruncateDialogOpen, setIsTruncateDialogOpen] = useState(false);
  const [isTruncating, setIsTruncating] = useState(false);
  const { setCurrencySymbol } = useAppStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.get<any>('/settings');
      setSettings(data);
      if (data?.currencySymbol) {
        setCurrencySymbol(data.currencySymbol);
      }
    } catch (err: any) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.put('/settings', settings);
      setSettings(updated);
      setCurrencySymbol(updated.currencySymbol);
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      alert('Failed to save settings: ' + err.message);
    }
  };

  const handleTruncate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTruncating(true);
    try {
      const res = await api.post('/rentals/truncate');
      setIsTruncateDialogOpen(false);
      alert(`Completed rentals truncated successfully. (${res.count || 0} records deleted)`);
    } catch (err: any) {
      alert('Failed to truncate data: ' + err.message);
    } finally {
      setIsTruncating(false);
    }
  };

  if (!settings) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-muted-foreground">Loading application settings...</div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure business receipt details and global application preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {/* Rental Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Rental & Pricing Rules</CardTitle>
            <CardDescription>Configure currency symbol and hourly calculation rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency Symbol</Label>
                <Select 
                  value={settings.currencySymbol || '₹'} 
                  onValueChange={(val: string | null) => setSettings({ ...settings, currencySymbol: val || '₹' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="₹">₹ (Rupee)</SelectItem>
                    <SelectItem value="$">$ (Dollar)</SelectItem>
                    <SelectItem value="£">£ (Pound)</SelectItem>
                    <SelectItem value="€">€ (Euro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hourly Rounding Rule</Label>
                <Select 
                  value={settings.hourlyRoundingRule || 'EXACT'} 
                  onValueChange={(val: string | null) => setSettings({ ...settings, hourlyRoundingRule: val || 'EXACT' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXACT">Exact (Minute by Minute)</SelectItem>
                    <SelectItem value="ROUND_UP">Round Up to Next Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultDeposit">Default Security Deposit Amount ({settings.currencySymbol || '₹'})</Label>
              <Input 
                id="defaultDeposit" 
                type="number"
                value={settings.defaultDepositAmount || 0}
                onChange={(e) => setSettings({ ...settings, defaultDepositAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Info */}
        <Card>
          <CardHeader>
            <CardTitle>Business Branding Information</CardTitle>
            <CardDescription>Details printed on customer transaction receipts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  value={settings.companyName || ''}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyContact">Contact Number</Label>
                <Input 
                  id="companyContact" 
                  value={settings.companyContact || ''}
                  onChange={(e) => setSettings({ ...settings, companyContact: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Input 
                id="companyAddress" 
                value={settings.companyAddress || ''}
                onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiptFooterText">Receipt Footer Message</Label>
              <Input 
                id="receiptFooterText" 
                value={settings.receiptFooterText || ''}
                onChange={(e) => setSettings({ ...settings, receiptFooterText: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center space-x-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
          {saveStatus && (
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in">{saveStatus}</span>
          )}
        </div>
      </form>

      {/* Data Maintenance */}
      <Card className="max-w-2xl border-red-200 dark:border-red-900/50 mt-8">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" /> Danger Zone
          </CardTitle>
          <CardDescription>System maintenance and data cleanup actions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete all COMPLETED rental records from the server to free up database storage. Active rentals, vehicles, customers, and branch accounts will not be affected.
          </p>
          <Button variant="destructive" onClick={() => setIsTruncateDialogOpen(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Master Truncate Completed Data
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isTruncateDialogOpen} onOpenChange={setIsTruncateDialogOpen}>
        <DialogContent className="border-red-200 dark:border-red-900 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" /> Confirm Master Truncate
            </DialogTitle>
            <DialogDescription className="text-base pt-2 font-medium">
              Are you absolutely sure? This action cannot be undone. All COMPLETED rental records across all branches will be permanently erased from the PostgreSQL database.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTruncate} className="pt-2">
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsTruncateDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="destructive" disabled={isTruncating}>
                {isTruncating ? 'Truncating...' : 'Yes, Truncate Data'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
