import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useAppStore } from '@/store';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { FileSpreadsheet, FileDown, CalendarRange, DollarSign, Wallet, Building2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Reports() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [isExporting, setIsExporting] = useState(false);
  const { currencySymbol } = useAppStore();

  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');

  const [rentals, setRentals] = useState<any[]>([]);
  const [activeRentals, setActiveRentals] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [revStartDate, setRevStartDate] = useState(today);
  const [revEndDate, setRevEndDate] = useState(today);
  const [revVehicleId, setRevVehicleId] = useState<string>('ALL');

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const b = await api.get<any[]>('/branches');
      setBranches(b || []);
    } catch (e) {
      console.error('Failed to load branches:', e);
    }
  };

  const loadDashboardData = async () => {
    try {
      const start = new Date(revStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(revEndDate);
      end.setHours(23, 59, 59, 999);
      
      let query = `/rentals?status=COMPLETED&returnDateGte=${start.toISOString()}&returnDateLte=${end.toISOString()}`;
      if (revVehicleId !== 'ALL') {
        query += `&vehicleId=${revVehicleId}`;
      }
      if (selectedBranchId !== 'ALL') {
        query += `&branchId=${selectedBranchId}`;
      }

      let activeQuery = `/rentals?status=ACTIVE`;
      if (selectedBranchId !== 'ALL') {
        activeQuery += `&branchId=${selectedBranchId}`;
      }

      let vehicleQuery = `/vehicles`;
      if (selectedBranchId !== 'ALL') {
        vehicleQuery += `?branchId=${selectedBranchId}`;
      }

      const [r, v, activeR] = await Promise.all([
        api.get<any[]>(query),
        api.get<any[]>(vehicleQuery),
        api.get<any[]>(activeQuery),
      ]);

      setRentals(r || []);
      setActiveRentals(activeR || []);
      setVehicles(v || []);
    } catch (err: any) {
      console.error('Failed to load report data:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [revStartDate, revEndDate, revVehicleId, selectedBranchId]);

  const totalRev = rentals.reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
  const totalBase = totalRev - rentals.reduce((sum, r) => sum + (Number(r.settlementAmount) || 0), 0);
  const totalAdvanceInHand = activeRentals.reduce((sum, r) => sum + (Number(r.depositAmount) || 0), 0);

  const handleExport = async (formatType: 'excel' | 'csv', overrideStart?: string, overrideEnd?: string) => {
    setIsExporting(true);
    try {
      const targetStart = overrideStart || startDate;
      const targetEnd = overrideEnd || endDate;

      const start = new Date(targetStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(targetEnd);
      end.setHours(23, 59, 59, 999);

      let query = `/rentals?status=COMPLETED&returnDateGte=${start.toISOString()}&returnDateLte=${end.toISOString()}`;
      if (selectedBranchId !== 'ALL') {
        query += `&branchId=${selectedBranchId}`;
      }

      const fetchedRentals = await api.get<any[]>(query);
      const exportRentals = fetchedRentals || [];

      if (exportRentals.length === 0) {
        alert('No completed rentals found for this date range and branch.');
        return;
      }

      const totalRevenue = exportRentals.reduce((sum: number, r: any) => sum + (Number(r.totalAmount) || 0), 0);
      const totalHours = exportRentals.reduce((sum: number, r: any) => sum + (Number(r.totalHours) || 0), 0);
      const totalSettlements = exportRentals.reduce((sum: number, r: any) => sum + (Number(r.settlementAmount) || 0), 0);
      const totalBase = totalRevenue - totalSettlements;

      const data = exportRentals.map((r: any) => ({
        'Rental ID': `RNT-${r.id}`,
        'Customer Name': r.customer.name,
        'Customer Mobile': r.customer.mobileNumber,
        'Vehicle': `${r.vehicle.vehicleName} (${r.vehicle.vehicleNumber})`,
        'Package': r.selectedPackage || 'HOURLY',
        'Hourly Rate': r.vehicle.hourlyRate,
        'Pickup Date': format(new Date(r.pickupDate), 'PPp'),
        'Return Date': format(new Date(r.returnDate), 'PPp'),
        'Total Hours': (() => { const m = Math.round((r.totalHours || 0) * 60); return `${Math.floor(m / 60)}:${(m % 60).toString().padStart(2, '0')}`; })(),
        'Base Rent': (Number(r.totalAmount || 0) - Number(r.settlementAmount || 0)),
        'Settlement': r.settlementAmount || 0,
        'Net Amount': r.totalAmount || 0,
        'Deposit': r.depositAmount || 0,
        'Notes': r.notes || '',
      }));

      data.push({
        'Rental ID': '',
        'Customer Name': '',
        'Customer Mobile': '',
        'Vehicle': '',
        'Package': '',
        'Hourly Rate': '' as any,
        'Pickup Date': '',
        'Return Date': 'TOTALS:',
        'Total Hours': (() => { const m = Math.round(totalHours * 60); return `${Math.floor(m / 60)}:${(m % 60).toString().padStart(2, '0')}`; })(),
        'Base Rent': totalBase,
        'Settlement': totalSettlements,
        'Net Amount': totalRevenue,
        'Deposit': '' as any,
        'Notes': '',
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      
      const colWidths = Object.keys(data[0]).map(key => ({
        wch: Math.max(key.length, ...data.map(row => String((row as any)[key] || '').length)) + 2
      }));
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Rental Report');

      const fileName = `Rental_Report_${targetStart}_to_${targetEnd}`;
      if (formatType === 'excel') {
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      } else {
        XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExport = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    handleExport('excel', start, end);
  };

  const selectedBranchName = selectedBranchId === 'ALL'
    ? 'All Branches (Global)'
    : (branches.find(b => b.id === selectedBranchId)?.name || selectedBranchId);

  const selectedVehicleName = revVehicleId === 'ALL'
    ? 'All Vehicles'
    : (vehicles.find(v => v.id === revVehicleId)?.vehicleName || revVehicleId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Financial Analytics</h1>
          <p className="text-muted-foreground mt-1">Generate and export rental performance reports</p>
        </div>

        {/* Global Branch Filter for Reports */}
        <div className="w-64">
          <Select value={selectedBranchId} onValueChange={(v: string | null) => setSelectedBranchId(v || 'ALL')}>
            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
              <Building2 className="w-4 h-4 mr-2 text-blue-500 shrink-0" />
              <SelectValue placeholder="Filter by Branch">
                {selectedBranchName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Branches (Global)</SelectItem>
              {branches.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-dashed hover:border-solid hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CalendarRange className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Custom Date Range Report</CardTitle>
                <CardDescription>Export completed rentals for a specific period</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start Date</Label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">End Date</Label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
            <div className="flex space-x-3 pt-2">
              <Button 
                onClick={() => handleExport('excel')} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={isExporting}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Excel'}
              </Button>
              <Button 
                onClick={() => handleExport('csv')} 
                variant="outline"
                className="flex-1"
                disabled={isExporting}
              >
                <FileDown className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Report Shortcuts */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
            <CardDescription>One-click export for common date ranges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => {
              const t = new Date();
              handleQuickExport(format(t, 'yyyy-MM-dd'), format(t, 'yyyy-MM-dd'));
            }} disabled={isExporting}>
              📅 Today's Report
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => {
              const t = new Date();
              const weekStart = new Date(t);
              weekStart.setDate(t.getDate() - t.getDay());
              handleQuickExport(format(weekStart, 'yyyy-MM-dd'), format(t, 'yyyy-MM-dd'));
            }} disabled={isExporting}>
              📊 This Week's Report
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => {
              const t = new Date();
              const monthStart = new Date(t.getFullYear(), t.getMonth(), 1);
              handleQuickExport(format(monthStart, 'yyyy-MM-dd'), format(t, 'yyyy-MM-dd'));
            }} disabled={isExporting}>
              📆 This Month's Report
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => {
              const t = new Date();
              const lastMonth = new Date(t.getFullYear(), t.getMonth() - 1, 1);
              const lastMonthEnd = new Date(t.getFullYear(), t.getMonth(), 0);
              handleQuickExport(format(lastMonth, 'yyyy-MM-dd'), format(lastMonthEnd, 'yyyy-MM-dd'));
            }} disabled={isExporting}>
              🗓️ Last Month's Report
            </Button>
          </CardContent>
        </Card>

        {/* Revenue Dashboard */}
        <Card className="col-span-1 lg:col-span-2 border-2 border-blue-100 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
              Revenue Dashboard
            </CardTitle>
            <CardDescription>Track income by specific periods and vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={revStartDate} onChange={e => setRevStartDate(e.target.value)} />
              </div>
              <div className="flex-1 space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={revEndDate} onChange={e => setRevEndDate(e.target.value)} />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Vehicle Filter</Label>
                <Select value={revVehicleId} onValueChange={(v: string | null) => setRevVehicleId(v || 'ALL')}>
                  <SelectTrigger>
                    <SelectValue>
                      {selectedVehicleName}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border shadow-sm">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Revenue</p>
                <h3 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{currencySymbol}{totalRev.toFixed(2)}</h3>
                <p className="text-sm text-slate-500 mt-2">{rentals.length} completed rentals</p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border shadow-sm">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Base Income</p>
                <h3 className="text-3xl font-bold">{currencySymbol}{totalBase.toFixed(2)}</h3>
                <p className="text-sm text-slate-500 mt-2">Without settlement adjustments</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-800 shadow-sm">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center">
                  <Wallet className="w-4 h-4 mr-1.5" /> Advance In Hand
                </p>
                <h3 className="text-4xl font-bold text-amber-600 dark:text-amber-400">{currencySymbol}{totalAdvanceInHand.toFixed(2)}</h3>
                <p className="text-sm text-amber-600/70 dark:text-amber-500/70 mt-2">{activeRentals.length} active rental{activeRentals.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center">
                <p className="text-sm font-medium text-muted-foreground mb-1">Quick Filters</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <Button variant="secondary" size="sm" onClick={() => {
                    const t = new Date();
                    setRevStartDate(format(t, 'yyyy-MM-dd'));
                    setRevEndDate(format(t, 'yyyy-MM-dd'));
                  }}>Today</Button>
                  <Button variant="secondary" size="sm" onClick={() => {
                    const t = new Date();
                    const m = new Date(t.getFullYear(), t.getMonth(), 1);
                    setRevStartDate(format(m, 'yyyy-MM-dd'));
                    setRevEndDate(format(t, 'yyyy-MM-dd'));
                  }}>This Month</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
