import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { useAppStore } from '@/store';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { FileSpreadsheet, FileDown, Search, Printer } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '@/contexts/AuthContext';

export function CompletedRentals() {
  const { isAdmin } = useAuth();
  const [rentals, setRentals] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState<any>(null);
  
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="w-48 sm:w-56 pl-9 h-9"
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
            {filteredRentals.map((r) => (
              <TableRow key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <TableCell className="font-mono font-medium text-blue-600 dark:text-blue-400">RNT-{r.id}</TableCell>
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
                  <Button variant="ghost" size="sm" onClick={() => printReceipt(r)}>
                    <Printer className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
    </div>
  );
}
