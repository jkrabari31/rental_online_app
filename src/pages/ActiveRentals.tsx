import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useAppStore } from '@/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, differenceInMinutes } from 'date-fns';
import { User, Car, Clock, DollarSign, CheckCircle, FileText, AlertTriangle, CalendarIcon, Search, Building2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function ActiveRentals() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const [isNewRentalOpen, setIsNewRentalOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [rentalSearch, setRentalSearch] = useState('');
  const [includeAllBranches, setIncludeAllBranches] = useState(false);
  const { currencySymbol } = useAppStore();

  const [formData, setFormData] = useState({
    customerId: undefined as string | undefined,
    customerName: '',
    mobileNumber: '',
    email: '',
    address: '',
    idProofType: 'Aadhaar',
    idProofNumber: '',
    vehicleId: '',
    pickupDate: new Date(),
    selectedPackage: 'HOURLY',
    depositAmount: 0,
    notes: ''
  });

  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [exchangeFormData, setExchangeFormData] = useState({
    newVehicleId: '',
    oldVehicleStatus: 'INACTIVE',
    reason: ''
  });

  const [returnFormData, setReturnFormData] = useState({
    returnDate: new Date(),
    settlementAmount: 0,
    notes: ''
  });

  useEffect(() => {
    loadRentals();
    loadAvailableVehicles(false);
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.get<any>('/settings');
      setSettings(data);
      setFormData(prev => ({ ...prev, depositAmount: data?.defaultDepositAmount || 0 }));
    } catch (e) {
      // Ignore settings fetch error if not admin
    }
  };

  const loadRentals = async () => {
    try {
      const data = await api.get<any[]>('/rentals?status=ACTIVE');
      setRentals(data || []);
    } catch (err: any) {
      console.error('Failed to load rentals:', err);
    }
  };

  const loadAvailableVehicles = useCallback(async (allBranches = false) => {
    try {
      const url = allBranches 
        ? '/vehicles?status=AVAILABLE&includeAllBranches=true' 
        : '/vehicles?status=AVAILABLE';
      const data = await api.get<any[]>(url);
      setVehicles(data || []);
    } catch (err: any) {
      console.error('Failed to load available vehicles:', err);
    }
  }, []);

  const vehicleMap = useMemo(() => {
    const map = new Map<string, any>();
    for (const v of vehicles) map.set(v.id, v);
    return map;
  }, [vehicles]);

  const selectedVehicle = useMemo(
    () => (formData.vehicleId ? vehicleMap.get(formData.vehicleId) : null),
    [formData.vehicleId, vehicleMap]
  );

  const filteredVehicles = useMemo(() => {
    if (!vehicleSearch) return vehicles;
    const q = vehicleSearch.toLowerCase();
    return vehicles.filter(v =>
      v.vehicleName.toLowerCase().includes(q) ||
      v.vehicleNumber.toLowerCase().includes(q) ||
      (v.branch?.name || '').toLowerCase().includes(q)
    );
  }, [vehicles, vehicleSearch]);

  const handleMobileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, mobileNumber: val }));
    
    if (val.length >= 10) {
      try {
        const found = await api.get<any>(`/customers/find?mobileNumber=${val}`);

        if (found) {
          setFormData(prev => ({
            ...prev,
            customerId: found.id,
            customerName: found.name,
            email: found.email || '',
            address: found.address || '',
            idProofType: found.idProofType,
            idProofNumber: found.idProofNumber
          }));
        } else {
          setFormData(prev => ({ 
            ...prev, 
            customerId: undefined,
            customerName: '',
            email: '',
            address: '',
            idProofType: 'Aadhaar',
            idProofNumber: ''
          }));
        }
      } catch {
        // Customer not found
      }
    } else {
      setFormData(prev => ({ 
        ...prev, 
        customerId: undefined,
        customerName: '',
        email: '',
        address: '',
        idProofType: 'Aadhaar',
        idProofNumber: ''
      }));
    }
  };

  const handleOpenNewRental = () => {
    setFormData({
      customerId: undefined,
      customerName: '',
      mobileNumber: '',
      email: '',
      address: '',
      idProofType: 'Aadhaar',
      idProofNumber: '',
      vehicleId: '',
      pickupDate: new Date(),
      selectedPackage: 'HOURLY',
      depositAmount: settings?.defaultDepositAmount || 0,
      notes: ''
    });
    setVehicleSearch('');
    setIsNewRentalOpen(true);
    loadAvailableVehicles(includeAllBranches);
  };

  const handleStartRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId) {
      alert("Please select a vehicle to continue.");
      return;
    }

    try {
      await api.post('/rentals', {
        customerData: {
          id: formData.customerId,
          name: formData.customerName,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          address: formData.address,
          idProofType: formData.idProofType,
          idProofNumber: formData.idProofNumber
        },
        vehicleId: formData.vehicleId,
        pickupDate: formData.pickupDate,
        selectedPackage: formData.selectedPackage,
        depositAmount: formData.depositAmount,
        notes: formData.notes
      });
      setIsNewRentalOpen(false);
      loadRentals();
      loadAvailableVehicles(includeAllBranches);
    } catch (err: any) {
      alert("Failed to start rental: " + err.message);
    }
  };

  const openReturnDialog = (rental: any) => {
    setSelectedRental(rental);
    setReturnFormData({
      returnDate: new Date(),
      settlementAmount: 0,
      notes: rental.notes || ''
    });
    setIsReturnOpen(true);
  };

  const openExchangeDialog = (rental: any) => {
    setSelectedRental(rental);
    setExchangeFormData({
      newVehicleId: '',
      oldVehicleStatus: 'INACTIVE',
      reason: ''
    });
    setIsExchangeOpen(true);
    loadAvailableVehicles(includeAllBranches);
  };

  const toggleAccident = async (rental: any) => {
    try {
      const newStatus = !rental.isAccident;
      await api.patch(`/rentals/${rental.id}/accident`, { isAccident: newStatus });
      loadRentals();
    } catch (err: any) {
      alert("Failed to update accident status: " + err.message);
    }
  };

  const calculateReturnAmount = () => {
    if (!selectedRental) return { chargeableHours: 0, totalAmount: 0, roundedHoursDisplay: 0, minutes: 0, rawHours: 0, baseAmount: 0, extraCharge: 0 };
    
    const start = new Date(selectedRental.pickupDate);
    const end = returnFormData.returnDate;

    if (end < start) {
      return { chargeableHours: 0, totalAmount: 0, roundedHoursDisplay: 0, minutes: 0, rawHours: 0, baseAmount: 0, extraCharge: 0 };
    }

    const diffMins = differenceInMinutes(end, start);
    const rawHours = diffMins / 60;
    const minutes = diffMins % 60;

    let chargeableHours = 0;
    const roundingRule = settings?.hourlyRoundingRule || 'EXACT';

    if (roundingRule === 'EXACT') {
      chargeableHours = rawHours;
    } else if (roundingRule === 'CEIL') {
      chargeableHours = Math.ceil(rawHours);
    } else if (roundingRule === 'ROUND_30') {
      const whole = Math.floor(rawHours);
      if (minutes === 0) chargeableHours = whole;
      else if (minutes <= 30) chargeableHours = whole + 0.5;
      else chargeableHours = whole + 1;
    } else if (roundingRule === 'GRACE_15') {
      const whole = Math.floor(rawHours);
      if (minutes <= 15) chargeableHours = whole;
      else chargeableHours = whole + 1;
    }

    const vehicle = selectedRental.vehicle;
    const hourlyRate = vehicle.hourlyRate || 0;
    const pkg = selectedRental.selectedPackage || 'HOURLY';

    let pkgHours = 0;
    let pkgPrice = 0;

    if (pkg === '1HR' && vehicle.rate1hr) { pkgHours = 1; pkgPrice = vehicle.rate1hr; }
    else if (pkg === '3HR' && vehicle.rate3hr) { pkgHours = 3; pkgPrice = vehicle.rate3hr; }
    else if (pkg === '6HR' && vehicle.rate6hr) { pkgHours = 6; pkgPrice = vehicle.rate6hr; }
    else if (pkg === '12HR' && vehicle.rate12hr) { pkgHours = 12; pkgPrice = vehicle.rate12hr; }
    else if (pkg === '24HR' && vehicle.rate24hr) { pkgHours = 24; pkgPrice = vehicle.rate24hr; }

    let baseAmount = 0;
    let extraCharge = 0;

    if (pkgHours > 0) {
      baseAmount = pkgPrice;
      const extraHours = Math.max(0, chargeableHours - pkgHours);
      extraCharge = extraHours * hourlyRate;
    } else {
      baseAmount = chargeableHours * hourlyRate;
      extraCharge = 0;
    }

    const totalAmount = Math.max(0, baseAmount + extraCharge);

    return {
      chargeableHours: chargeableHours.toFixed(2),
      roundedHoursDisplay: Math.ceil(chargeableHours),
      minutes,
      rawHours: rawHours.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      baseAmount: baseAmount.toFixed(2),
      extraCharge: extraCharge.toFixed(2)
    };
  };

  const handleCompleteReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental) return;

    const returnDetails = calculateReturnAmount();
    try {
      await api.post(`/rentals/${selectedRental.id}/return`, {
        vehicleId: selectedRental.vehicleId,
        returnData: {
          returnDate: returnFormData.returnDate,
          totalHours: Number(returnDetails.chargeableHours),
          totalAmount: Number(returnDetails.totalAmount),
          settlementAmount: Number(returnFormData.settlementAmount) || 0,
          notes: returnFormData.notes
        }
      });
      setIsReturnOpen(false);
      setSelectedRental(null);
      loadRentals();
      loadAvailableVehicles(includeAllBranches);
    } catch (err: any) {
      alert("Failed to complete return: " + err.message);
    }
  };

  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental || !exchangeFormData.newVehicleId || !exchangeFormData.reason) return;

    try {
      const now = format(new Date(), 'PPp');
      const oldVehicleName = `${selectedRental.vehicle.vehicleName} (${selectedRental.vehicle.vehicleNumber})`;
      const noteAppend = `[VEHICLE EXCHANGED on ${now}] Swapped from ${oldVehicleName}. Reason: ${exchangeFormData.reason}`;

      await api.post(`/rentals/${selectedRental.id}/swap`, {
        oldVehicleId: selectedRental.vehicleId,
        newVehicleId: exchangeFormData.newVehicleId,
        oldVehicleStatus: exchangeFormData.oldVehicleStatus,
        notesAppend: noteAppend
      });
      setIsExchangeOpen(false);
      setSelectedRental(null);
      loadRentals();
      loadAvailableVehicles(includeAllBranches);
    } catch (err: any) {
      alert("Failed to exchange vehicle: " + err.message);
    }
  };

  const returnDetails = isReturnOpen && selectedRental ? calculateReturnAmount() : null;

  const TimeSelector = ({ date, onChange }: { date: Date, onChange: (d: Date) => void }) => {
    const hours = Array.from({length: 12}, (_, i) => i === 0 ? 12 : i);
    const mins = Array.from({length: 60}, (_, i) => i);
    
    const h = date.getHours();
    const isPM = h >= 12;
    const currentHour12 = h % 12 || 12;
    const m = date.getMinutes();

    return (
      <div className="flex space-x-2">
        <Select value={currentHour12.toString()} onValueChange={(v: string | null) => {
          const newDate = new Date(date);
          let newH = parseInt(v || '12');
          if (isPM && newH !== 12) newH += 12;
          if (!isPM && newH === 12) newH = 0;
          newDate.setHours(newH);
          onChange(newDate);
        }}>
          <SelectTrigger className="w-[70px]"><SelectValue/></SelectTrigger>
          <SelectContent className="max-h-[200px]" alignItemWithTrigger={false}>
            {hours.map(h => <SelectItem key={h} value={h.toString()}>{h}</SelectItem>)}
          </SelectContent>
        </Select>

        <span className="flex items-center font-bold text-slate-400">:</span>

        <Select value={m.toString()} onValueChange={(v: string | null) => {
          const newDate = new Date(date);
          newDate.setMinutes(parseInt(v || '0'));
          onChange(newDate);
        }}>
          <SelectTrigger className="w-[70px]"><SelectValue/></SelectTrigger>
          <SelectContent className="max-h-[200px]" alignItemWithTrigger={false}>
            {mins.map(m => <SelectItem key={m} value={m.toString()}>{m.toString().padStart(2, '0')}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={isPM ? 'PM' : 'AM'} onValueChange={(v: string | null) => {
          const newDate = new Date(date);
          let newH = currentHour12;
          const isNowPM = v === 'PM';
          if (isNowPM && newH !== 12) newH += 12;
          if (!isNowPM && newH === 12) newH = 0;
          newDate.setHours(newH);
          onChange(newDate);
        }}>
          <SelectTrigger className="w-[70px]"><SelectValue/></SelectTrigger>
          <SelectContent className="max-h-[200px]" alignItemWithTrigger={false}>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const activeRentalsGrid = useMemo(() => {
    const filteredRentals = rentals.filter(r => {
      if (!rentalSearch) return true;
      const q = rentalSearch.toLowerCase();
      return (
        (r.customer?.name || '').toLowerCase().includes(q) ||
        (r.vehicle?.vehicleNumber || '').toLowerCase().includes(q) ||
        (r.vehicle?.vehicleName || '').toLowerCase().includes(q) ||
        (r.branch?.name || '').toLowerCase().includes(q) ||
        (r.vehicle?.branch?.name || '').toLowerCase().includes(q) ||
        (r.id || '').toString().toLowerCase().includes(q)
      );
    });

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRentals.map((r) => {
        const isCrossBranch = r.vehicle?.branch?.name && r.branch?.name && r.vehicle.branch.name !== r.branch.name;

        return (
          <Card key={r.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col group ${r.isAccident ? 'bg-red-50/50 border-red-300 dark:bg-red-950/20 dark:border-red-800' : 'border-slate-200 dark:border-slate-800'}`}>
            <CardHeader className={`pb-3 border-b ${r.isAccident ? 'bg-red-100/50 border-red-200 dark:bg-red-900/30 dark:border-red-800' : 'bg-blue-50/50 border-slate-100 dark:bg-blue-900/20 dark:border-slate-800'}`}>
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <div className="flex-1 min-w-0">
                  <CardTitle className={`text-xl font-bold flex items-center truncate ${r.isAccident ? 'text-red-900 dark:text-red-100' : 'text-slate-900 dark:text-slate-100'}`}>
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    {r.customer.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <p className="text-xs font-mono text-muted-foreground bg-white/50 dark:bg-slate-900/50 px-2 py-0.5 rounded-full">RNT-{r.id}</p>
                    {isCrossBranch && (
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-full flex items-center">
                        <Building2 className="w-3 h-3 mr-1" /> Home: {r.vehicle.branch.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center justify-end shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800">
                    {r.status}
                  </span>
                  {r.isAccident && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold shadow-sm bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" /> ACCIDENT
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-4 flex-1">
              <div className="space-y-4 text-sm">
                <div className="flex items-center text-slate-700 dark:text-slate-300 flex-wrap gap-1">
                  <Car className="w-4 h-4 mr-1 text-slate-400 shrink-0" />
                  <span className="font-medium">{r.vehicle.vehicleName}</span>
                  <span className="text-muted-foreground font-mono">({r.vehicle.vehicleNumber})</span>
                </div>
                
                <div className="flex items-center text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  <span>{format(new Date(r.pickupDate), 'PPp')}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{currencySymbol}{r.vehicle.hourlyRate}/hr</span>
                  </div>
                  {r.depositAmount > 0 && (
                    <div className="flex items-center text-xs">
                      <span className="text-muted-foreground mr-1">Deposit:</span>
                      <span className="font-medium text-amber-600 dark:text-amber-500">{currencySymbol}{r.depositAmount}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <div className={`p-4 pt-0 border-t mt-auto flex flex-col ${r.isAccident ? 'bg-red-50/30 border-red-200 dark:bg-red-900/10 dark:border-red-800' : 'bg-slate-50/50 border-slate-100 dark:bg-slate-900/30 dark:border-slate-800'}`}>
              <div className="mt-4 flex space-x-2">
                <Button onClick={() => openReturnDialog(r)} className={`flex-1 shadow-sm ${r.isAccident ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}>
                  <CheckCircle className="w-4 h-4 mr-1" /> Return
                </Button>
                <Button variant="outline" onClick={() => openExchangeDialog(r)} className="flex-1 shadow-sm border-slate-200 dark:border-slate-700">
                  Exchange
                </Button>
              </div>
              <button 
                onClick={() => toggleAccident(r)} 
                className={`mt-3 text-[11px] font-semibold tracking-wide uppercase transition-colors text-center w-full focus:outline-none ${r.isAccident ? 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300' : 'text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400'}`}
              >
                {r.isAccident ? 'Remove Accident Tag' : 'Mark as Accident'}
              </button>
            </div>
          </Card>
        );
      })}
      {rentals.length === 0 && (
        <div className="col-span-full text-center py-16 border-2 border-dashed rounded-xl text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">No active rentals</h3>
          <p>You don't have any active vehicles out on rent.</p>
          <Button onClick={handleOpenNewRental} className="mt-4" variant="outline">Create New Rental</Button>
        </div>
      )}
    </div>
    );
  }, [rentals, currencySymbol, rentalSearch]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Active Rentals</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by customer, vehicle, or ID..." 
              value={rentalSearch}
              onChange={(e) => setRentalSearch(e.target.value)}
              className="pl-9 h-11 w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 shadow-sm"
            />
          </div>
          <Button size="lg" className="text-base px-6 shadow-md whitespace-nowrap h-11" onClick={handleOpenNewRental}>New Rental</Button>
        </div>
      </div>

      {activeRentalsGrid}

      {/* NEW RENTAL DIALOG */}
      <Dialog open={isNewRentalOpen} onOpenChange={setIsNewRentalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Customer Rental</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStartRental} className="space-y-3 mt-1">
            
            {/* Customer Details Section */}
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/60 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-lg mr-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200">Customer Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">Customer Name</Label>
                  <Input value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} required placeholder="Enter full name" />
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">Mobile Number</Label>
                  <Input value={formData.mobileNumber} onChange={handleMobileChange} required placeholder="Enter mobile number" />
                  <p className="text-[10px] text-muted-foreground mt-0">Existing customer details will auto-fill.</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">Address</Label>
                  <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Enter full address" />
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">ID Proof Type</Label>
                  <Input value={formData.idProofType} onChange={e => setFormData({...formData, idProofType: e.target.value})} required placeholder="e.g. Aadhaar, License" />
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">ID Proof Number</Label>
                  <Input value={formData.idProofNumber} onChange={e => setFormData({...formData, idProofNumber: e.target.value})} required placeholder="Enter ID number" />
                </div>
              </div>
            </div>

            {/* Rental Details Section */}
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/60 shadow-sm">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center">
                  <div className="bg-indigo-100 dark:bg-indigo-900/50 p-1.5 rounded-lg mr-2">
                    <Car className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200">Rental Specifics</h3>
                </div>
                <label className="flex items-center space-x-2 text-xs font-medium text-blue-600 dark:text-blue-400 cursor-pointer bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                  <input
                    type="checkbox"
                    checked={includeAllBranches}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIncludeAllBranches(checked);
                      loadAvailableVehicles(checked);
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include vehicles from all branches</span>
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1 md:col-span-2 relative">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">Vehicle</Label>
                  <div 
                    className="relative" 
                    tabIndex={0} 
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsVehicleDropdownOpen(false);
                      }
                    }}
                  >
                    <Input 
                      value={selectedVehicle ? `${selectedVehicle.vehicleName} - ${selectedVehicle.vehicleNumber}${selectedVehicle.branch?.name ? ` (${selectedVehicle.branch.name})` : ''}` : vehicleSearch}
                      onChange={e => {
                        if (formData.vehicleId) setFormData({...formData, vehicleId: ''});
                        setVehicleSearch(e.target.value);
                        setIsVehicleDropdownOpen(true);
                      }}
                      onFocus={() => setIsVehicleDropdownOpen(true)}
                      placeholder="Search vehicle by name, number, or branch..."
                    />
                    {isVehicleDropdownOpen && (
                      <div 
                        className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg max-h-60 overflow-auto"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {filteredVehicles.map(v => (
                          <div 
                            key={v.id} 
                            className="px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setFormData({...formData, vehicleId: v.id});
                              setVehicleSearch('');
                              setIsVehicleDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{v.vehicleName} - {v.vehicleNumber}</span>
                              {v.branch?.name && (
                                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800">
                                  {v.branch.name}
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{currencySymbol}{v.hourlyRate}/hr</span>
                          </div>
                        ))}
                        {filteredVehicles.length === 0 && (
                          <div className="p-3 text-sm text-center text-muted-foreground">No available vehicles found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">Package</Label>
                  <Select value={formData.selectedPackage} onValueChange={(v: string | null) => setFormData({...formData, selectedPackage: v || 'HOURLY'})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOURLY">Hourly Base ({currencySymbol}{selectedVehicle?.hourlyRate || 0}/hr)</SelectItem>
                      {selectedVehicle?.rate1hr && <SelectItem value="1HR">1 Hour ({currencySymbol}{selectedVehicle.rate1hr})</SelectItem>}
                      {selectedVehicle?.rate3hr && <SelectItem value="3HR">3 Hours ({currencySymbol}{selectedVehicle.rate3hr})</SelectItem>}
                      {selectedVehicle?.rate6hr && <SelectItem value="6HR">6 Hours ({currencySymbol}{selectedVehicle.rate6hr})</SelectItem>}
                      {selectedVehicle?.rate12hr && <SelectItem value="12HR">12 Hours ({currencySymbol}{selectedVehicle.rate12hr})</SelectItem>}
                      {selectedVehicle?.rate24hr && <SelectItem value="24HR">24 Hours ({currencySymbol}{selectedVehicle.rate24hr})</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">Package Amount (Base)</Label>
                  <Input 
                    value={`${currencySymbol}${
                      formData.selectedPackage === '1HR' ? selectedVehicle?.rate1hr || 0 :
                      formData.selectedPackage === '3HR' ? selectedVehicle?.rate3hr || 0 :
                      formData.selectedPackage === '6HR' ? selectedVehicle?.rate6hr || 0 :
                      formData.selectedPackage === '12HR' ? selectedVehicle?.rate12hr || 0 :
                      formData.selectedPackage === '24HR' ? selectedVehicle?.rate24hr || 0 :
                      selectedVehicle?.hourlyRate || 0
                    }`}
                    disabled
                    className="bg-slate-100 dark:bg-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">Pickup Date & Time</Label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <div className="relative flex-1">
                      <DatePicker
                        selected={formData.pickupDate}
                        onChange={(date: Date | null) => date && setFormData({...formData, pickupDate: date})}
                        dateFormat="MMMM d, yyyy"
                        className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <TimeSelector 
                      date={formData.pickupDate} 
                      onChange={(newDate) => setFormData({...formData, pickupDate: newDate})} 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">Advance Deposit ({currencySymbol})</Label>
                  <Input 
                    type="number" 
                    value={formData.depositAmount} 
                    onChange={e => setFormData({...formData, depositAmount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">Notes / Accessories</Label>
                  <Input 
                    value={formData.notes} 
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    placeholder="e.g. Helmet included, Scratch on left mirror"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsNewRentalOpen(false)}>Cancel</Button>
              <Button type="submit" className="px-6 bg-blue-600 hover:bg-blue-700">Start Rental</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* COMPLETE RETURN DIALOG */}
      <Dialog open={isReturnOpen} onOpenChange={setIsReturnOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Complete Rental Return</DialogTitle>
          </DialogHeader>

          {selectedRental && returnDetails && (
            <form onSubmit={handleCompleteReturn} className="space-y-4 mt-2">
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedRental.customer.name} ({selectedRental.customer.mobileNumber})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vehicle:</span>
                  <span className="font-medium">{selectedRental.vehicle.vehicleName} ({selectedRental.vehicle.vehicleNumber})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pickup Time:</span>
                  <span>{format(new Date(selectedRental.pickupDate), 'PPp')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Return Date & Time</Label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative flex-1">
                    <DatePicker
                      selected={returnFormData.returnDate}
                      onChange={(date: Date | null) => date && setReturnFormData({...returnFormData, returnDate: date})}
                      dateFormat="MMMM d, yyyy"
                      className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  <TimeSelector 
                    date={returnFormData.returnDate} 
                    onChange={(newDate) => setReturnFormData({...returnFormData, returnDate: newDate})} 
                  />
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Total Rental Duration:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{returnDetails.chargeableHours} Hours ({returnDetails.rawHours} hrs actual)</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Base Rent Amount:</span>
                  <span className="font-semibold">{currencySymbol}{returnDetails.baseAmount}</span>
                </div>

                {Number(returnDetails.extraCharge) > 0 && (
                  <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
                    <span>Extra Hours Charge:</span>
                    <span className="font-semibold">+{currencySymbol}{returnDetails.extraCharge}</span>
                  </div>
                )}

                {selectedRental.depositAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                    <span>Advance Deposit Paid:</span>
                    <span className="font-semibold">-{currencySymbol}{selectedRental.depositAmount}</span>
                  </div>
                )}

                <div className="border-t border-blue-200 dark:border-blue-800 pt-2 flex justify-between items-center">
                  <span className="font-bold text-base text-slate-900 dark:text-slate-100">Calculated Net Total:</span>
                  <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{currencySymbol}{returnDetails.totalAmount}</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="font-medium">Final Settlement Amount Received ({currencySymbol})</Label>
                <Input 
                  type="number" 
                  value={returnFormData.settlementAmount} 
                  onChange={e => setReturnFormData({...returnFormData, settlementAmount: parseFloat(e.target.value) || 0})}
                  placeholder="Override if discount/penalty applies"
                  className="h-11 text-lg font-bold text-emerald-600"
                />
                <p className="text-xs text-muted-foreground">Default is {currencySymbol}{returnDetails.totalAmount}. Adjust if giving discount or extra charge.</p>
              </div>

              <div className="space-y-1">
                <Label className="font-medium">Notes / Remarks</Label>
                <Input 
                  value={returnFormData.notes} 
                  onChange={e => setReturnFormData({...returnFormData, notes: e.target.value})}
                  placeholder="e.g. Returned in good condition"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsReturnOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Complete Return</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* EXCHANGE VEHICLE DIALOG */}
      <Dialog open={isExchangeOpen} onOpenChange={setIsExchangeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exchange Rental Vehicle</DialogTitle>
          </DialogHeader>

          {selectedRental && (
            <form onSubmit={handleExchange} className="space-y-4 mt-1">
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800 text-sm">
                <p className="text-amber-800 dark:text-amber-300 font-semibold mb-1">Current Vehicle:</p>
                <p className="text-slate-900 dark:text-slate-100 font-medium">{selectedRental.vehicle.vehicleName} ({selectedRental.vehicle.vehicleNumber})</p>
              </div>

              <div className="space-y-1">
                <Label className="font-medium">Status for Old Vehicle</Label>
                <Select value={exchangeFormData.oldVehicleStatus} onValueChange={(v: string | null) => setExchangeFormData({...exchangeFormData, oldVehicleStatus: v || 'INACTIVE'})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INACTIVE">Inactive / Under Repair</SelectItem>
                    <SelectItem value="AVAILABLE">Available for Rent (Fine condition)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="font-medium">New Replacement Vehicle</Label>
                <Select value={exchangeFormData.newVehicleId} onValueChange={(v: string | null) => setExchangeFormData({...exchangeFormData, newVehicleId: v || ''})}>
                  <SelectTrigger><SelectValue placeholder="Select available bike..." /></SelectTrigger>
                  <SelectContent>
                    {vehicles.filter(v => v.id !== selectedRental.vehicleId).map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.vehicleName} - {v.vehicleNumber} ({v.branch?.name ? v.branch.name : ''})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="font-medium">Reason for Exchange</Label>
                <Input 
                  value={exchangeFormData.reason} 
                  onChange={e => setExchangeFormData({...exchangeFormData, reason: e.target.value})}
                  required
                  placeholder="e.g. Flat tyre, Engine breakdown"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsExchangeOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Confirm Exchange</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
