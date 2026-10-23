import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { useAppStore } from '@/store';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { FileSpreadsheet, FileDown, Search, Printer, AlertTriangle, ShieldAlert, CheckCircle2, PlusCircle, Trash2, Clock, Car, User, Check, Bike, Filter, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '@/contexts/AuthContext';

export function CompletedRentals() {
  const { isAdmin } = useAuth();
  const [rentals, setRentals] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [challans, setChallans] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState<any>(null);

  // Challan management modals state
  const [isAddChallanOpen, setIsAddChallanOpen] = useState(false);
  const [isChallanListOpen, setIsChallanListOpen] = useState(false);
  const [challanFilter, setChallanFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('PENDING');
  const [challanSearch, setChallanSearch] = useState('');

  // Vehicle search & filter in Add Challan
  const [challanVehicleSearch, setChallanVehicleSearch] = useState('');
  const [challanVehicleTypeFilter, setChallanVehicleTypeFilter] = useState<'ALL' | '2W' | '4W'>('ALL');
  const [isVehicleSearchExpanded, setIsVehicleSearchExpanded] = useState(true);

  // Settle fine modal
  const [isPayChallanOpen, setIsPayChallanOpen] = useState(false);
  const [selectedChallanToPay, setSelectedChallanToPay] = useState<any>(null);
  const [payPaymentMode, setPayPaymentMode] = useState<'CASH' | 'ONLINE'>('CASH');
  const [payNotes, setPayNotes] = useState('');

  // Add Challan form state
  const [challanFormData, setChallanFormData] = useState({
    vehicleId: '',
    challanDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    amount: '',
    reason: 'Over-speeding',
    challanNumber: '',
    notes: '',
  });

  const [autoMatchState, setAutoMatchState] = useState<{
    loading: boolean;
    matched: boolean | null;
    rental: any;
    customer: any;
    message?: string;
    nearbyRentals?: any[];
  }>({
    loading: false,
    matched: null,
    rental: null,
    customer: null,
  });

  const today = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const yesterday = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return format(d, 'yyyy-MM-dd');
  }, []);

  // Admin defaults to Today; Branch defaults to Recent 2 Days (Yesterday to Today)
  const [startDate, setStartDate] = useState(() => (isAdmin ? today : yesterday));
  const [endDate, setEndDate] = useState(today);
  const [activePreset, setActivePreset] = useState<string>(() => (isAdmin ? 'today' : '2days'));

  // Sync dates when auth role resolves
  useEffect(() => {
    if (isAdmin) {
      setStartDate(today);
      setEndDate(today);
      setActivePreset('today');
    } else {
      setStartDate(yesterday);
      setEndDate(today);
      setActivePreset('2days');
    }
  }, [isAdmin, today, yesterday]);

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    if (preset === 'today') {
      setStartDate(today);
      setEndDate(today);
    } else if (preset === 'yesterday') {
      setStartDate(yesterday);
      setEndDate(yesterday);
    } else if (preset === '2days') {
      setStartDate(yesterday);
      setEndDate(today);
    } else if (preset === '7days') {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      setStartDate(format(d, 'yyyy-MM-dd'));
      setEndDate(today);
    } else if (preset === '30days') {
      const d = new Date();
      d.setDate(d.getDate() - 29);
      setStartDate(format(d, 'yyyy-MM-dd'));
      setEndDate(today);
    } else if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleCustomDateChange = (type: 'start' | 'end', val: string) => {
    setActivePreset('custom');
    if (!isAdmin) {
      // Strictly prevent selecting before yesterday or after today for branch users
      if (val && val < yesterday) val = yesterday;
      if (val && val > today) val = today;
    }
    if (type === 'start') setStartDate(val);
    else setEndDate(val);
  };

  const { currencySymbol } = useAppStore();

  useEffect(() => {
    loadData();
    loadVehicles();
    loadChallans();
  }, [startDate, endDate]);

  const loadData = async () => {
    try {
      let query = '/rentals?status=COMPLETED';
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query += `&returnDateGte=${start.toISOString()}`;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query += `&returnDateLte=${end.toISOString()}`;
      }

      const data = await api.get<any[]>(query);
      setRentals(data || []);

      if (!settings) {
        const loadedSettings = await api.get<any>('/settings');
        setSettings(loadedSettings);
      }
    } catch (err: any) {
      console.error('Failed to load completed rentals data:', err);
    }
  };

  const loadVehicles = async () => {
    try {
      const data = await api.get<any[]>('/vehicles?includeAllBranches=true');
      setVehicles(data || []);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    }
  };

  const loadChallans = async () => {
    try {
      const data = await api.get<any[]>('/challans');
      setChallans(data || []);
    } catch (err) {
      console.error('Failed to load challans:', err);
    }
  };

  const pendingChallansCount = useMemo(() => {
    return challans.filter(c => c.status === 'PENDING').length;
  }, [challans]);

  const vehicleMap = useMemo(() => {
    const map = new Map<string, any>();
    for (const v of vehicles) map.set(v.id, v);
    return map;
  }, [vehicles]);

  const selectedChallanVehicle = useMemo(() => {
    return challanFormData.vehicleId ? vehicleMap.get(challanFormData.vehicleId) : null;
  }, [challanFormData.vehicleId, vehicleMap]);

  const count2W = useMemo(() => {
    return vehicles.filter(v => {
      const t = (v.vehicleType || '').toLowerCase();
      return t.includes('2') || t.includes('bike') || t.includes('scooter') || t.includes('two');
    }).length;
  }, [vehicles]);

  const count4W = useMemo(() => {
    return vehicles.filter(v => {
      const t = (v.vehicleType || '').toLowerCase();
      return t.includes('4') || t.includes('car') || t.includes('suv') || t.includes('four');
    }).length;
  }, [vehicles]);

  const filteredChallanVehicles = useMemo(() => {
    let list = vehicles;
    if (challanVehicleTypeFilter === '2W') {
      list = list.filter(v => {
        const type = (v.vehicleType || '').toLowerCase();
        return type.includes('2') || type.includes('bike') || type.includes('scooter') || type.includes('two');
      });
    } else if (challanVehicleTypeFilter === '4W') {
      list = list.filter(v => {
        const type = (v.vehicleType || '').toLowerCase();
        return type.includes('4') || type.includes('car') || type.includes('suv') || type.includes('four');
      });
    }

    if (challanVehicleSearch) {
      const q = challanVehicleSearch.toLowerCase();
      list = list.filter(v =>
        (v.vehicleName || '').toLowerCase().includes(q) ||
        (v.vehicleNumber || '').toLowerCase().includes(q) ||
        (v.branch?.name || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [vehicles, challanVehicleTypeFilter, challanVehicleSearch]);

  // Run auto-match when vehicleId or challanDate changes
  const runAutoMatch = async (vId: string, dt: string) => {
    if (!vId || !dt) {
      setAutoMatchState({ loading: false, matched: null, rental: null, customer: null });
      return;
    }

    setAutoMatchState(prev => ({ ...prev, loading: true }));
    try {
      const res = await api.post<any>('/challans/auto-match', {
        vehicleId: vId,
        challanDate: new Date(dt).toISOString(),
      });

      if (res.matched && res.rental) {
        setAutoMatchState({
          loading: false,
          matched: true,
          rental: res.rental,
          customer: res.customer,
        });
      } else {
        setAutoMatchState({
          loading: false,
          matched: false,
          rental: null,
          customer: null,
          message: res.message,
          nearbyRentals: res.nearbyRentals || [],
        });
      }
    } catch (err: any) {
      console.error('Auto match failed:', err);
      setAutoMatchState({
        loading: false,
        matched: false,
        rental: null,
        customer: null,
        message: err.message || 'Auto-match failed',
      });
    }
  };

  const handleOpenAddChallan = () => {
    setChallanFormData({
      vehicleId: '',
      challanDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      amount: '',
      reason: 'Over-speeding',
      challanNumber: '',
      notes: '',
    });
    setChallanVehicleSearch('');
    setChallanVehicleTypeFilter('ALL');
    setIsVehicleSearchExpanded(true);
    setAutoMatchState({ loading: false, matched: null, rental: null, customer: null });
    setIsAddChallanOpen(true);
  };

  const handleOpenAddChallanForRental = (r: any) => {
    const pickupFormatted = format(new Date(r.pickupDate), "yyyy-MM-dd'T'HH:mm");
    setChallanFormData({
      vehicleId: r.vehicleId,
      challanDate: pickupFormatted,
      amount: '',
      reason: 'Over-speeding',
      challanNumber: '',
      notes: `Challan for Rental RNT-${r.id}`,
    });
    setChallanVehicleSearch('');
    setChallanVehicleTypeFilter('ALL');
    setIsVehicleSearchExpanded(false);
    setAutoMatchState({
      loading: false,
      matched: true,
      rental: r,
      customer: r.customer,
    });
    setIsAddChallanOpen(true);
  };

  const handleSaveChallan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challanFormData.vehicleId) {
      alert('Please select a vehicle.');
      return;
    }
    const amt = parseFloat(challanFormData.amount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid fine amount greater than 0.');
      return;
    }
    if (!autoMatchState.customer?.id) {
      alert('A customer must be linked to this challan. Please match or select a customer ride.');
      return;
    }

    try {
      await api.post('/challans', {
        vehicleId: challanFormData.vehicleId,
        rentalId: autoMatchState.rental?.id || null,
        customerId: autoMatchState.customer.id,
        challanNumber: challanFormData.challanNumber,
        challanDate: new Date(challanFormData.challanDate).toISOString(),
        amount: amt,
        reason: challanFormData.reason,
        notes: challanFormData.notes,
      });

      alert('Traffic challan successfully added! A red flag is now registered for this customer across all branches.');
      setIsAddChallanOpen(false);
      loadChallans();
      loadData();
    } catch (err: any) {
      alert('Failed to register challan: ' + (err.error || err.message));
    }
  };

  const openPayChallanDialog = (c: any) => {
    setSelectedChallanToPay(c);
    setPayPaymentMode('CASH');
    setPayNotes('');
    setIsPayChallanOpen(true);
  };

  const handleConfirmPayChallan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallanToPay) return;

    try {
      await api.post(`/challans/${selectedChallanToPay.id}/pay`, {
        paidPaymentMode: payPaymentMode,
        paymentNotes: payNotes,
      });

      alert(`Fine of ${currencySymbol}${selectedChallanToPay.amount} successfully collected & cleared!`);
      setIsPayChallanOpen(false);
      loadChallans();
      loadData();
    } catch (err: any) {
      alert('Failed to clear fine: ' + (err.error || err.message));
    }
  };

  const handleDeleteChallan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challan record?')) return;
    try {
      await api.delete(`/challans/${id}`);
      loadChallans();
      loadData();
    } catch (err: any) {
      alert('Failed to delete challan: ' + (err.error || err.message));
    }
  };

  const filteredChallans = useMemo(() => {
    let list = challans;
    if (challanFilter !== 'ALL') {
      list = list.filter(c => c.status === challanFilter);
    }
    if (challanSearch) {
      const q = challanSearch.toLowerCase();
      list = list.filter(c =>
        (c.customer?.name || '').toLowerCase().includes(q) ||
        (c.customer?.mobileNumber || '').toLowerCase().includes(q) ||
        (c.vehicle?.vehicleName || '').toLowerCase().includes(q) ||
        (c.vehicle?.vehicleNumber || '').toLowerCase().includes(q) ||
        (c.challanNumber || '').toLowerCase().includes(q) ||
        (c.reason || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [challans, challanFilter, challanSearch]);

  const filteredRentals = useMemo(() => {
    const s = search.toLowerCase();
    return rentals.filter(r =>
      (r.customer?.name || '').toLowerCase().includes(s) ||
      (r.vehicle?.vehicleName || '').toLowerCase().includes(s) ||
      (r.vehicle?.vehicleNumber || '').toLowerCase().includes(s) ||
      String(r.id || '').includes(s)
    );
  }, [rentals, search]);

  const exportData = (formatType: 'excel' | 'csv') => {
    if (filteredRentals.length === 0) {
      alert('No data to export.');
      return;
    }

    const data = filteredRentals.map(r => {
      const row: Record<string, any> = {
        'Rental ID': `RNT-${r.id}`,
        'Branch': r.branch?.name || '',
        'Customer Name': r.customer.name,
        'Customer Mobile': r.customer.mobileNumber,
        'Vehicle': `${r.vehicle.vehicleName} (${r.vehicle.vehicleNumber})`,
        'Package': r.selectedPackage || 'HOURLY',
        'Pickup Date': format(new Date(r.pickupDate), 'PPp'),
        'Return Date': r.returnDate ? format(new Date(r.returnDate), 'PPp') : 'N/A',
        'Total Hours': (() => { const m = Math.round((r.totalHours || 0) * 60); return `${Math.floor(m / 60)}:${(m % 60).toString().padStart(2, '0')}`; })(),
      };

      if (isAdmin) {
        row['Base Rent'] = (Number(r.totalAmount || 0) - Number(r.settlementAmount || 0));
        row['Settlement'] = r.settlementAmount || 0;
        row['Net Amount'] = r.totalAmount || 0;
        row['Deposit'] = r.depositAmount || 0;
        row['Deposit Mode'] = r.depositPaymentMode || 'CASH';
      }

      row['Balance Mode'] = r.paymentMode || 'CASH';
      row['Split Payment'] = (r.depositAmount > 0 && r.depositPaymentMode !== r.paymentMode) ? 'YES' : 'NO';
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Completed Rentals');

    const fileName = `Completed_Rentals_${format(new Date(), 'yyyy-MM-dd')}`;
    if (formatType === 'excel') {
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } else {
      XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
    }
  };

  const printReceipt = (rental: any) => {
    const companyName = settings?.companyName || 'Vehicle Rental';
    const companyContact = settings?.companyContact ? `Contact: ${settings.companyContact}` : '';
    const companyAddress = settings?.companyAddress ? `<br/>${settings.companyAddress}` : '';
    const footerText = settings?.receiptFooterText || 'Thank you for your business!';

    const printContent = `
      <div style="max-width: 400px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 15px;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 800;">${companyName}</h1>
          <p style="margin: 5px 0 0; color: #555; font-size: 12px;">${companyContact}${companyAddress}</p>
          <div style="margin-top: 10px; font-size: 14px; font-weight: bold;">Receipt RNT-${rental.id}</div>
        </div>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #666;">Customer</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">${rental.customer.name}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Mobile</td><td style="padding: 6px 0; text-align: right;">${rental.customer.mobileNumber}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Vehicle</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">${rental.vehicle.vehicleName}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Reg. No.</td><td style="padding: 6px 0; text-align: right;">${rental.vehicle.vehicleNumber}</td></tr>
          <tr style="border-top: 1px solid #eee;"><td style="padding: 6px 0; color: #666;">Pickup</td><td style="padding: 6px 0; text-align: right;">${format(new Date(rental.pickupDate), 'PPp')}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Return</td><td style="padding: 6px 0; text-align: right;">${rental.returnDate ? format(new Date(rental.returnDate), 'PPp') : 'N/A'}</td></tr>
          <tr style="border-top: 1px solid #eee;"><td style="padding: 6px 0; color: #666;">Total Hours</td><td style="padding: 6px 0; text-align: right;">${(() => { const m = Math.round((rental.totalHours || 0) * 60); return `${Math.floor(m / 60)}:${(m % 60).toString().padStart(2, '0')}`; })()} (HH:MM)</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Package</td><td style="padding: 6px 0; text-align: right;">${rental.selectedPackage || 'HOURLY'}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Deposit Paid</td><td style="padding: 6px 0; text-align: right;">${currencySymbol}${rental.depositAmount || 0} ${rental.depositAmount > 0 ? `(${rental.depositPaymentMode === 'ONLINE' ? 'Online/UPI' : 'Cash'})` : ''}</td></tr>
          <tr style="border-top: 1px solid #eee;"><td style="padding: 6px 0; color: #666;">Base Rent & Overtime</td><td style="padding: 6px 0; text-align: right;">${currencySymbol}${(Number(rental.totalAmount || 0) - Number(rental.settlementAmount || 0)).toFixed(2)}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Settlement Adjustments</td><td style="padding: 6px 0; text-align: right;">${Number(rental.settlementAmount) < 0 ? '-' : ''}${currencySymbol}${Math.abs(Number(rental.settlementAmount || 0)).toFixed(2)}</td></tr>
          <tr style="border-top: 1px solid #eee;"><td style="padding: 6px 0; color: #666;">Balance Mode</td><td style="padding: 6px 0; text-align: right; font-weight: 700; color: ${(rental.paymentMode || 'CASH') === 'ONLINE' ? '#2563eb' : '#059669'}">${rental.paymentMode === 'ONLINE' ? '📱 Online / UPI' : '💵 Cash'}</td></tr>
        </table>
        <div style="border-top: 2px solid #333; margin-top: 15px; padding-top: 15px; text-align: center;">
          <div style="font-size: 22px; font-weight: 700;">Total: ${currencySymbol}${Number(rental.totalAmount || 0).toFixed(2)}</div>
        </div>
        <p style="text-align: center; color: #999; font-size: 11px; margin-top: 20px;">${footerText}</p>
      </div>
    `;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    if (iframe.contentDocument) {
      iframe.contentDocument.write(printContent);
      iframe.contentDocument.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Completed Transactions</h1>
            <p className="text-muted-foreground mt-1">{filteredRentals.length} records found</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Challans management buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChallanListOpen(true)}
              className="relative border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold"
            >
              <ShieldAlert className="w-4 h-4 mr-1.5 text-amber-600 dark:text-amber-400" />
              Traffic Fines
              {pendingChallansCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-xs bg-red-600 text-white font-bold">
                  {pendingChallansCount} pending
                </span>
              )}
            </Button>

            <Button
              size="sm"
              onClick={handleOpenAddChallan}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm"
            >
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              + Add Challan / Fine
            </Button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-44 sm:w-52 pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => exportData('excel')}>
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
              <FileDown className="w-4 h-4 mr-2" /> CSV
            </Button>
          </div>
        </div>

        {/* Date Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Filters:</span>
            {!isAdmin ? (
              <>
                <Button
                  size="sm"
                  variant={activePreset === '2days' ? 'default' : 'outline'}
                  className="h-8 text-xs font-medium"
                  onClick={() => applyPreset('2days')}
                >
                  Recent 2 Days
                </Button>
                <Button
                  size="sm"
                  variant={activePreset === 'today' ? 'default' : 'outline'}
                  className="h-8 text-xs font-medium"
                  onClick={() => applyPreset('today')}
                >
                  Today Only
                </Button>
                <Button
                  size="sm"
                  variant={activePreset === 'yesterday' ? 'default' : 'outline'}
                  className="h-8 text-xs font-medium"
                  onClick={() => applyPreset('yesterday')}
                >
                  Yesterday Only
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant={activePreset === 'today' ? 'default' : 'outline'}
                  className="h-8 text-xs font-medium"
                  onClick={() => applyPreset('today')}
                >
                  Today
                </Button>
                <Button
                  size="sm"
                  variant={activePreset === 'yesterday' ? 'default' : 'outline'}
                  className="h-8 text-xs font-medium"
                  onClick={() => applyPreset('yesterday')}
                >
                  Yesterday
                </Button>
                <Button
                  size="sm"
                  variant={activePreset === '7days' ? 'default' : 'outline'}
                  className="h-8 text-xs font-medium"
                  onClick={() => applyPreset('7days')}
                >
                  Last 7 Days
                </Button>
                <Button
                  size="sm"
                  variant={activePreset === '30days' ? 'default' : 'outline'}
                  className="h-8 text-xs font-medium"
                  onClick={() => applyPreset('30days')}
                >
                  Last 30 Days
                </Button>
                <Button
                  size="sm"
                  variant={activePreset === 'all' ? 'default' : 'outline'}
                  className="h-8 text-xs font-medium"
                  onClick={() => applyPreset('all')}
                >
                  All Time
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground font-medium">Custom:</span>
            <DatePicker
              value={startDate}
              onChange={val => handleCustomDateChange('start', val)}
              size="sm"
              className="w-[145px]"
              placeholder="Start date"
            />
            <span className="text-muted-foreground text-xs font-medium">to</span>
            <DatePicker
              value={endDate}
              onChange={val => handleCustomDateChange('end', val)}
              size="sm"
              className="w-[145px]"
              placeholder="End date"
            />
          </div>
        </div>
      </div>

      <div className="border rounded-xl bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
              <TableHead>Rental ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Pickup</TableHead>
              <TableHead>Return</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Package</TableHead>
              {isAdmin && <TableHead>Amount</TableHead>}
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRentals.map((r) => {
              const pendingChallan = r.challans?.find((c: any) => c.status === 'PENDING');
              const paidChallan = r.challans?.find((c: any) => c.status === 'PAID');

              return (
                <TableRow key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <TableCell className="font-mono font-medium text-blue-600 dark:text-blue-400">
                    <div>RNT-{r.id}</div>
                    {pendingChallan && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800">
                        <AlertTriangle className="w-2.5 h-2.5 text-red-600" />
                        Challan {currencySymbol}{pendingChallan.amount}
                      </span>
                    )}
                    {!pendingChallan && paidChallan && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                        Fine Paid
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{r.customer.name}</div>
                    <div className="text-xs text-muted-foreground">{r.customer.mobileNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div>{r.vehicle.vehicleName}</div>
                    <div className="text-xs text-muted-foreground font-mono">{r.vehicle.vehicleNumber}</div>
                  </TableCell>
                  <TableCell className="text-sm">{format(new Date(r.pickupDate), 'MMM d, h:mm a')}</TableCell>
                  <TableCell className="text-sm">{r.returnDate ? format(new Date(r.returnDate), 'MMM d, h:mm a') : '—'}</TableCell>
                  <TableCell>{(() => { const m = Math.round((r.totalHours || 0) * 60); return `${Math.floor(m / 60)}:${(m % 60).toString().padStart(2, '0')}`; })()}</TableCell>
                  <TableCell><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-semibold">{r.selectedPackage || 'HOURLY'}</span></TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400">{currencySymbol}{Number(r.totalAmount || 0).toFixed(2)}</div>
                      {Number(r.settlementAmount) !== 0 && (
                        <div className="text-[10px] text-muted-foreground whitespace-nowrap">Includes {Number(r.settlementAmount) < 0 ? '-' : '+'}{currencySymbol}{Math.abs(Number(r.settlementAmount)).toFixed(2)} stl.</div>
                      )}
                      {Number(r.depositAmount) > 0 && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-500 whitespace-nowrap">Deposit: {currencySymbol}{r.depositAmount}</div>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap inline-flex items-center w-fit ${
                        (r.paymentMode || 'CASH') === 'ONLINE'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      }`}>
                        {(r.paymentMode || 'CASH') === 'ONLINE' ? '📱 Online' : '💵 Cash'}
                      </span>
                      {r.depositAmount > 0 && r.depositPaymentMode && r.depositPaymentMode !== r.paymentMode && (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          Dep: {r.depositPaymentMode === 'ONLINE' ? '📱 Online' : '💵 Cash'}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Add traffic fine/challan for this rental"
                        onClick={() => handleOpenAddChallanForRental(r)}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => printReceipt(r)}>
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredRentals.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 10 : 9} className="text-center py-10 text-muted-foreground">
                  {!isAdmin ? 'No completed rentals found for the recent 2 days.' : 'No completed rentals found for the selected date range.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ADD CHALLAN DIALOG WITH AUTO-MATCH */}
      <Dialog open={isAddChallanOpen} onOpenChange={setIsAddChallanOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Add Traffic Challan / Penalty
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveChallan} className="space-y-4 mt-2">
            {/* Challan Violation Date & Time */}
            <div className="space-y-1">
              <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Challan Violation Date & Time *
              </Label>
              <Input
                type="datetime-local"
                value={challanFormData.challanDate}
                onChange={(e) => {
                  const nextDate = e.target.value;
                  setChallanFormData(prev => ({ ...prev, challanDate: nextDate }));
                  if (challanFormData.vehicleId) {
                    runAutoMatch(challanFormData.vehicleId, nextDate);
                  }
                }}
                required
                className="bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            {/* Vehicle Selection Section with Search & Filters */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-blue-500" />
                  Vehicle Selection *
                </Label>
                {selectedChallanVehicle && !isVehicleSearchExpanded && (
                  <button
                    type="button"
                    onClick={() => setIsVehicleSearchExpanded(true)}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Change Vehicle
                  </button>
                )}
              </div>

              {/* Selected Vehicle Card (shows exact Vehicle Name & Plate, NEVER raw ID) */}
              {selectedChallanVehicle && (
                <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border-2 border-blue-400 dark:border-blue-700 rounded-xl flex items-center justify-between transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 text-white rounded-lg shadow-sm">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {selectedChallanVehicle.vehicleName}
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold shadow-xs">
                          {selectedChallanVehicle.vehicleNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                          {selectedChallanVehicle.vehicleType || 'Vehicle'}
                        </span>
                        {selectedChallanVehicle.branch?.name && (
                          <span>• Branch: <strong>{selectedChallanVehicle.branch.name}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVehicleSearchExpanded(prev => !prev)}
                    className="h-8 text-xs font-semibold shrink-0"
                  >
                    {isVehicleSearchExpanded ? 'Hide Search' : 'Change'}
                  </Button>
                </div>
              )}

              {/* Search & Filter Dropdown Box */}
              {(!selectedChallanVehicle || isVehicleSearchExpanded) && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 animate-in fade-in duration-200">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vehicle name or registration plate (e.g. Thar, Activa, GJ-06)..."
                      value={challanVehicleSearch}
                      onChange={e => setChallanVehicleSearch(e.target.value)}
                      className="pl-9 pr-8 h-9 text-xs bg-white dark:bg-slate-950"
                      autoFocus={!selectedChallanVehicle}
                    />
                    {challanVehicleSearch && (
                      <button
                        type="button"
                        onClick={() => setChallanVehicleSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-slate-400" /> Filter:
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant={challanVehicleTypeFilter === 'ALL' ? 'default' : 'outline'}
                      className="h-7 text-xs px-2.5 font-medium"
                      onClick={() => setChallanVehicleTypeFilter('ALL')}
                    >
                      All ({vehicles.length})
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={challanVehicleTypeFilter === '2W' ? 'default' : 'outline'}
                      className="h-7 text-xs px-2.5 font-medium"
                      onClick={() => setChallanVehicleTypeFilter('2W')}
                    >
                      🛵 2 Wheelers ({count2W})
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={challanVehicleTypeFilter === '4W' ? 'default' : 'outline'}
                      className="h-7 text-xs px-2.5 font-medium"
                      onClick={() => setChallanVehicleTypeFilter('4W')}
                    >
                      🚗 4 Wheelers ({count4W})
                    </Button>
                  </div>

                  {/* Vehicle Options List */}
                  <div className="max-h-48 overflow-y-auto space-y-1 pt-1 pr-1 border-t mt-1">
                    {filteredChallanVehicles.map(v => {
                      const isSelected = challanFormData.vehicleId === v.id;
                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            setChallanFormData(prev => ({ ...prev, vehicleId: v.id }));
                            setIsVehicleSearchExpanded(false);
                            runAutoMatch(v.id, challanFormData.challanDate);
                          }}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-100/70 border-blue-500 text-blue-900 dark:bg-blue-950/70 dark:border-blue-600 dark:text-blue-100'
                              : 'bg-white dark:bg-slate-950 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{v.vehicleName}</span>
                            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-slate-700 dark:text-slate-300 font-semibold">
                              {v.vehicleNumber}
                            </span>
                            {v.branch?.name && (
                              <span className="text-[10px] text-muted-foreground hidden sm:inline">
                                ({v.branch.name})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-muted-foreground uppercase font-semibold">
                              {v.vehicleType || 'Vehicle'}
                            </span>
                            {isSelected ? (
                              <span className="font-bold text-blue-600 text-xs flex items-center gap-0.5">
                                <Check className="w-3.5 h-3.5" /> Selected
                              </span>
                            ) : (
                              <span className="text-blue-600 font-semibold hover:underline">Select</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {filteredChallanVehicles.length === 0 && (
                      <div className="py-5 text-center text-xs text-muted-foreground">
                        No vehicles found matching "{challanVehicleSearch}".
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AUTO-MATCH RESULT BOX */}
            <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/60 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Auto-Match Customer System
                </span>
                {autoMatchState.loading && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                    Checking ride records...
                  </span>
                )}
              </div>

              {autoMatchState.matched === true && autoMatchState.customer && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-1.5">
                  <div className="flex items-center text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Exact Ride Found & Linked!
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 grid grid-cols-2 gap-1 pt-1">
                    <div><span className="text-muted-foreground">Customer:</span> <strong className="text-slate-900 dark:text-slate-100">{autoMatchState.customer.name}</strong></div>
                    <div><span className="text-muted-foreground">Mobile:</span> <strong className="text-slate-900 dark:text-slate-100">{autoMatchState.customer.mobileNumber}</strong></div>
                    <div><span className="text-muted-foreground">Rental:</span> <strong>RNT-{autoMatchState.rental?.id}</strong></div>
                    <div><span className="text-muted-foreground">Branch:</span> <strong>{autoMatchState.rental?.branch?.name || 'Main'}</strong></div>
                  </div>
                  {autoMatchState.rental?.pickupDate && (
                    <div className="text-[11px] text-muted-foreground pt-1 border-t border-emerald-200 dark:border-emerald-800/50">
                      Ride period: {format(new Date(autoMatchState.rental.pickupDate), 'MMM d, h:mm a')} – {autoMatchState.rental.returnDate ? format(new Date(autoMatchState.rental.returnDate), 'MMM d, h:mm a') : 'Active'}
                    </div>
                  )}
                </div>
              )}

              {autoMatchState.matched === false && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg space-y-2">
                  <div className="flex items-center text-amber-800 dark:text-amber-300 font-medium text-xs">
                    <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600 shrink-0" />
                    No exact ride matches this vehicle at this violation time.
                  </div>

                  {autoMatchState.nearbyRentals && autoMatchState.nearbyRentals.length > 0 ? (
                    <div>
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Select from nearby rides on this vehicle:
                      </p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {autoMatchState.nearbyRentals.map((nr: any) => (
                          <div
                            key={nr.id}
                            onClick={() => {
                              setAutoMatchState({
                                loading: false,
                                matched: true,
                                rental: nr,
                                customer: nr.customer,
                              });
                            }}
                            className="p-1.5 bg-white dark:bg-slate-900 border rounded cursor-pointer hover:border-blue-500 text-xs flex justify-between items-center"
                          >
                            <div>
                              <span className="font-semibold">RNT-{nr.id}</span>: {nr.customer.name} ({nr.customer.mobileNumber})
                            </div>
                            <span className="text-[10px] text-blue-600 font-semibold">Select</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      Tip: Double-check the date & time printed on the traffic challan notice.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-600 dark:text-slate-400 font-medium">Fine Amount ({currencySymbol}) *</Label>
                <Input
                  type="number"
                  placeholder="e.g. 500"
                  value={challanFormData.amount}
                  onChange={(e) => setChallanFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  min="1"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-slate-600 dark:text-slate-400 font-medium">Violation Reason</Label>
                <Select
                  value={challanFormData.reason}
                  onValueChange={(val: string | null) => setChallanFormData(prev => ({ ...prev, reason: val || 'Traffic Violation' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Over-speeding">⚡ Over-speeding</SelectItem>
                    <SelectItem value="Signal Jump / Red Light">🚦 Signal Jump / Red Light</SelectItem>
                    <SelectItem value="No Helmet">🪖 Without Helmet</SelectItem>
                    <SelectItem value="Triple Riding">👥 Triple Riding</SelectItem>
                    <SelectItem value="Wrong Side Driving">⛔ Wrong Side Driving</SelectItem>
                    <SelectItem value="No Parking / Towing">🅿️ No Parking / Towing</SelectItem>
                    <SelectItem value="Dangerous Driving">⚠️ Dangerous / Rash Driving</SelectItem>
                    <SelectItem value="Other Violation">📋 Other Violation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-slate-600 dark:text-slate-400 font-medium">Challan / Notice No. (Optional)</Label>
                <Input
                  placeholder="e.g. GJ-VAD-2026-9812"
                  value={challanFormData.challanNumber}
                  onChange={(e) => setChallanFormData(prev => ({ ...prev, challanNumber: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-slate-600 dark:text-slate-400 font-medium">Remarks / Location (Optional)</Label>
                <Input
                  placeholder="e.g. Near Station Circle"
                  value={challanFormData.notes}
                  onChange={(e) => setChallanFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <Button type="button" variant="outline" onClick={() => setIsAddChallanOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!autoMatchState.customer || !challanFormData.amount}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
              >
                Save & Flag Customer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ALL TRAFFIC CHALLANS MANAGEMENT DIALOG */}
      <Dialog open={isChallanListOpen} onOpenChange={setIsChallanListOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center pr-6 flex-wrap gap-2">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Traffic Challan Records ({challans.length})
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setIsChallanListOpen(false);
                    handleOpenAddChallan();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add New
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant={challanFilter === 'PENDING' ? 'default' : 'outline'}
                  className="h-8 text-xs font-semibold"
                  onClick={() => setChallanFilter('PENDING')}
                >
                  Pending Fines ({challans.filter(c => c.status === 'PENDING').length})
                </Button>
                <Button
                  size="sm"
                  variant={challanFilter === 'PAID' ? 'default' : 'outline'}
                  className="h-8 text-xs font-semibold"
                  onClick={() => setChallanFilter('PAID')}
                >
                  Cleared / Paid ({challans.filter(c => c.status === 'PAID').length})
                </Button>
                <Button
                  size="sm"
                  variant={challanFilter === 'ALL' ? 'default' : 'outline'}
                  className="h-8 text-xs font-semibold"
                  onClick={() => setChallanFilter('ALL')}
                >
                  All ({challans.length})
                </Button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search customer, vehicle, notice..."
                  value={challanSearch}
                  onChange={(e) => setChallanSearch(e.target.value)}
                  className="h-8 text-xs pl-8"
                />
              </div>
            </div>

            <div className="border rounded-xl overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/50 text-xs">
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Challan No.</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Violation</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChallans.map(c => (
                    <TableRow key={c.id} className="text-xs hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <TableCell className="whitespace-nowrap font-medium">
                        {format(new Date(c.challanDate), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {c.challanNumber || '—'}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{c.customer.name}</div>
                        <div className="text-[11px] text-muted-foreground">{c.customer.mobileNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div>{c.vehicle.vehicleName}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{c.vehicle.vehicleNumber}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{c.reason}</span>
                      </TableCell>
                      <TableCell className="font-bold text-red-600 dark:text-red-400">
                        {currencySymbol}{c.amount}
                      </TableCell>
                      <TableCell>
                        {c.status === 'PENDING' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800 flex items-center w-fit gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" /> PENDING
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center w-fit gap-1">
                            <Check className="w-2.5 h-2.5" /> PAID ({c.paidPaymentMode || 'CASH'})
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {c.status === 'PENDING' ? (
                            <Button
                              size="sm"
                              onClick={() => openPayChallanDialog(c)}
                              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                            >
                              Collect & Clear
                            </Button>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">
                              Cleared {c.paidAt ? format(new Date(c.paidAt), 'dd/MM/yy') : ''}
                            </span>
                          )}

                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteChallan(c.id)}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredChallans.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No traffic challan records found for this filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* COLLECT / CLEAR CHALLAN FINE MODAL */}
      <Dialog open={isPayChallanOpen} onOpenChange={setIsPayChallanOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              Collect & Clear Traffic Fine
            </DialogTitle>
          </DialogHeader>

          {selectedChallanToPay && (
            <form onSubmit={handleConfirmPayChallan} className="space-y-4 mt-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {selectedChallanToPay.customer?.name} ({selectedChallanToPay.customer?.mobileNumber})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle:</span>
                  <span className="font-medium">{selectedChallanToPay.vehicle?.vehicleName} ({selectedChallanToPay.vehicle?.vehicleNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Violation:</span>
                  <span>{selectedChallanToPay.reason}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t text-red-600 dark:text-red-400">
                  <span>Fine Amount:</span>
                  <span>{currencySymbol}{selectedChallanToPay.amount}</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-slate-600 dark:text-slate-400 font-medium">Fine Payment Mode *</Label>
                <Select
                  value={payPaymentMode}
                  onValueChange={(v: string | null) => setPayPaymentMode((v as any) || 'CASH')}
                >
                  <SelectTrigger className="font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">💵 Cash</SelectItem>
                    <SelectItem value="ONLINE">📱 Online / UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-slate-600 dark:text-slate-400 font-medium">Payment Notes (Optional)</Label>
                <Input
                  placeholder="e.g. Received via GPay / Cash at counter"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <Button type="button" variant="outline" onClick={() => setIsPayChallanOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  Confirm Payment & Clear Flag
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
