import { useEffect, useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useAppStore } from '@/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Edit, Plus, FileSpreadsheet, Upload, Download, CheckCircle2, RefreshCw, Info, Building2 } from 'lucide-react';
import * as XLSX from 'xlsx';

export function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const { currencySymbol } = useAppStore();

  // Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleName: '',
    vehicleType: '',
    hourlyRate: 0,
    securityDeposit: 0,
    rate1hr: '',
    rate3hr: '',
    rate6hr: '',
    rate12hr: '',
    rate24hr: '',
    description: '',
    status: 'AVAILABLE',
    branchId: ''
  });

  useEffect(() => {
    loadVehicles();
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const data = await api.get<any[]>('/branches?slim=true');
      setBranches(data || []);
    } catch (err) {
      console.error('Failed to load branches:', err);
    }
  };

  const loadVehicles = async () => {
    try {
      const data = await api.get<any[]>('/vehicles');
      setVehicles(data || []);
    } catch (err: any) {
      console.error('Failed to load vehicles:', err);
    }
  };

  const handleOpenDialog = (vehicle?: any) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        vehicleNumber: vehicle.vehicleNumber || '',
        vehicleName: vehicle.vehicleName || '',
        vehicleType: vehicle.vehicleType || '',
        hourlyRate: vehicle.hourlyRate || 0,
        securityDeposit: vehicle.securityDeposit || 0,
        rate1hr: vehicle.rate1hr ?? '',
        rate3hr: vehicle.rate3hr ?? '',
        rate6hr: vehicle.rate6hr ?? '',
        rate12hr: vehicle.rate12hr ?? '',
        rate24hr: vehicle.rate24hr ?? '',
        description: vehicle.description || '',
        status: vehicle.status || 'AVAILABLE',
        branchId: vehicle.branchId || ''
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        vehicleNumber: '',
        vehicleName: '',
        vehicleType: '',
        hourlyRate: 0,
        securityDeposit: 0,
        rate1hr: '',
        rate3hr: '',
        rate6hr: '',
        rate12hr: '',
        rate24hr: '',
        description: '',
        status: 'AVAILABLE',
        branchId: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      ...formData,
      hourlyRate: Number(formData.hourlyRate),
      securityDeposit: Number(formData.securityDeposit),
      rate1hr: formData.rate1hr !== '' ? Number(formData.rate1hr) : null,
      rate3hr: formData.rate3hr !== '' ? Number(formData.rate3hr) : null,
      rate6hr: formData.rate6hr !== '' ? Number(formData.rate6hr) : null,
      rate12hr: formData.rate12hr !== '' ? Number(formData.rate12hr) : null,
      rate24hr: formData.rate24hr !== '' ? Number(formData.rate24hr) : null,
      branchId: formData.branchId || undefined,
    };

    try {
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, payload);
      } else {
        await api.post('/vehicles', payload);
      }
      setIsDialogOpen(false);
      loadVehicles();
    } catch (err: any) {
      alert('Failed to save vehicle: ' + err.message);
    }
  };

  const selectedBranchName = useMemo(() => {
    const targetId = formData.branchId || editingVehicle?.branchId;
    if (!targetId) return '';
    const found = branches.find(b => b.id === targetId);
    return found?.name || editingVehicle?.branch?.name || '';
  }, [formData.branchId, editingVehicle, branches]);

  const vehiclesGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((v) => (
        <Card key={v.id} className="overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
          <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/50 border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold flex items-center text-slate-900 dark:text-slate-100">
                  <Car className="w-5 h-5 mr-2 text-slate-400" />
                  {v.vehicleName}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground font-mono">{v.vehicleNumber}</p>
                  {v.branch && (
                    <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                      <Building2 className="w-3 h-3 mr-1 text-slate-400" />
                      {v.branch.name}
                    </span>
                  )}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${v.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800' : 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800'}`}>
                {v.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-4 flex-1">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Hourly Rate</p>
                <p className="font-medium text-emerald-600 dark:text-emerald-400 text-lg">{currencySymbol}{v.hourlyRate}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Deposit</p>
                <p className="font-medium">{currencySymbol}{v.securityDeposit}</p>
              </div>
            </div>
            
            {(v.rate1hr || v.rate3hr || v.rate6hr || v.rate12hr || v.rate24hr) && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-2">Packages</p>
                <div className="flex flex-wrap gap-2">
                  {v.rate1hr && <span className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md font-medium">1h: {currencySymbol}{v.rate1hr}</span>}
                  {v.rate3hr && <span className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md font-medium">3h: {currencySymbol}{v.rate3hr}</span>}
                  {v.rate6hr && <span className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md font-medium">6h: {currencySymbol}{v.rate6hr}</span>}
                  {v.rate12hr && <span className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md font-medium">12h: {currencySymbol}{v.rate12hr}</span>}
                  {v.rate24hr && <span className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md font-medium">24h: {currencySymbol}{v.rate24hr}</span>}
                </div>
              </div>
            )}
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Button variant="outline" className="w-full shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-colors" onClick={() => handleOpenDialog(v)}>
              <Edit className="w-4 h-4 mr-2" /> Edit Vehicle
            </Button>
          </div>
        </Card>
      ))}
      {vehicles.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No vehicles found. Add your first vehicle to this branch!
        </div>
      )}
    </div>
  ), [vehicles, currencySymbol]);

  const handleExportVehicles = () => {
    if (vehicles.length === 0) {
      alert('No vehicles to export.');
      return;
    }

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

    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 22 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 14 },
      { wch: 25 },
    ];

    XLSX.writeFile(workbook, `SB_Rental_Vehicles_${new Date().toISOString().slice(0, 10)}.xlsx`);
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

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheet];
        const rows = XLSX.utils.sheet_to_json<any>(sheet);

        if (!rows || rows.length === 0) {
          alert('No vehicle rows found in spreadsheet.');
          return;
        }

        setImportData(rows);
        setImportResult(null);
        setIsImportModalOpen(true);
      } catch (err: any) {
        alert('Failed to parse Excel file: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleExecuteImport = async () => {
    if (!importData || importData.length === 0) return;
    setIsImporting(true);
    try {
      const res = await api.post('/backup/vehicles/import', { vehicles: importData });
      setImportResult(res);
      loadVehicles();
    } catch (err: any) {
      alert('Vehicle import failed: ' + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelected} 
        accept=".xlsx,.xls,.csv" 
        className="hidden" 
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage fleet vehicles and hourly rental packages</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportVehicles}
            className="border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" /> Export Excel
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            className="border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          >
            <Upload className="w-4 h-4 mr-1.5 text-blue-600" /> Bulk Import
          </Button>

          <Button onClick={() => handleOpenDialog()} className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add Vehicle
          </Button>
        </div>
      </div>

      {vehiclesGrid}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-1">
            
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Vehicle Number (Reg. No)</Label>
                  <Input value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} required placeholder="e.g. GJ01AB1234" />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Name</Label>
                  <Input value={formData.vehicleName} onChange={e => setFormData({...formData, vehicleName: e.target.value})} required placeholder="e.g. Honda Activa 6G" />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Input value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} required placeholder="e.g. Scooter, Bike" />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(val: string | null) => setFormData({...formData, status: val || 'AVAILABLE'})}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="RENTED">Rented</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                <span className="w-1.5 h-4 bg-emerald-500 rounded-full mr-2"></span>
                Pricing & Packages
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Hourly Rate ({currencySymbol})</Label>
                  <Input type="number" step="0.01" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: Number(e.target.value)})} required />
                </div>
                <div className="space-y-2">
                  <Label>Security Deposit ({currencySymbol})</Label>
                  <Input type="number" step="0.01" value={formData.securityDeposit} onChange={e => setFormData({...formData, securityDeposit: Number(e.target.value)})} required />
                </div>
                <div className="space-y-2">
                  <Label>1 Hour Package <span className="text-muted-foreground text-xs font-normal">(Opt)</span></Label>
                  <Input type="number" step="0.01" value={formData.rate1hr || ''} onChange={e => setFormData({...formData, rate1hr: e.target.value})} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>3 Hours Package <span className="text-muted-foreground text-xs font-normal">(Opt)</span></Label>
                  <Input type="number" step="0.01" value={formData.rate3hr || ''} onChange={e => setFormData({...formData, rate3hr: e.target.value})} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>6 Hours Package <span className="text-muted-foreground text-xs font-normal">(Opt)</span></Label>
                  <Input type="number" step="0.01" value={formData.rate6hr || ''} onChange={e => setFormData({...formData, rate6hr: e.target.value})} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>12 Hours Package <span className="text-muted-foreground text-xs font-normal">(Opt)</span></Label>
                  <Input type="number" step="0.01" value={formData.rate12hr || ''} onChange={e => setFormData({...formData, rate12hr: e.target.value})} placeholder="0.00" />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label>24 Hours Package <span className="text-muted-foreground text-xs font-normal">(Opt)</span></Label>
                  <Input type="number" step="0.01" value={formData.rate24hr || ''} onChange={e => setFormData({...formData, rate24hr: e.target.value})} placeholder="0.00" />
                </div>
              </div>
            </div>

            {branches.length > 0 && (
              <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1 flex items-center">
                  <Building2 className="w-4 h-4 mr-1.5 text-amber-600" />
                  {editingVehicle ? 'Transfer Vehicle to Another Branch' : 'Assign to Branch'}
                </h3>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mb-3">
                  {editingVehicle 
                    ? 'Select a target branch to transfer this vehicle permanently. Upon saving, it will automatically move to that branch fleet.'
                    : 'Assign this vehicle to a specific branch fleet.'}
                </p>
                <div className="space-y-1.5 max-w-sm">
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Target Branch Fleet</Label>
                  <Select 
                    value={formData.branchId || (editingVehicle?.branchId ?? '')} 
                    onValueChange={(val: string | null) => setFormData({...formData, branchId: val || ''})}
                  >
                    <SelectTrigger className="bg-white dark:bg-slate-900">
                      <SelectValue placeholder="Select Branch">
                        {selectedBranchName}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(b => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" size="lg" className="px-6 shadow-sm">Save Vehicle</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-emerald-600 dark:text-emerald-400">
              <Car className="w-5 h-5 mr-2" /> Bulk Import Vehicles
            </DialogTitle>
            <DialogDescription>
              {importData.length} vehicles parsed from Excel file. Review before uploading.
            </DialogDescription>
          </DialogHeader>

          {!importResult && (
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
                    {importData.map((v, i) => (
                      <tr key={i} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="p-2 font-mono font-medium">{v.vehicleNumber || v['Registration Number'] || v['Vehicle Number']}</td>
                        <td className="p-2">{v.vehicleName || v['Vehicle Name'] || v['Name']}</td>
                        <td className="p-2 text-muted-foreground">{v.branchName || v.branch || v['Branch Name'] || v['Branch'] || 'Auto-assign'}</td>
                        <td className="p-2 font-semibold text-emerald-600">{currencySymbol}{v.hourlyRate || v['Hourly Rate'] || 0}</td>
                        <td className="p-2 text-muted-foreground">{currencySymbol}{v.securityDeposit || v['Security Deposit'] || 0}</td>
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

              <div className="flex items-center justify-between text-xs pt-1">
                <button 
                  type="button" 
                  onClick={handleDownloadSampleTemplate}
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 flex items-center"
                >
                  <Download className="w-3 h-3 mr-1" /> Download Excel Sample Template
                </button>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsImportModalOpen(false)}>Cancel</Button>
                <Button 
                  type="button" 
                  onClick={handleExecuteImport} 
                  disabled={isImporting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {isImporting ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Importing {importData.length} Vehicles...</> : `Import ${importData.length} Vehicles Now`}
                </Button>
              </DialogFooter>
            </div>
          )}

          {importResult && (
            <div className="space-y-4 py-4 text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Import Successful!</h3>
                <p className="text-sm text-muted-foreground mt-1">Vehicle fleet has been synchronized with the database.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border max-w-sm mx-auto">
                <div className="p-2 bg-white dark:bg-slate-800 rounded border">
                  <p className="text-xs text-muted-foreground">New Added</p>
                  <p className="text-xl font-bold text-emerald-600">{importResult.created || 0}</p>
                </div>
                <div className="p-2 bg-white dark:bg-slate-800 rounded border">
                  <p className="text-xs text-muted-foreground">Updated</p>
                  <p className="text-xl font-bold text-blue-600">{importResult.updated || 0}</p>
                </div>
              </div>

              {importResult.errors?.length > 0 && (
                <div className="text-left text-xs bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 max-h-32 overflow-y-auto">
                  <p className="font-semibold mb-1">Warnings:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {importResult.errors.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button onClick={() => setIsImportModalOpen(false)} className="w-full">Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
