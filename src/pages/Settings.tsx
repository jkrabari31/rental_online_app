import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { useAppStore } from '@/store';
import { 
  Save, 
  Trash2, 
  AlertTriangle, 
  Download, 
  Upload, 
  Database, 
  Car, 
  FileSpreadsheet, 
  CheckCircle2, 
  RefreshCw,
  FileCode,
  Info
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import * as XLSX from 'xlsx';

export function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isTruncateDialogOpen, setIsTruncateDialogOpen] = useState(false);
  const [isTruncating, setIsTruncating] = useState(false);
  const { setCurrencySymbol } = useAppStore();

  // Full Backup / Restore state
  const [isExportingBackup, setIsExportingBackup] = useState(false);
  const [restorePayload, setRestorePayload] = useState<any>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreResult, setRestoreResult] = useState<any>(null);
  const fullBackupFileRef = useRef<HTMLInputElement>(null);

  // Vehicle Import / Export state
  const [isVehicleImportModalOpen, setIsVehicleImportModalOpen] = useState(false);
  const [vehicleImportData, setVehicleImportData] = useState<any[]>([]);
  const [isImportingVehicles, setIsImportingVehicles] = useState(false);
  const [vehicleImportResult, setVehicleImportResult] = useState<any>(null);
  const vehicleFileRef = useRef<HTMLInputElement>(null);

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

  // ─────────────────────────────────────────────────────────────
  // 1. FULL SYSTEM BACKUP & RESTORE
  // ─────────────────────────────────────────────────────────────
  const handleDownloadFullBackup = async () => {
    setIsExportingBackup(true);
    try {
      const data = await api.get('/backup/full');
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `sb_rental_full_backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Failed to export backup: ' + err.message);
    } finally {
      setIsExportingBackup(false);
    }
  };

  const handleFullBackupFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.data || (!parsed.data.vehicles && !parsed.data.branches)) {
          alert('Invalid backup file. The selected JSON is not a valid SB Rental backup file.');
          return;
        }
        setRestorePayload(parsed);
        setRestoreResult(null);
        setIsRestoreModalOpen(true);
      } catch (err) {
        alert('Failed to parse JSON backup file. Please select a valid JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be chosen again
    e.target.value = '';
  };

  const handleExecuteRestore = async () => {
    if (!restorePayload) return;
    setIsRestoring(true);
    try {
      const res = await api.post('/backup/restore', { payload: restorePayload });
      setRestoreResult(res);
      loadSettings();
    } catch (err: any) {
      alert('Restore failed: ' + err.message);
    } finally {
      setIsRestoring(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 2. VEHICLE FLEET EXPORT & IMPORT (EXCEL / JSON)
  // ─────────────────────────────────────────────────────────────
  const handleExportVehicles = async (formatType: 'excel' | 'json') => {
    try {
      const vehicles = await api.get<any[]>('/backup/vehicles');
      if (!vehicles || vehicles.length === 0) {
        alert('No vehicles found to export.');
        return;
      }

      if (formatType === 'json') {
        const jsonStr = JSON.stringify(vehicles, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sb_rental_vehicles_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }

      // Excel export
      const excelRows = vehicles.map((v) => ({
        'Registration Number': v.vehicleNumber,
        'Vehicle Name': v.vehicleName,
        'Vehicle Type': v.vehicleType || 'Scooter',
        'Branch Name': v.branch?.name || '',
        'Hourly Rate': v.hourlyRate || 0,
        'Security Deposit': v.securityDeposit || 0,
        '1hr Rate': v.rate1hr ?? '',
        '3hr Rate': v.rate3hr ?? '',
        '6hr Rate': v.rate6hr ?? '',
        '12hr Rate': v.rate12hr ?? '',
        '24hr Rate': v.rate24hr ?? '',
        'Status': v.status || 'AVAILABLE',
        'Description': v.description || '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicles');

      // Adjust column widths
      worksheet['!cols'] = [
        { wch: 20 }, // Reg No
        { wch: 22 }, // Name
        { wch: 15 }, // Type
        { wch: 20 }, // Branch
        { wch: 12 }, // Hourly Rate
        { wch: 15 }, // Deposit
        { wch: 10 }, // 1hr
        { wch: 10 }, // 3hr
        { wch: 10 }, // 6hr
        { wch: 10 }, // 12hr
        { wch: 10 }, // 24hr
        { wch: 14 }, // Status
        { wch: 25 }, // Description
      ];

      XLSX.writeFile(workbook, `SB_Rental_Vehicles_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err: any) {
      alert('Failed to export vehicles: ' + err.message);
    }
  };

  const handleDownloadSampleTemplate = () => {
    const sampleRows = [
      {
        'Registration Number': 'GJ01AB1234',
        'Vehicle Name': 'Activa 6G',
        'Vehicle Type': 'Scooter',
        'Branch Name': 'Main Branch',
        'Hourly Rate': 100,
        'Security Deposit': 500,
        '1hr Rate': 100,
        '3hr Rate': 250,
        '6hr Rate': 450,
        '12hr Rate': 700,
        '24hr Rate': 1000,
        'Status': 'AVAILABLE',
        'Description': 'Helmet included',
      },
      {
        'Registration Number': 'GJ01CD5678',
        'Vehicle Name': 'Royal Enfield Classic 350',
        'Vehicle Type': 'Bike',
        'Branch Name': 'Main Branch',
        'Hourly Rate': 200,
        'Security Deposit': 1000,
        '1hr Rate': 200,
        '3hr Rate': 500,
        '6hr Rate': 900,
        '12hr Rate': 1500,
        '24hr Rate': 2200,
        'Status': 'AVAILABLE',
        'Description': 'Dual disc, ABS',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicle_Template');
    XLSX.writeFile(workbook, 'Vehicle_Import_Template.xlsx');
  };

  const handleVehicleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isJson = file.name.endsWith('.json');

    const reader = new FileReader();
    if (isJson) {
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          const list = Array.isArray(parsed) ? parsed : parsed.vehicles || [];
          if (list.length === 0) {
            alert('No vehicle entries found in JSON file.');
            return;
          }
          setVehicleImportData(list);
          setVehicleImportResult(null);
          setIsVehicleImportModalOpen(true);
        } catch {
          alert('Failed to parse vehicle JSON.');
        }
      };
      reader.readAsText(file);
    } else {
      // Excel or CSV
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheet];
          const rows = XLSX.utils.sheet_to_json<any>(sheet);

          if (!rows || rows.length === 0) {
            alert('No vehicle data found in Excel spreadsheet.');
            return;
          }
          setVehicleImportData(rows);
          setVehicleImportResult(null);
          setIsVehicleImportModalOpen(true);
        } catch (err: any) {
          alert('Failed to read Excel file: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }
    e.target.value = '';
  };

  const handleExecuteVehicleImport = async () => {
    if (!vehicleImportData || vehicleImportData.length === 0) return;
    setIsImportingVehicles(true);
    try {
      const res = await api.post('/backup/vehicles/import', { vehicles: vehicleImportData });
      setVehicleImportResult(res);
    } catch (err: any) {
      alert('Vehicle import failed: ' + err.message);
    } finally {
      setIsImportingVehicles(false);
    }
  };

  if (!settings) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-muted-foreground">Loading application settings...</div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings & Data Management</h1>
        <p className="text-muted-foreground mt-1">Configure business receipt details, pricing rules, and database backups</p>
      </div>

      {/* Hidden file inputs */}
      <input 
        type="file" 
        ref={fullBackupFileRef} 
        onChange={handleFullBackupFileSelected} 
        accept=".json" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={vehicleFileRef} 
        onChange={handleVehicleFileSelected} 
        accept=".xlsx,.xls,.csv,.json" 
        className="hidden" 
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. BUSINESS BRANDING & PRICING RULES */}
      {/* ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Rental Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Rental & Pricing Rules</CardTitle>
            <CardDescription>Configure currency symbol and hourly calculation rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <SelectItem value="CEIL">Round Up to Next Hour</SelectItem>
                    <SelectItem value="GRACE_PERIOD">Grace Period (0–15 min free · 16–45 min = ½hr · 46+ min = 1hr)</SelectItem>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. BACKUP & DISASTER RECOVERY */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Card className="border-blue-200 dark:border-blue-900/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Complete Database Backup & Disaster Recovery</CardTitle>
              <CardDescription>
                Download a complete snapshot of all branches, vehicles, users, customers, and rental records
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Save a backup file to your computer. If the server or database is ever wiped or migrated, you can restore all branches and vehicles in one click.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button 
              type="button" 
              onClick={handleDownloadFullBackup} 
              disabled={isExportingBackup}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExportingBackup ? 'Generating Backup...' : 'Download Full Backup (.json)'}
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              onClick={() => fullBackupFileRef.current?.click()}
              className="border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              <Upload className="w-4 h-4 mr-2" />
              Restore Database from File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. VEHICLE FLEET BULK EXPORT & IMPORT */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Card className="border-emerald-200 dark:border-emerald-900/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Vehicle Fleet Bulk Import & Export</CardTitle>
              <CardDescription>
                Export fleet data to Excel or bulk upload new vehicles across all branches
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Quickly import 10, 50, or 100+ vehicles with their hourly rates and package pricing directly from an Excel spreadsheet.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleExportVehicles('excel')}
              className="border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
              Export Fleet to Excel (.xlsx)
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleExportVehicles('json')}
              className="border-slate-200 dark:border-slate-700"
            >
              <FileCode className="w-4 h-4 mr-2 text-slate-500" />
              Export Fleet (JSON)
            </Button>

            <Button 
              type="button" 
              onClick={() => vehicleFileRef.current?.click()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Import Vehicles (Excel/CSV)
            </Button>

            <button 
              type="button" 
              onClick={handleDownloadSampleTemplate}
              className="text-xs text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 flex items-center ml-2"
            >
              <Download className="w-3 h-3 mr-1" /> Download Excel Template
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. DANGER ZONE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Card className="border-red-200 dark:border-red-900/50">
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

      {/* TRUNCATE CONFIRMATION DIALOG */}
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

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: RESTORE SYSTEM BACKUP PREVIEW */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Dialog open={isRestoreModalOpen} onOpenChange={setIsRestoreModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-blue-600 dark:text-blue-400">
              <Database className="w-5 h-5 mr-2" /> Restore Database Backup
            </DialogTitle>
            <DialogDescription>
              Review the snapshot summary before applying the restore
            </DialogDescription>
          </DialogHeader>

          {restorePayload && !restoreResult && (
            <div className="space-y-4 py-2">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Exported Timestamp:</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    {restorePayload.exportedAt ? new Date(restorePayload.exportedAt).toLocaleString() : 'N/A'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Branches</p>
                    <p className="text-lg font-bold text-blue-600">{restorePayload.data?.branches?.length || 0}</p>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Vehicles</p>
                    <p className="text-lg font-bold text-emerald-600">{restorePayload.data?.vehicles?.length || 0}</p>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Users</p>
                    <p className="text-lg font-bold text-indigo-600">{restorePayload.data?.users?.length || 0}</p>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Customers</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{restorePayload.data?.customers?.length || 0}</p>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Rentals</p>
                    <p className="text-lg font-bold text-amber-600">{restorePayload.data?.rentals?.length || 0}</p>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Maintenance</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{restorePayload.data?.maintenance?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Existing records will be updated and missing records will be recreated. Passwords and branch associations are safely preserved.
                </span>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsRestoreModalOpen(false)}>Cancel</Button>
                <Button 
                  type="button" 
                  onClick={handleExecuteRestore} 
                  disabled={isRestoring}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {isRestoring ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Restoring Database...</> : 'Confirm & Restore Now'}
                </Button>
              </DialogFooter>
            </div>
          )}

          {restoreResult && (
            <div className="space-y-4 py-4 text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Restore Completed!</h3>
                <p className="text-sm text-muted-foreground mt-1">All data has been safely restored to PostgreSQL.</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border">
                <div>Branches: <strong>{restoreResult.stats?.branches}</strong></div>
                <div>Vehicles: <strong>{restoreResult.stats?.vehicles}</strong></div>
                <div>Users: <strong>{restoreResult.stats?.users}</strong></div>
                <div>Customers: <strong>{restoreResult.stats?.customers}</strong></div>
                <div>Rentals: <strong>{restoreResult.stats?.rentals}</strong></div>
                <div>Settings: <strong>{restoreResult.stats?.settings ? 'Yes' : 'No'}</strong></div>
              </div>

              <Button onClick={() => setIsRestoreModalOpen(false)} className="w-full">Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: VEHICLE BULK IMPORT PREVIEW */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Dialog open={isVehicleImportModalOpen} onOpenChange={setIsVehicleImportModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-emerald-600 dark:text-emerald-400">
              <Car className="w-5 h-5 mr-2" /> Bulk Import Vehicles Preview
            </DialogTitle>
            <DialogDescription>
              {vehicleImportData.length} vehicles parsed from file. Review before importing to database.
            </DialogDescription>
          </DialogHeader>

          {!vehicleImportResult && (
            <div className="space-y-4 py-2">
              <div className="max-h-64 overflow-y-auto border rounded-lg text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                    <tr>
                      <th className="p-2 border-b">Reg No.</th>
                      <th className="p-2 border-b">Vehicle Name</th>
                      <th className="p-2 border-b">Branch</th>
                      <th className="p-2 border-b">Rate/hr</th>
                      <th className="p-2 border-b">Deposit</th>
                      <th className="p-2 border-b">Packages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleImportData.map((v, i) => (
                      <tr key={i} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="p-2 font-mono font-medium">{v.vehicleNumber || v['Registration Number'] || v['Vehicle Number']}</td>
                        <td className="p-2">{v.vehicleName || v['Vehicle Name'] || v['Name']}</td>
                        <td className="p-2 text-muted-foreground">{v.branchName || v.branch || v['Branch Name'] || v['Branch'] || 'Auto-assign'}</td>
                        <td className="p-2 font-semibold text-emerald-600">{settings?.currencySymbol || '₹'}{v.hourlyRate || v['Hourly Rate'] || 0}</td>
                        <td className="p-2 text-muted-foreground">{settings?.currencySymbol || '₹'}{v.securityDeposit || v['Security Deposit'] || 0}</td>
                        <td className="p-2 text-[10px] text-slate-500">
                          {[
                            (v.rate1hr || v['1hr Rate']) ? `1h:${v.rate1hr || v['1hr Rate']}` : '',
                            (v.rate3hr || v['3hr Rate']) ? `3h:${v.rate3hr || v['3hr Rate']}` : '',
                            (v.rate6hr || v['6hr Rate']) ? `6h:${v.rate6hr || v['6hr Rate']}` : '',
                            (v.rate12hr || v['12hr Rate']) ? `12h:${v.rate12hr || v['12hr Rate']}` : '',
                            (v.rate24hr || v['24hr Rate']) ? `24h:${v.rate24hr || v['24hr Rate']}` : '',
                          ].filter(Boolean).join(', ') || 'Hourly only'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                <span>
                  Vehicles with existing registration numbers will have their pricing and details updated. New vehicles will be created and assigned to their matching branch.
                </span>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsVehicleImportModalOpen(false)}>Cancel</Button>
                <Button 
                  type="button" 
                  onClick={handleExecuteVehicleImport} 
                  disabled={isImportingVehicles}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {isImportingVehicles ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Importing {vehicleImportData.length} Vehicles...</> : `Import ${vehicleImportData.length} Vehicles Now`}
                </Button>
              </DialogFooter>
            </div>
          )}

          {vehicleImportResult && (
            <div className="space-y-4 py-4 text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Vehicle Import Successful!</h3>
                <p className="text-sm text-muted-foreground mt-1">Your fleet records have been synchronized.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border max-w-sm mx-auto">
                <div className="p-2 bg-white dark:bg-slate-800 rounded border">
                  <p className="text-xs text-muted-foreground">New Vehicles Added</p>
                  <p className="text-xl font-bold text-emerald-600">{vehicleImportResult.created || 0}</p>
                </div>
                <div className="p-2 bg-white dark:bg-slate-800 rounded border">
                  <p className="text-xs text-muted-foreground">Existing Updated</p>
                  <p className="text-xl font-bold text-blue-600">{vehicleImportResult.updated || 0}</p>
                </div>
              </div>

              {vehicleImportResult.errors?.length > 0 && (
                <div className="text-left text-xs bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 max-h-32 overflow-y-auto">
                  <p className="font-semibold mb-1">Warnings:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {vehicleImportResult.errors.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button onClick={() => setIsVehicleImportModalOpen(false)} className="w-full">Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
