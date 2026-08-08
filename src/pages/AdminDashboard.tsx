import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAppStore } from '@/store';
import { Activity, Car, DollarSign, Building2, TrendingUp, Filter, RefreshCw, Layers } from 'lucide-react';
import { format } from 'date-fns';

export function AdminDashboard() {
  const [adminData, setAdminData] = useState<any>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');
  const [branchDetailData, setBranchDetailData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currencySymbol } = useAppStore();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<any>('/dashboard/admin');
      setAdminData(data);
    } catch (err: any) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBranchId !== 'ALL') {
      loadBranchDetails(selectedBranchId);
    } else {
      setBranchDetailData(null);
    }
  }, [selectedBranchId]);

  const loadBranchDetails = async (branchId: string) => {
    try {
      const data = await api.get<any>(`/dashboard?branchId=${branchId}`);
      setBranchDetailData(data);
    } catch (err: any) {
      console.error('Failed to load branch details:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading master admin dashboard...</div>
      </div>
    );
  }

  const overall = adminData?.overall || {};
  const branches = adminData?.branches || [];

  const selectedBranchName = selectedBranchId === 'ALL' 
    ? 'All Branches (Global)' 
    : (branches.find((b: any) => b.id === selectedBranchId)?.name || selectedBranchId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Multi-branch enterprise overview & performance</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Branch Selector */}
          <div className="w-64">
            <Select value={selectedBranchId} onValueChange={(val: string | null) => setSelectedBranchId(val || 'ALL')}>
              <SelectTrigger className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
                <Filter className="w-4 h-4 mr-2 text-blue-500 shrink-0" />
                <SelectValue placeholder="Select Branch">
                  {selectedBranchName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Branches (Global)</SelectItem>
                {branches.map((b: any) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="icon" onClick={loadAdminData} title="Refresh Data">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Selected Branch View vs Master Overview */}
      {selectedBranchId === 'ALL' ? (
        <>
          {/* Global KPI Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/60 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">Active Branches</CardTitle>
                <div className="p-2 bg-blue-500/15 rounded-xl">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-950 dark:text-blue-50">{overall.totalBranches || 0}</div>
                <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mt-1 font-medium">Locations operating</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Active Rentals</CardTitle>
                <div className="p-2 bg-amber-500/15 rounded-xl">
                  <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-950 dark:text-amber-50">{overall.totalActiveRentals || 0}</div>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 font-medium">Across all branches</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 dark:from-emerald-950/40 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Today's Revenue</CardTitle>
                <div className="p-2 bg-emerald-500/15 rounded-xl">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-950 dark:text-emerald-50">{currencySymbol}{overall.revenueToday?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-1 font-medium">Earned today globally</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/60 dark:from-purple-950/40 dark:to-purple-900/20 border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">Monthly Revenue</CardTitle>
                <div className="p-2 bg-purple-500/15 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-950 dark:text-purple-50">{currencySymbol}{overall.revenueMonth?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-purple-700/80 dark:text-purple-400/80 mt-1 font-medium">{format(new Date(), 'MMMM yyyy')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Branch Performance Breakdown Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-blue-500" /> Branch Performance Breakdown
                </CardTitle>
                <CardDescription className="mt-1">Real-time breakdown of activity across all branch locations</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                      <TableHead>Branch Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-center">Total Vehicles</TableHead>
                      <TableHead className="text-center">Active Rentals</TableHead>
                      <TableHead className="text-right">Today's Revenue</TableHead>
                      <TableHead className="text-right">Month's Revenue</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branches.map((b: any) => (
                      <TableRow key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{b.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{b.location || '—'}</TableCell>
                        <TableCell className="text-center font-medium">{b.vehicles}</TableCell>
                        <TableCell className="text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {b.activeRentals}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                          {currencySymbol}{Number(b.revenueToday || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100">
                          {currencySymbol}{Number(b.revenueMonth || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700"
                            onClick={() => setSelectedBranchId(b.id)}
                          >
                            View Details →
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {branches.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No branches configured yet. Go to <a href="#/admin/branches" className="text-blue-500 underline">Branch Management</a> to add your first branch.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Detailed Specific Branch View */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {branches.find((b: any) => b.id === selectedBranchId)?.name} Branch
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Filtered view of branch activity and active rentals
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedBranchId('ALL')}>
              ← Back to All Branches
            </Button>
          </div>

          {branchDetailData ? (
            <>
              {/* Branch Stats */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-amber-800 dark:text-amber-300">Active Rentals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-amber-950 dark:text-amber-50">{branchDetailData.onRentVehicles}</div>
                  </CardContent>
                </Card>

                <Card className="bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Available Vehicles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-emerald-950 dark:text-emerald-50">
                      {branchDetailData.availableVehicles} / {branchDetailData.totalVehicles}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Rentals Table for Selected Branch */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Rentals in this Branch</CardTitle>
                </CardHeader>
                <CardContent>
                  {branchDetailData.activeRentals && branchDetailData.activeRentals.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Pickup Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {branchDetailData.activeRentals.map((r: any) => (
                          <TableRow key={r.id}>
                            <TableCell className="font-medium">{r.customer.name}</TableCell>
                            <TableCell>{r.vehicle.vehicleName} ({r.vehicle.vehicleNumber})</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{format(new Date(r.pickupDate), 'MMM d, h:mm a')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Car className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>No active rentals in this branch right now</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="animate-pulse text-center py-12 text-muted-foreground">Loading branch stats...</div>
          )}
        </div>
      )}
    </div>
  );
}
