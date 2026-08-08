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
import { User, Car, Clock, DollarSign, CheckCircle, FileText, AlertTriangle, CalendarIcon, Search } from 'lucide-react';
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
    loadAvailableVehicles();
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

  const loadAvailableVehicles = useCallback(async () => {
    try {
      const data = await api.get<any[]>('/vehicles?status=AVAILABLE');
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
      v.vehicleNumber.toLowerCase().includes(q)
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
      customerId: undefined, customerName: '', mobileNumber: '', email: '', address: '', idProofType: 'Aadhaar', idProofNumber: '',
      vehicleId: '', pickupDate: new Date(), selectedPackage: 'HOURLY', depositAmount: settings?.defaultDepositAmount || 0, notes: ''
    });
    setVehicleSearch('');
    setIsNewRentalOpen(true);
  };

  const handleStartRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId) {
      alert("Please select a vehicle before starting the rental.");
      return;
    }

    const rentalPayload = {
      pickupDate: formData.pickupDate,
      depositAmount: Number(formData.depositAmount),
      selectedPackage: formData.selectedPackage,
      notes: formData.notes,
      vehicleId: formData.vehicleId,
      customerData: {
        id: formData.customerId,
        name: formData.customerName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        address: formData.address,
        idProofType: formData.idProofType,
        idProofNumber: formData.idProofNumber,
      }
    };
    
    try {
      await api.post('/rentals', rentalPayload);
    } catch (err: any) {
      alert("Failed to start rental: " + err.message);
      return;
    }
    setIsNewRentalOpen(false);
    setFormData({
      customerId: undefined, customerName: '', mobileNumber: '', email: '', address: '', idProofType: 'Aadhaar', idProofNumber: '',
      vehicleId: '', pickupDate: new Date(), selectedPackage: 'HOURLY', depositAmount: settings?.defaultDepositAmount || 0, notes: ''
    });
    loadRentals();
    loadAvailableVehicles();
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
  };

  const toggleAccident = async (rental: any) => {
    try {
      await api.patch(`/rentals/${rental.id}/accident`, { isAccident: !rental.isAccident });
      loadRentals();
    } catch (err: any) {
      alert("Failed to update accident status: " + err.message);
    }
  };

  const calculateReturnAmount = () => {
    if (!selectedRental) return { hoursUsed: '0:00', chargeableHours: 0, totalAmount: 0, baseAmount: 0, extraCharge: 0 };
    
    const pickup = new Date(selectedRental.pickupDate);
    const returnDt = returnFormData.returnDate;
    const minutesUsed = differenceInMinutes(returnDt, pickup);
    
    let baseAmount = 0;
    let baseHours = 0;

    if (selectedRental.selectedPackage === '1HR') { baseHours = 1; baseAmount = selectedRental.vehicle.rate1hr || selectedRental.vehicle.hourlyRate; }
    else if (selectedRental.selectedPackage === '3HR') { baseHours = 3; baseAmount = selectedRental.vehicle.rate3hr || (selectedRental.vehicle.hourlyRate * 3); }
    else if (selectedRental.selectedPackage === '6HR') { baseHours = 6; baseAmount = selectedRental.vehicle.rate6hr || (selectedRental.vehicle.hourlyRate * 6); }
    else if (selectedRental.selectedPackage === '12HR') { baseHours = 12; baseAmount = selectedRental.vehicle.rate12hr || (selectedRental.vehicle.hourlyRate * 12); }
    else if (selectedRental.selectedPackage === '24HR') { baseHours = 24; baseAmount = selectedRental.vehicle.rate24hr || (selectedRental.vehicle.hourlyRate * 24); }

    let chargeableHours = baseHours;
    let totalAmount = baseAmount;
    let extraCharge = 0;

    if (selectedRental.selectedPackage === 'HOURLY') {
        if (minutesUsed <= 60) {
            totalAmount = selectedRental.vehicle.hourlyRate;
            baseAmount = totalAmount;
            chargeableHours = 1;
        } else {
            const extraHours = Math.floor(minutesUsed / 60);
            const extraMins = minutesUsed % 60;
            chargeableHours = extraHours;
            extraCharge = extraHours * selectedRental.vehicle.hourlyRate;
            
            if (extraMins >= 45) {
                extraCharge += selectedRental.vehicle.hourlyRate;
                chargeableHours += 1;
            } else if (extraMins > 20) {
                extraCharge += selectedRental.vehicle.hourlyRate * 0.5;
                chargeableHours += 0.5;
            }
            totalAmount = extraCharge;
            baseAmount = 0;
        }
    } else {
        const remainingMinutes = minutesUsed - (baseHours * 60);
        if (remainingMinutes > 0) {
            const extraHours = Math.floor(remainingMinutes / 60);
            const extraMins = remainingMinutes % 60;
            
            chargeableHours += extraHours;
            extraCharge = extraHours * selectedRental.vehicle.hourlyRate;
            
            if (extraMins >= 45) {
                extraCharge += selectedRental.vehicle.hourlyRate;
                chargeableHours += 1;
            } else if (extraMins > 20) {
                extraCharge += selectedRental.vehicle.hourlyRate * 0.5;
                chargeableHours += 0.5;
            }
            totalAmount += extraCharge;
        }
    }

    totalAmount += Number(returnFormData.settlementAmount) || 0;

    const hoursUsedStr = `${Math.floor(minutesUsed / 60)}:${(minutesUsed % 60).toString().padStart(2, '0')}`;

    return { 
      hoursUsed: hoursUsedStr, 
      chargeableHours: chargeableHours.toFixed(2), 
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
      loadAvailableVehicles();
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
      loadAvailableVehicles();
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
        (r.id || '').toString().toLowerCase().includes(q)
      );
    });

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRentals.map((r) => (
        <Card key={r.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col group ${r.isAccident ? 'bg-red-50/50 border-red-300 dark:bg-red-950/20 dark:border-red-800' : 'border-slate-200 dark:border-slate-800'}`}>
          <CardHeader className={`pb-3 border-b ${r.isAccident ? 'bg-red-100/50 border-red-200 dark:bg-red-900/30 dark:border-red-800' : 'bg-blue-50/50 border-slate-100 dark:bg-blue-900/20 dark:border-slate-800'}`}>
            <div className="flex justify-between items-start gap-2 flex-wrap">
              <div className="flex-1 min-w-0">
                <CardTitle className={`text-xl font-bold flex items-center truncate ${r.isAccident ? 'text-red-900 dark:text-red-100' : 'text-slate-900 dark:text-slate-100'}`}>
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  {r.customer.name}
                </CardTitle>
                <p className="text-xs font-mono text-muted-foreground mt-1 bg-white/50 dark:bg-slate-900/50 inline-block px-2 py-0.5 rounded-full">RNT-{r.id}</p>
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
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <Car className="w-4 h-4 mr-2 text-slate-400" />
                <span className="font-medium">{r.vehicle.vehicleName}</span>
                <span className="text-muted-foreground ml-1 font-mono">({r.vehicle.vehicleNumber})</span>
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
      ))}
      {filteredRentals.length === 0 && rentals.length > 0 && (
        <div className="col-span-full text-center py-16 border-2 border-dashed rounded-xl text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">No matches found</h3>
          <p>No rentals match your search criteria.</p>
        </div>
      )}
      {rentals.length === 0 && (
        <div className="col-span-full text-center py-16 border-2 border-dashed rounded-xl text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">No active rentals</h3>
          <p>You don't have any vehicles out on rent in your branch.</p>
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
              <div className="flex items-center mb-2">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-1.5 rounded-lg mr-2">
                  <Car className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200">Rental Specifics</h3>
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
                      value={selectedVehicle ? `${selectedVehicle.vehicleName} - ${selectedVehicle.vehicleNumber}` : vehicleSearch}
                      onChange={e => {
                        if (formData.vehicleId) setFormData({...formData, vehicleId: ''});
                        setVehicleSearch(e.target.value);
                        setIsVehicleDropdownOpen(true);
                      }}
                      onFocus={() => setIsVehicleDropdownOpen(true)}
                      placeholder="Search vehicle by name or number..."
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
                            <span>{v.vehicleName} - {v.vehicleNumber}</span>
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
                  <div className="h-10 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center shadow-sm">
                    {(() => {
                      const packagePrice = formData.selectedPackage === 'HOURLY' ? selectedVehicle?.hourlyRate : 
                                           formData.selectedPackage === '1HR' ? selectedVehicle?.rate1hr :
                                           formData.selectedPackage === '3HR' ? selectedVehicle?.rate3hr :
                                           formData.selectedPackage === '6HR' ? selectedVehicle?.rate6hr :
                                           formData.selectedPackage === '12HR' ? selectedVehicle?.rate12hr :
                                           formData.selectedPackage === '24HR' ? selectedVehicle?.rate24hr : 0;
                      return selectedVehicle ? `${currencySymbol}${packagePrice || 0}` : '—';
                    })()}
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 border p-3 rounded-xl bg-white dark:bg-slate-900/80 shadow-sm border-slate-200 dark:border-slate-800 mt-1">
                  <div className="space-y-1">
                    <Label className="text-slate-600 dark:text-slate-400 font-medium">Pickup Date</Label>
                    <div className="relative">
                      <DatePicker
                        selected={formData.pickupDate}
                        onChange={(date: Date | null) => {
                          if (date) {
                            const newD = new Date(formData.pickupDate);
                            newD.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                            setFormData({...formData, pickupDate: newD});
                          }
                        }}
                        dateFormat="MMMM d, yyyy"
                        className="flex h-10 w-full rounded-lg border border-input bg-white dark:bg-slate-900 shadow-sm px-3 py-2 text-sm transition-all outline-none focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400"
                      />
                      <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-600 dark:text-slate-400 font-medium">Pickup Time</Label>
                    <TimeSelector date={formData.pickupDate} onChange={d => setFormData({...formData, pickupDate: d})} />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">Deposit Amount</Label>
                  <Input type="number" value={formData.depositAmount} onChange={e => setFormData({...formData, depositAmount: Number(e.target.value)})} required />
                </div>

                <div className="space-y-1">
                  <Label className="text-slate-600 dark:text-slate-400 font-medium">Notes</Label>
                  <Input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Optional remarks" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-0">
              <Button type="button" variant="outline" className="px-6" onClick={() => setIsNewRentalOpen(false)}>Cancel</Button>
              <Button type="submit" size="lg" className="px-8 shadow-md">Start Rental</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* RETURN VEHICLE DIALOG */}
      <Dialog open={isReturnOpen} onOpenChange={setIsReturnOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Return Vehicle - RNT-{selectedRental?.id}</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <form onSubmit={handleCompleteReturn} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-md text-sm">
                <div>
                  <span className="text-muted-foreground">Customer:</span>
                  <div className="font-medium">{selectedRental.customer.name}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Vehicle:</span>
                  <div className="font-medium">{selectedRental.vehicle.vehicleName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Pickup Time:</span>
                  <div className="font-medium">{format(new Date(selectedRental.pickupDate), 'PPp')}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Hourly Rate:</span>
                  <div className="font-medium">{currencySymbol}{selectedRental.vehicle.hourlyRate}/hr</div>
                </div>
                {selectedRental.depositAmount > 0 && (
                  <div>
                    <span className="text-muted-foreground">Deposit Collected:</span>
                    <div className="font-medium text-amber-600 dark:text-amber-500">{currencySymbol}{selectedRental.depositAmount}</div>
                  </div>
                )}
              </div>

              <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <div className="space-y-2">
                  <Label>Return Date</Label>
                  <div className="relative">
                    <DatePicker
                      selected={returnFormData.returnDate}
                      onChange={(date: Date | null) => {
                        if (date) {
                          const newD = new Date(returnFormData.returnDate);
                          newD.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                          setReturnFormData({...returnFormData, returnDate: newD});
                        }
                      }}
                      dateFormat="MMMM d, yyyy"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-blue-800"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2 mt-0">
                  <Label>Return Time</Label>
                  <TimeSelector date={returnFormData.returnDate} onChange={d => setReturnFormData({...returnFormData, returnDate: d})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Settlement Amount (Optional)</Label>
                  <Input type="number" step="0.01" value={returnFormData.settlementAmount || ''} onChange={e => setReturnFormData({...returnFormData, settlementAmount: Number(e.target.value)})} placeholder="0.00" />
                  <p className="text-xs text-muted-foreground">Add to charge extra, or use negative number for discount.</p>
                </div>
                <div className="space-y-2">
                  <Label>Important Notes</Label>
                  <Input value={returnFormData.notes} onChange={e => setReturnFormData({...returnFormData, notes: e.target.value})} placeholder="Type important messages here..." />
                  <p className="text-xs text-muted-foreground">This note will be saved in the completed rental.</p>
                </div>
              </div>

              {returnDetails && (
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Duration:</span>
                    <span className="font-medium">{returnDetails.hoursUsed} (HH:MM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Package / Base Amount:</span>
                    <span className="font-medium">{currencySymbol}{returnDetails.baseAmount}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Overtime Charge ({returnDetails.chargeableHours} hrs total):</span>
                    <span>+{currencySymbol}{returnDetails.extraCharge}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Settlement Adjustments:</span>
                    <span>{Number(returnFormData.settlementAmount) < 0 ? '-' : '+'}{currencySymbol}{Math.abs(Number(returnFormData.settlementAmount) || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>Final Amount:</span>
                    <span>{currencySymbol}{returnDetails.totalAmount}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsReturnOpen(false)}>Cancel</Button>
                <Button type="submit">Complete Rental</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* EXCHANGE VEHICLE DIALOG */}
      <Dialog open={isExchangeOpen} onOpenChange={setIsExchangeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Exchange Vehicle</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <form onSubmit={handleExchange} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Vehicle</Label>
                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-md text-sm border font-medium">
                  {selectedRental.vehicle.vehicleName} ({selectedRental.vehicle.vehicleNumber})
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Select New Vehicle</Label>
                <Select value={exchangeFormData.newVehicleId} onValueChange={(v: string | null) => setExchangeFormData({...exchangeFormData, newVehicleId: v || ''})} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a replacement vehicle">
                      {exchangeFormData.newVehicleId ? (
                        (() => {
                          const selectedVeh = vehicles.find(v => v.id === exchangeFormData.newVehicleId);
                          return selectedVeh ? `${selectedVeh.vehicleName} (${selectedVeh.vehicleNumber})` : 'Choose a replacement vehicle';
                        })()
                      ) : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.vehicleName} ({v.vehicleNumber})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>What happened to the old vehicle?</Label>
                <Select value={exchangeFormData.oldVehicleStatus} onValueChange={(v: string | null) => setExchangeFormData({...exchangeFormData, oldVehicleStatus: v || 'INACTIVE'})} required>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">It is fine (Available)</SelectItem>
                    <SelectItem value="INACTIVE">It needs repair (Inactive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reason for Exchange</Label>
                <Input value={exchangeFormData.reason} onChange={e => setExchangeFormData({...exchangeFormData, reason: e.target.value})} placeholder="e.g., Engine failure, flat tire..." required />
                <p className="text-xs text-muted-foreground">This note will be permanently added to the rental record.</p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsExchangeOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm">Exchange Vehicle</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
