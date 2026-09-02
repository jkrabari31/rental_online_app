import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useAppStore } from '@/store';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Wrench, 
  Car, 
  CreditCard, 
  Building2, 
  Calendar, 
  Download, 
  Filter, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart as PieIcon, 
  Activity,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { format, subDays, startOfMonth, startOfYear, endOfMonth } from 'date-fns';
import * as XLSX from 'xlsx';

export function Analysis() {
  const { currencySymbol } = useAppStore();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');

  // Date Filter State - default to ALL_TIME so all past and sample data shows immediately
  const [datePreset, setDatePreset] = useState<string>('ALL_TIME');
  const [startDate, setStartDate] = useState<string>('ALL');
  const [endDate, setEndDate] = useState<string>('ALL');

  // Preset Date Handlers
  const handlePresetChange = (preset: string | null) => {
    if (!preset) return;
    setDatePreset(preset);
    const now = new Date();
    if (preset === 'ALL_TIME') {
      setStartDate('ALL');
      setEndDate('ALL');
    } else if (preset === 'TODAY') {
      const todayStr = format(now, 'yyyy-MM-dd');
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'LAST_7_DAYS') {
      setStartDate(format(subDays(now, 7), 'yyyy-MM-dd'));
      setEndDate(format(now, 'yyyy-MM-dd'));
    } else if (preset === 'THIS_MONTH') {
      setStartDate(format(startOfMonth(now), 'yyyy-MM-dd'));
      setEndDate(format(endOfMonth(now), 'yyyy-MM-dd'));
    } else if (preset === 'LAST_30_DAYS') {
      setStartDate(format(subDays(now, 30), 'yyyy-MM-dd'));
      setEndDate(format(now, 'yyyy-MM-dd'));
    } else if (preset === 'THIS_YEAR') {
      setStartDate(format(startOfYear(now), 'yyyy-MM-dd'));
      setEndDate(format(now, 'yyyy-MM-dd'));
    }
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      let url = `/analytics?startDate=${startDate}&endDate=${endDate}`;
      if (selectedBranchId !== 'ALL') {
        url += `&branchId=${selectedBranchId}`;
      }
      const res = await api.get<any>(url);
      setData(res);
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
      setErrorMessage(err.message || 'Failed to fetch analytics data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedBranchId, startDate, endDate]);

  const kpis = data?.kpis || {};
  const branchRevenueList = data?.branchRevenueList || [];
  const paymentSplit = data?.paymentSplit || [];
  const fleetDistribution = data?.fleetDistribution || [];
  const maintenanceByCategory = data?.maintenanceByCategory || [];
  const timeline = data?.timeline || [];
  const topVehicles = data?.topVehicles || [];
  const branches = data?.branches || [];

  // Export Analytics Summary to Excel
  const handleExportAnalytics = () => {
    if (!data) return;

    const summarySheetData = [
      { Metric: 'Date Range', Value: `${startDate} to ${endDate}` },
      { Metric: 'Selected Branch', Value: selectedBranchId === 'ALL' ? 'All Branches' : branches.find((b: any) => b.id === selectedBranchId)?.name || selectedBranchId },
      { Metric: 'Gross Revenue', Value: `${currencySymbol}${kpis.totalRevenue || 0}` },
      { Metric: 'Total Maintenance Cost', Value: `${currencySymbol}${kpis.totalMaintenance || 0}` },
      { Metric: 'Net Profit', Value: `${currencySymbol}${kpis.netProfit || 0}` },
      { Metric: 'Cash Collections', Value: `${currencySymbol}${kpis.cashRevenue || 0} (${kpis.cashCount || 0} transactions)` },
      { Metric: 'Online / UPI Collections', Value: `${currencySymbol}${kpis.onlineRevenue || 0} (${kpis.onlineCount || 0} transactions)` },
      { Metric: 'Total Fleet Size', Value: kpis.totalVehicles || 0 },
      { Metric: 'Fleet Utilization Rate', Value: `${kpis.utilizationRate || 0}%` },
      { Metric: 'Completed Trips', Value: kpis.totalCompletedRentals || 0 },
      { Metric: 'Active Trips', Value: kpis.totalActiveRentals || 0 },
    ];

    const branchSheetData = branchRevenueList.map((b: any) => ({
      'Branch Name': b.branchName,
      'Location': b.location,
      'Revenue': b.revenue,
      'Maintenance Cost': b.maintenance,
      'Net Profit': b.netProfit,
      'Total Trips': b.rentalsCount,
      'Fleet Count': b.vehiclesCount,
    }));

    const topVehiclesSheetData = topVehicles.map((v: any, index: number) => ({
      'Rank': index + 1,
      'Vehicle Name': v.name,
      'Registration Number': v.number,
      'Branch': v.branchName,
      'Revenue Generated': v.revenue,
      'Total Trips': v.trips,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summarySheetData), 'KPI Summary');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(branchSheetData), 'Branch Performance');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(topVehiclesSheetData), 'Top Vehicles');

    XLSX.writeFile(workbook, `SB_Rental_Analytics_${startDate}_to_${endDate}.xlsx`);
  };

  // Custom Chart Tooltips
  const CustomCurrencyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl text-xs space-y-1.5 min-w-[140px]">
          <p className="font-bold text-slate-800 dark:text-slate-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center space-x-2">
              <span className="flex items-center space-x-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {currencySymbol}{Number(entry.value).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
            Executive Business Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Multi-branch revenue streams, payment overflows, fleet metrics & profit analysis
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Branch Filter */}
          <div className="w-48 sm:w-56">
            <Select value={selectedBranchId} onValueChange={(val: string | null) => setSelectedBranchId(val || 'ALL')}>
              <SelectTrigger className="h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xs font-medium">
                <Building2 className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Branches (Global)</SelectItem>
                {branches.map((b: any) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Presets */}
          <div className="w-36">
            <Select value={datePreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xs font-medium">
                <Calendar className="w-4 h-4 mr-2 text-indigo-600 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_TIME">All Time</SelectItem>
                <SelectItem value="TODAY">Today</SelectItem>
                <SelectItem value="LAST_7_DAYS">Last 7 Days</SelectItem>
                <SelectItem value="THIS_MONTH">This Month</SelectItem>
                <SelectItem value="LAST_30_DAYS">Last 30 Days</SelectItem>
                <SelectItem value="THIS_YEAR">This Year</SelectItem>
                <SelectItem value="CUSTOM">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Pickers */}
          {datePreset === 'CUSTOM' && (
            <div className="flex items-center space-x-2">
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="h-10 w-36 rounded-xl" 
              />
              <span className="text-muted-foreground text-xs font-semibold">to</span>
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="h-10 w-36 rounded-xl" 
              />
            </div>
          )}

          {/* Refresh Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => loadAnalytics()}
            disabled={isLoading}
            className="h-10 border-slate-200 dark:border-slate-800 rounded-xl font-medium shadow-xs"
          >
            <Activity className={`w-4 h-4 mr-1 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* Export Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportAnalytics}
            className="h-10 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl font-medium shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" /> Export Excel
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <Button size="sm" variant="outline" onClick={() => loadAnalytics()}>Retry</Button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP EXECUTIVE KPI CARDS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Gross Revenue */}
        <Card className="border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/70 via-white to-white dark:from-slate-900 dark:to-slate-900/90 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Gross Revenue</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {currencySymbol}{Number(kpis.totalRevenue || 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-2.5">
              <span>{kpis.totalCompletedRentals || 0} completed trips</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Active
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Cost */}
        <Card className="border-rose-200/80 dark:border-rose-900/50 bg-gradient-to-br from-rose-50/70 via-white to-white dark:from-slate-900 dark:to-slate-900/90 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Maintenance Expenses</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {currencySymbol}{Number(kpis.totalMaintenance || 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
                <Wrench className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-2.5">
              <span>Fleet repairs & servicing</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> Outflow
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card className="border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/70 via-white to-white dark:from-slate-900 dark:to-slate-900/90 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Net Operating Profit</p>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {currencySymbol}{Number(kpis.netProfit || 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-2.5">
              <span>Revenue minus repairs</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {kpis.totalRevenue > 0 ? `${((kpis.netProfit / kpis.totalRevenue) * 100).toFixed(0)}% Margin` : '0%'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Fleet Utilization */}
        <Card className="border-indigo-200/80 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/70 via-white to-white dark:from-slate-900 dark:to-slate-900/90 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Fleet Utilization</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {kpis.utilizationRate || 0}%
                </h3>
              </div>
              <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Car className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-2.5">
              <span>{kpis.rentedVehicles || 0} rented / {kpis.totalVehicles || 0} total</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {kpis.availableVehicles || 0} available
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. CHARTS SECTION 1: REVENUE TIMELINE & PAYMENT OVERFLOW */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue & Expense Timeline */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/80 dark:border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-bold">Revenue & Maintenance Timeline</CardTitle>
                <CardDescription>Daily gross collections vs maintenance expenditure</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {timeline.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="maintGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                    <XAxis dataKey="dateFormatted" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip content={<CustomCurrencyTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
                    <Area type="monotone" dataKey="maintenance" name="Maintenance" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#maintGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                No revenue records found for selected date filter.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Online vs Cash Payment Split */}
        <Card className="shadow-sm border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Payment Mode Split</CardTitle>
            <CardDescription>Cash collections vs Online / UPI overflow</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex-1 flex flex-col justify-center">
            {kpis.totalRevenue > 0 ? (
              <>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentSplit}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {paymentSplit.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomCurrencyTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {paymentSplit.map((p: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                      <div className="flex items-center justify-center space-x-1.5 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{p.name}</span>
                      </div>
                      <p className="text-base font-bold text-slate-900 dark:text-white">{currencySymbol}{p.value.toLocaleString()}</p>
                      <p className="text-[11px] text-muted-foreground">{p.percentage}% ({p.count} txns)</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-52 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                No payment transactions recorded.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. CHARTS SECTION 2: BRANCH-WISE COMPARISON & FLEET BREAKDOWN */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch-wise Revenue & Net Profit */}
        <Card className="shadow-sm border-slate-200/80 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Branch Revenue & Profitability</CardTitle>
            <CardDescription>Revenue vs maintenance costs across branches</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {branchRevenueList.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchRevenueList} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                    <XAxis dataKey="branchName" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip content={<CustomCurrencyTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Bar dataKey="revenue" name="Gross Revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="maintenance" name="Maintenance" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="netProfit" name="Net Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                No branch data available.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Fleet Distribution by Branch */}
        <Card className="shadow-sm border-slate-200/80 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Fleet Status by Branch</CardTitle>
            <CardDescription>Available, Rented, and Inactive vehicles per branch</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {fleetDistribution.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fleetDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                    <XAxis dataKey="branchName" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Bar dataKey="available" name="Available" stackId="a" fill="#10b981" />
                    <Bar dataKey="rented" name="On Rent" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="inactive" name="Inactive / Repair" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                No vehicles registered.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. CHARTS SECTION 3: TOP VEHICLES & MAINTENANCE CATEGORIES */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Vehicles Table */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/80 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Top Performing Vehicles</CardTitle>
            <CardDescription>Highest revenue generating vehicles during selected period</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {topVehicles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="py-3 px-2 font-semibold">Rank</th>
                      <th className="py-3 px-2 font-semibold">Vehicle</th>
                      <th className="py-3 px-2 font-semibold">Branch</th>
                      <th className="py-3 px-2 font-semibold text-center">Completed Trips</th>
                      <th className="py-3 px-2 font-semibold text-right">Revenue Generated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {topVehicles.map((v: any, index: number) => (
                      <tr key={index} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            index === 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' :
                            index === 1 ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' :
                            index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' :
                            'text-muted-foreground'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <p className="font-bold text-slate-900 dark:text-white">{v.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{v.number}</p>
                        </td>
                        <td className="py-3 px-2 text-xs text-slate-600 dark:text-slate-400">
                          {v.branchName || 'Main Branch'}
                        </td>
                        <td className="py-3 px-2 text-center font-semibold text-blue-600 dark:text-blue-400">
                          {v.trips}
                        </td>
                        <td className="py-3 px-2 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                          {currencySymbol}{Number(v.revenue).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                No rental trips recorded for this date period.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Categories Breakdown */}
        <Card className="shadow-sm border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Maintenance Breakdown</CardTitle>
            <CardDescription>Repair costs classified by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex-1">
            {maintenanceByCategory.length > 0 ? (
              <div className="space-y-3">
                {maintenanceByCategory.map((cat: any, i: number) => {
                  const percent = kpis.totalMaintenance > 0 
                    ? Math.round((cat.amount / kpis.totalMaintenance) * 100) 
                    : 0;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800 dark:text-slate-200">{cat.category}</span>
                        <span className="text-rose-600 dark:text-rose-400">{currencySymbol}{cat.amount.toLocaleString()} ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                No maintenance records for selected period.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
