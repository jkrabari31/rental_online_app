import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useAppStore } from '@/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Edit, Plus } from 'lucide-react';

export function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const { currencySymbol } = useAppStore();

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
    status: 'AVAILABLE'
  });

  useEffect(() => {
    loadVehicles();
  }, []);

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
        status: vehicle.status || 'AVAILABLE'
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
        status: 'AVAILABLE'
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      hourlyRate: Number(formData.hourlyRate),
      securityDeposit: Number(formData.securityDeposit),
      rate1hr: formData.rate1hr !== '' ? Number(formData.rate1hr) : null,
      rate3hr: formData.rate3hr !== '' ? Number(formData.rate3hr) : null,
      rate6hr: formData.rate6hr !== '' ? Number(formData.rate6hr) : null,
      rate12hr: formData.rate12hr !== '' ? Number(formData.rate12hr) : null,
      rate24hr: formData.rate24hr !== '' ? Number(formData.rate24hr) : null,
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
                <p className="text-sm text-muted-foreground mt-1 font-mono">{v.vehicleNumber}</p>
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage fleet vehicles and hourly rental packages</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
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
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(val: string | null) => setFormData({...formData, vehicleType: val || ''})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2 Wheeler">2 Wheeler</SelectItem>
                      <SelectItem value="4 Wheeler">4 Wheeler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v: string | null) => setFormData({...formData, status: v || 'AVAILABLE'})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="RENTED" disabled>Rented</SelectItem>
                      <SelectItem value="INACTIVE">Inactive / Under Repair</SelectItem>
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

            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" size="lg" className="px-6 shadow-sm">Save Vehicle</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
