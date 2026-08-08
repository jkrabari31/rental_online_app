import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppStore } from '@/store';
import { api } from '@/lib/api';
import { Wrench, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export function Maintenance() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currencySymbol } = useAppStore();

  const [formData, setFormData] = useState({
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    remarks: ''
  });

  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterVehicleId, setFilterVehicleId] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const v = await api.get<any[]>('/vehicles');
      setVehicles(v || []);
      const m = await api.get<any[]>('/maintenance');
      setMaintenanceRecords(m || []);
    } catch (err: any) {
      console.error('Failed to load maintenance data:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.date || !formData.amount) return;

    setIsSubmitting(true);
    try {
      await api.post('/maintenance', {
        vehicleId: formData.vehicleId,
        date: formData.date,
        amount: parseFloat(formData.amount),
        remarks: formData.remarks
      });
      setFormData({
        ...formData,
        amount: '',
        remarks: ''
      });
      await loadData();
    } catch (err) {
      console.error('Failed to add maintenance:', err);
      alert('Failed to add maintenance record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = maintenanceRecords.filter(m => {
    if (filterVehicleId !== 'ALL' && m.vehicleId !== filterVehicleId) return false;
    if (filterStartDate) {
      const start = new Date(filterStartDate);
      start.setHours(0, 0, 0, 0);
      if (new Date(m.date) < start) return false;
    }
    if (filterEndDate) {
      const end = new Date(filterEndDate);
      end.setHours(23, 59, 59, 999);
      if (new Date(m.date) > end) return false;
    }
    return true;
  });

  const handleExport = () => {
    if (filteredRecords.length === 0) {
      alert('No records to export.');
      return;
    }

    const data = filteredRecords.map((m: any) => ({
      'Date': format(new Date(m.date), 'PP'),
      'Vehicle Name': m.vehicle?.vehicleName || 'Unknown',
      'Vehicle Number': m.vehicle?.vehicleNumber || 'Unknown',
      'Amount': m.amount,
      'Remarks': m.remarks || ''
    }));

    const totalAmount = filteredRecords.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
    
    data.push({
      'Date': 'TOTAL:',
      'Vehicle Name': '',
      'Vehicle Number': '',
      'Amount': totalAmount,
      'Remarks': ''
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    
    const colWidths = Object.keys(data[0]).map(key => ({
      wch: Math.max(key.length, ...data.map(row => String((row as any)[key] || '').length)) + 2
    }));
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Maintenance');

    XLSX.writeFile(workbook, `Maintenance_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Expenses</h1>
          <p className="text-muted-foreground mt-1">Track and manage vehicle maintenance and repairs</p>
        </div>
        <Button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Record Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-400">
              <Wrench className="w-5 h-5 mr-2" /> Add New Record
            </CardTitle>
            <CardDescription>Log a new maintenance expense for a vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select value={formData.vehicleId} onValueChange={(v: string | null) => setFormData({...formData, vehicleId: v || ''})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle">
                      {formData.vehicleId 
                        ? (() => {
                            const v = vehicles.find(v => v.id === formData.vehicleId);
                            return v ? `${v.vehicleName} - ${v.vehicleNumber}` : 'Select a vehicle';
                          })()
                        : 'Select a vehicle'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.vehicleName} - {v.vehicleNumber}</SelectItem>
                    ))}
                    {vehicles.length === 0 && <SelectItem value="none" disabled>No vehicles available</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              </div>

              <div className="space-y-2">
                <Label>Amount ({currencySymbol})</Label>
                <Input type="number" step="0.01" min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <Label>Remarks</Label>
                <Input value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} placeholder="Oil change, tire rotation, repair, etc." />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Record'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Maintenance History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Maintenance History</CardTitle>
            <CardDescription>All recorded maintenance expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 space-y-1">
                <Label>Start Date</Label>
                <Input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} />
              </div>
              <div className="flex-1 space-y-1">
                <Label>End Date</Label>
                <Input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} />
              </div>
              <div className="flex-1 space-y-1">
                <Label>Vehicle</Label>
                <Select value={filterVehicleId} onValueChange={(v: string | null) => setFilterVehicleId(v || 'ALL')}>
                  <SelectTrigger>
                    <SelectValue>
                      {filterVehicleId === 'ALL' ? 'All Vehicles' : (
                        (() => {
                          const v = vehicles.find(v => v.id === filterVehicleId);
                          return v ? `${v.vehicleName} (${v.vehicleNumber})` : 'Select Vehicle';
                        })()
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Vehicles</SelectItem>
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.vehicleName} ({v.vehicleNumber})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.date), 'PP')}</TableCell>
                      <TableCell className="font-medium">
                        {record.vehicle?.vehicleName}
                        <div className="text-xs text-muted-foreground font-mono">{record.vehicle?.vehicleNumber}</div>
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">{currencySymbol}{Number(record.amount).toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate" title={record.remarks}>{record.remarks || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {filteredRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No maintenance records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
