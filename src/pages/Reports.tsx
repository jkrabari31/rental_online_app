import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useAppStore } from '@/store';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import {
  FileSpreadsheet,
  FileDown,
  CalendarRange,
  DollarSign,
  Wallet,
  Building2,
  Receipt,
  Tag,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Reports() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [isExporting, setIsExporting] = useState(false);
  const { currencySymbol } = useAppStore();

  const [settings, setSettings] = useState<any>(null);
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
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const s = await api.get<any>('/settings');
      setSettings(s || {});
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  };

  const loadBranches = async () => {
    try {
      const b = await api.get<any[]>('/branches?slim=true');
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

  // Helper to compute system standard gross billable charge based on duration and vehicle package/hourly rates
  const calculateGrossRentalAmount = (r: any, roundingRule: string = 'EXACT'): number => {
    if (!r) return 0;
    if (!r.pickupDate || !r.returnDate || !r.vehicle) {
      return Number(r.totalAmount) || 0;
    }

    const start = new Date(r.pickupDate);
    const end = new Date(r.returnDate);
    if (end < start) return 0;

    const diffMins = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000));
    const vehicle = r.vehicle;
    const hourlyRate = Number(vehicle.hourlyRate) || 0;
    const pkg = r.selectedPackage || 'HOURLY';

    let pkgHours = 0;
    let pkgPrice = 0;

    if (pkg === '1HR' && vehicle.rate1hr) { pkgHours = 1; pkgPrice = vehicle.rate1hr; }
    else if (pkg === '3HR' && vehicle.rate3hr) { pkgHours = 3; pkgPrice = vehicle.rate3hr; }
    else if (pkg === '6HR' && vehicle.rate6hr) { pkgHours = 6; pkgPrice = vehicle.rate6hr; }
    else if (pkg === '12HR' && vehicle.rate12hr) { pkgHours = 12; pkgPrice = vehicle.rate12hr; }
    else if (pkg === '24HR' && vehicle.rate24hr) { pkgHours = 24; pkgPrice = vehicle.rate24hr; }

    let baseAmount = 0;
    let extraHours = 0;

    if (pkgHours > 0) {
      baseAmount = pkgPrice;
      const pkgMinutes = pkgHours * 60;
      const overtimeMinutes = Math.max(0, diffMins - pkgMinutes);

      if (overtimeMinutes > 0) {
        if (roundingRule === 'EXACT') {
          extraHours = overtimeMinutes / 60;
        } else if (roundingRule === 'CEIL') {
          extraHours = Math.ceil(overtimeMinutes / 60);
        } else if (roundingRule === 'ROUND_30') {
          const whole = Math.floor(overtimeMinutes / 60);
          const rem = overtimeMinutes % 60;
          extraHours = rem === 0 ? whole : rem <= 30 ? whole + 0.5 : whole + 1;
        } else if (roundingRule === 'GRACE_15') {
          const whole = Math.floor(overtimeMinutes / 60);
          const rem = overtimeMinutes % 60;
          extraHours = rem <= 15 ? whole : whole + 1;
        } else if (roundingRule === 'GRACE_PERIOD') {
          const whole = Math.floor(overtimeMinutes / 60);
          const rem = overtimeMinutes % 60;
          if (rem <= 15) {
            extraHours = whole;
          } else if (rem <= 45) {
            extraHours = whole + 0.5;
          } else {
            extraHours = whole + 1;
          }
        }
      }
    } else {
      // HOURLY Rental: First 1 Hour (60 min) is FIXED minimum base rate
      baseAmount = hourlyRate;
      const overtimeMinutes = Math.max(0, diffMins - 60);

      if (overtimeMinutes > 0) {
        if (roundingRule === 'EXACT') {
          extraHours = overtimeMinutes / 60;
        } else if (roundingRule === 'CEIL') {
          extraHours = Math.ceil(overtimeMinutes / 60);
        } else if (roundingRule === 'ROUND_30') {
          const whole = Math.floor(overtimeMinutes / 60);
          const rem = overtimeMinutes % 60;
          extraHours = rem === 0 ? whole : rem <= 30 ? whole + 0.5 : whole + 1;
        } else if (roundingRule === 'GRACE_15') {
          const whole = Math.floor(overtimeMinutes / 60);
          const rem = overtimeMinutes % 60;
          extraHours = rem <= 15 ? whole : whole + 1;
        } else if (roundingRule === 'GRACE_PERIOD') {
          const whole = Math.floor(overtimeMinutes / 60);
          const rem = overtimeMinutes % 60;
          if (rem <= 15) {
            extraHours = whole;
          } else if (rem <= 45) {
            extraHours = whole + 0.5;
          } else {
            extraHours = whole + 1;
          }
        }
      }
    }

    return Math.max(0, baseAmount + (extraHours * hourlyRate));
  };

  const roundingRule = settings?.hourlyRoundingRule || 'EXACT';
  const totalActualRev = rentals.reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
  const totalGross = rentals.reduce((sum, r) => sum + calculateGrossRentalAmount(r, roundingRule), 0);
  const totalDiscount = totalActualRev - totalGross;
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

      const rule = settings?.hourlyRoundingRule || 'EXACT';
      const totalRevenue = exportRentals.reduce((sum: number, r: any) => sum + (Number(r.totalAmount) || 0), 0);
      const totalGrossExport = exportRentals.reduce((sum: number, r: any) => sum + calculateGrossRentalAmount(r, rule), 0);
      const totalHours = exportRentals.reduce((sum: number, r: any) => sum + (Number(r.totalHours) || 0), 0);
      const totalSettlements = exportRentals.reduce((sum: number, r: any) => sum + (Number(r.settlementAmount) || 0), 0);
      const totalDeposits = exportRentals.reduce((sum: number, r: any) => sum + (Number(r.depositAmount) || 0), 0);
      const totalAdjustment = totalRevenue - totalGrossExport;

      const data = exportRentals.map((r: any) => {
        const gross = calculateGrossRentalAmount(r, rule);
        const net = Number(r.totalAmount || 0);
        const adjustment = net - gross;
        return {
          'Rental ID': `RNT-${r.id}`,
          'Branch': r.branch?.name || '',
          'Customer Name': r.customer?.name || '',
          'Customer Mobile': r.customer?.mobileNumber || '',
          'Vehicle': `${r.vehicle?.vehicleName || ''} (${r.vehicle?.vehicleNumber || ''})`,
          'Package': r.selectedPackage || 'HOURLY',
          'Hourly Rate': r.vehicle?.hourlyRate || '',
          'Pickup Date': format(new Date(r.pickupDate), 'PPp'),
          'Return Date': format(new Date(r.returnDate), 'PPp'),
          'Total Hours': (() => { const m = Math.round((r.totalHours || 0) * 60); return `${Math.floor(m / 60)}:${(m % 60).toString().padStart(2, '0')}`; })(),
          'Gross Billable Rent': gross,
          'Advance Deposit': r.depositAmount || 0,
          'Settlement Collected': r.settlementAmount || 0,
          'Adjustment / Discount': adjustment,
          'Actual Collected (Net)': net,
          'Payment Mode': r.paymentMode || 'CASH',
          'Notes': r.notes || '',
        };
      });

      data.push({
        'Rental ID': '',
        'Branch': '',
        'Customer Name': '',
        'Customer Mobile': '',
        'Vehicle': '',
        'Package': '',
        'Hourly Rate': '' as any,
        'Pickup Date': '',
        'Return Date': 'TOTALS:',
        'Total Hours': (() => { const m = Math.round(totalHours * 60); return `${Math.floor(m / 60)}:${(m % 60).toString().padStart(2, '0')}`; })(),
        'Gross Billable Rent': totalGrossExport,
        'Advance Deposit': totalDeposits,
        'Settlement Collected': totalSettlements,
        'Adjustment / Discount': totalAdjustment,
        'Actual Collected (Net)': totalRevenue,
        'Payment Mode': '',
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
                <DatePicker value={startDate} onChange={setStartDate} placeholder="Start date" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">End Date</Label>
                <DatePicker value={endDate} onChange={setEndDate} placeholder="End date" />
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
            <CardDescription>Track income, settlements, and discounts by specific periods and vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 space-y-2">
                <Label>Start Date</Label>
                <DatePicker value={revStartDate} onChange={setRevStartDate} placeholder="Start date" />
              </div>
              <div className="flex-1 space-y-2">
                <Label>End Date</Label>
                <DatePicker value={revEndDate} onChange={setRevEndDate} placeholder="End date" />
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

            {/* Top Row: 3 Settlement & Revenue KPI Cards in a single line on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Card 1: Gross Revenue */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gross Revenue (કુલ આવક)</p>
                  <span className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Receipt className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {currencySymbol}{totalGross.toFixed(2)}
                </h3>
                <p className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                  <span>Standard hourly/package billing</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">{rentals.length} completed</span>
                </p>
              </div>

              {/* Card 2: Actual Collected Revenue (With Settlement) */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Actual Revenue (વાસ્તવિક આવક)</p>
                  <span className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <DollarSign className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {currencySymbol}{totalActualRev.toFixed(2)}
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Actual money received in hand (Deposit + Settlement)
                </p>
              </div>

              {/* Card 3: Exact Settlement Adjustment / Discount */}
              <div className={`p-6 rounded-xl border shadow-sm relative overflow-hidden transition-all ${totalDiscount < -0.01
                ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 hover:border-rose-300'
                : totalDiscount > 0.01
                  ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50 hover:border-purple-300'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}>
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-xs font-semibold uppercase tracking-wider ${totalDiscount < -0.01 ? 'text-rose-700 dark:text-rose-400' : totalDiscount > 0.01 ? 'text-purple-700 dark:text-purple-400' : 'text-slate-500'
                    }`}>
                    Settlement Adjustment
                  </p>
                  <span className={`p-2 rounded-lg ${totalDiscount < -0.01
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    : totalDiscount > 0.01
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                    {totalDiscount < -0.01 ? <TrendingDown className="w-4 h-4" /> : totalDiscount > 0.01 ? <TrendingUp className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                  </span>
                </div>
                <h3 className={`text-3xl font-extrabold tracking-tight ${totalDiscount < -0.01 ? 'text-rose-600 dark:text-rose-400' : totalDiscount > 0.01 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                  {totalDiscount < -0.01 ? `-${currencySymbol}${Math.abs(totalDiscount).toFixed(2)}` : totalDiscount > 0.01 ? `+${currencySymbol}${totalDiscount.toFixed(2)}` : `${currencySymbol}0.00`}
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  {totalDiscount < -0.01
                    ? `Total discount & waivers given`
                    : totalDiscount > 0.01
                      ? `Extra late / damage charges collected`
                      : `Exact matching (No adjustments / waivers)`}
                </p>
              </div>
            </div>

            {/* Bottom Row: Advance in Hand & Quick Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-50/70 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-800/60 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center">
                    <Wallet className="w-4 h-4 mr-1.5 text-amber-600" /> Advance Deposit In Hand
                  </p>
                  <h3 className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 mt-1">
                    {currencySymbol}{totalAdvanceInHand.toFixed(2)}
                  </h3>
                  <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">
                    Held from {activeRentals.length} active ongoing rental{activeRentals.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="hidden sm:flex p-3 bg-amber-100 dark:bg-amber-900/40 rounded-full text-amber-600 dark:text-amber-300">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Quick Date Range Filter
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    const t = new Date();
                    setRevStartDate(format(t, 'yyyy-MM-dd'));
                    setRevEndDate(format(t, 'yyyy-MM-dd'));
                  }}>Today</Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const t = new Date();
                    const weekStart = new Date(t);
                    weekStart.setDate(t.getDate() - t.getDay());
                    setRevStartDate(format(weekStart, 'yyyy-MM-dd'));
                    setRevEndDate(format(t, 'yyyy-MM-dd'));
                  }}>This Week</Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const t = new Date();
                    const m = new Date(t.getFullYear(), t.getMonth(), 1);
                    setRevStartDate(format(m, 'yyyy-MM-dd'));
                    setRevEndDate(format(t, 'yyyy-MM-dd'));
                  }}>This Month</Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const t = new Date();
                    const lastMonth = new Date(t.getFullYear(), t.getMonth() - 1, 1);
                    const lastMonthEnd = new Date(t.getFullYear(), t.getMonth(), 0);
                    setRevStartDate(format(lastMonth, 'yyyy-MM-dd'));
                    setRevEndDate(format(lastMonthEnd, 'yyyy-MM-dd'));
                  }}>Last Month</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
