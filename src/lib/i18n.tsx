import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'gu';

export const translations = {
  en: {
    // Navigation & Layout
    'app.title': 'SB Bike Rental',
    'app.portal': 'Management Portal',
    'nav.dashboard': 'Dashboard',
    'nav.master_dashboard': 'Master Dashboard',
    'nav.analytics': 'Analytics',
    'nav.executive_analysis': 'Executive Analysis',
    'nav.branch_management': 'Branch Management',
    'nav.user_credentials': 'User Credentials',
    'nav.vehicles': 'Vehicles',
    'nav.active_rentals': 'Active Rentals',
    'nav.maintenance': 'Maintenance',
    'nav.completed_rentals': 'Completed Rentals',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.sign_out': 'Sign Out',
    'theme.dark': 'Dark Mode',
    'theme.light': 'Light Mode',
    'lang.switch': 'ગુજરાતી',
    'lang.current': 'English',

    // Common Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.add': 'Add',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.export_excel': 'Export Excel',
    'action.export_csv': 'Export CSV',
    'action.bulk_import': 'Bulk Import',
    'action.print': 'Print',
    'action.print_receipt': 'Print Receipt',
    'action.search': 'Search...',
    'action.filter': 'Filter',
    'action.refresh': 'Refresh',
    'action.close': 'Close',
    'action.submit': 'Submit',
    'action.download_template': 'Download Template',
    'action.upload': 'Upload',
    'action.return': 'Return',
    'action.exchange': 'Exchange',
    'action.mark_accident': 'Mark as Accident',
    'action.remove_accident': 'Remove Accident Tag',

    // Dashboard & KPIs
    'kpi.total_revenue': 'Total Revenue',
    'kpi.gross_revenue': 'Gross Revenue',
    'kpi.online_revenue': 'Online Revenue',
    'kpi.cash_revenue': 'Cash Revenue',
    'kpi.active_rentals': 'Active Rentals',
    'kpi.total_vehicles': 'Total Vehicles',
    'kpi.available_fleet': 'Available Fleet',
    'kpi.rented_fleet': 'Rented Fleet',
    'kpi.inactive_fleet': 'Maintenance / Inactive',
    'kpi.total_customers': 'Total Customers',
    'kpi.total_branches': 'Total Branches',
    'kpi.maintenance_expenses': 'Maintenance Expenses',
    'kpi.net_profit': 'Net Revenue (After Maint.)',
    'kpi.today_returns': "Today's Returns",
    'kpi.quick_stats': 'Quick Performance Stats',

    // Active Rentals
    'rentals.active_title': 'Active Rentals',
    'rentals.new_rental': 'New Rental',
    'rentals.search_placeholder': 'Search by customer, vehicle, or ID...',
    'rentals.customer_details': 'Customer Details',
    'rentals.customer_name': 'Customer Name',
    'rentals.mobile_number': 'Mobile Number',
    'rentals.address': 'Address',
    'rentals.id_proof_type': 'ID Proof Type',
    'rentals.id_proof_number': 'ID Proof Number',
    'rentals.rental_specifics': 'Rental Specifics',
    'rentals.select_vehicle': 'Select Vehicle',
    'rentals.vehicle_search': 'Search vehicle by name, number, or branch...',
    'rentals.include_all_branches': 'Include vehicles from all branches',
    'rentals.package': 'Rental Package',
    'rentals.hourly': 'Hourly Rate',
    'rentals.deposit': 'Security Deposit',
    'rentals.pickup_date': 'Pickup Date & Time',
    'rentals.notes': 'Special Notes / Remarks',
    'rentals.start_rental': 'Start Rental',
    'rentals.starting': 'Starting Rental...',
    'rentals.no_active': 'No active vehicles out on rent.',

    // Return Dialog & Calculations
    'return.title': 'Return Vehicle & Settlement',
    'return.vehicle_info': 'Vehicle & Customer',
    'return.pickup_time': 'Pickup Time',
    'return.return_time': 'Return Time',
    'return.duration': 'Total Duration',
    'return.calculated_rent': 'Calculated Rent',
    'return.settlement_amount': 'Settlement / Final Amount',
    'return.payment_mode': 'Payment Mode',
    'return.cash': 'Cash',
    'return.online': 'Online / UPI',
    'return.confirm_return': 'Complete Return & Generate Bill',
    'return.completing': 'Completing Return...',

    // Vehicles Management
    'vehicles.title': 'Vehicles Fleet',
    'vehicles.subtitle': 'Manage fleet vehicles and hourly rental packages',
    'vehicles.add_vehicle': 'Add Vehicle',
    'vehicles.edit_vehicle': 'Edit Vehicle',
    'vehicles.number': 'Vehicle Number',
    'vehicles.name': 'Vehicle Name / Model',
    'vehicles.type': 'Vehicle Type',
    'vehicles.hourly_rate': 'Base Hourly Rate',
    'vehicles.security_deposit': 'Default Deposit',
    'vehicles.status': 'Status',
    'vehicles.status_available': 'AVAILABLE',
    'vehicles.status_rented': 'RENTED',
    'vehicles.status_inactive': 'INACTIVE',
    'vehicles.description': 'Description / Notes',
    'vehicles.no_vehicles': 'No vehicles found in fleet.',

    // Completed Rentals
    'completed.title': 'Completed Transactions',
    'completed.records_found': 'records found',
    'completed.rental_id': 'Rental ID',
    'completed.customer': 'Customer',
    'completed.vehicle': 'Vehicle',
    'completed.pickup': 'Pickup',
    'completed.return': 'Return',
    'completed.hours': 'Hours',
    'completed.amount': 'Amount',
    'completed.payment': 'Payment',
    'completed.no_records': 'No completed rentals found for the selected date range.',

    // Analysis / BI
    'analysis.title': 'Executive Analysis & BI',
    'analysis.subtitle': 'Multi-branch business metrics, revenue streams, and fleet analytics',
    'analysis.all_time': 'All Time',
    'analysis.today': 'Today',
    'analysis.this_week': 'This Week',
    'analysis.this_month': 'This Month',
    'analysis.all_branches': 'All Branches',
    'analysis.branch_revenue': 'Branch Revenue Comparison',
    'analysis.payment_split': 'Payment Flow Split',
    'analysis.fleet_distribution': 'Fleet Status Distribution',
    'analysis.timeline': 'Revenue & Maintenance Timeline',
    'analysis.top_vehicles': 'Top Performing Vehicles',

    // Maintenance
    'maint.title': 'Maintenance & Expenses',
    'maint.subtitle': 'Track repairs, servicing, and fleet maintenance costs',
    'maint.add_expense': 'Log Maintenance Expense',
    'maint.amount': 'Expense Amount',
    'maint.date': 'Expense Date',
    'maint.remarks': 'Description / Remarks',

    // Settings
    'settings.title': 'Branch & Business Settings',
    'settings.company_name': 'Business / Store Name',
    'settings.contact': 'Contact Number',
    'settings.address': 'Business Address',
    'settings.receipt_footer': 'Receipt Footer Message',
    'settings.backup_restore': 'Database Backup & Restore',
    'settings.download_backup': 'Download Full Backup (.json)',
    'settings.restore_backup': 'Restore Database from File',
    'settings.fleet_management': 'Universal Fleet Import / Export',
    'settings.danger_zone': 'Danger Zone (Master Reset)',
  },
  gu: {
    // Navigation & Layout
    'app.title': 'એસબી બાઇક રેન્ટલ',
    'app.portal': 'મેનેજમેન્ટ પોર્ટલ',
    'nav.dashboard': 'ડેશબોર્ડ',
    'nav.master_dashboard': 'મુખ્ય ડેશબોર્ડ',
    'nav.analytics': 'એનાલિસિસ',
    'nav.executive_analysis': 'એક્ઝિક્યુટિવ એનાલિસિસ',
    'nav.branch_management': 'બ્રાન્ચ મેનેજમેન્ટ',
    'nav.user_credentials': 'યુઝર એકાઉન્ટ્સ',
    'nav.vehicles': 'વાહનો (ફ્લીટ)',
    'nav.active_rentals': 'સક્રિય ભાડાં',
    'nav.maintenance': 'મેઇન્ટેનન્સ',
    'nav.completed_rentals': 'પૂર્ણ થયેલ ભાડાં',
    'nav.reports': 'રિપોર્ટ્સ',
    'nav.settings': 'સેટિંગ્સ',
    'nav.sign_out': 'લોગ આઉટ',
    'theme.dark': 'ડાર્ક મોડ',
    'theme.light': 'લાઈટ મોડ',
    'lang.switch': 'English',
    'lang.current': 'ગુજરાતી',

    // Common Actions
    'action.save': 'સાચવો (Save)',
    'action.cancel': 'રદ કરો',
    'action.add': 'ઉમેરો',
    'action.edit': 'ફેરફાર કરો',
    'action.delete': 'કાઢી નાખો',
    'action.export_excel': 'એક્સેલ ડાઉનલોડ',
    'action.export_csv': 'CSV ડાઉનલોડ',
    'action.bulk_import': 'બલ્ક ઇમ્પોર્ટ',
    'action.print': 'પ્રિન્ટ',
    'action.print_receipt': 'બિલ / રસીદ પ્રિન્ટ',
    'action.search': 'શોધો...',
    'action.filter': 'ફિલ્ટર',
    'action.refresh': 'રીફ્રેશ',
    'action.close': 'બંધ કરો',
    'action.submit': 'સબમિટ કરો',
    'action.download_template': 'સેમ્પલ ફાઇલ ડાઉનલોડ',
    'action.upload': 'અપલોડ કરો',
    'action.return': 'પરત કરો (Return)',
    'action.exchange': 'વાહન બદલો',
    'action.mark_accident': 'અકસ્માત માર્ક કરો',
    'action.remove_accident': 'અકસ્માત ટેગ હટાવો',

    // Dashboard & KPIs
    'kpi.total_revenue': 'કુલ આવક',
    'kpi.gross_revenue': 'કુલ ગ્રોસ આવક',
    'kpi.online_revenue': 'ઓનલાઇન આવક',
    'kpi.cash_revenue': 'રોકડ (કેશ) આવક',
    'kpi.active_rentals': 'ચાલુ (સક્રિય) ભાડાં',
    'kpi.total_vehicles': 'કુલ વાહનો',
    'kpi.available_fleet': 'હાજરમાં ઉપલબ્ધ વાહનો',
    'kpi.rented_fleet': 'ભાડે ગયેલા વાહનો',
    'kpi.inactive_fleet': 'મેઇન્ટેનન્સ / બંધ વાહનો',
    'kpi.total_customers': 'કુલ ગ્રાહકો',
    'kpi.total_branches': 'કુલ બ્રાન્ચ',
    'kpi.maintenance_expenses': 'મેઇન્ટેનન્સ ખર્ચ',
    'kpi.net_profit': 'ચોખ્ખી આવક (ખર્ચ બાદ)',
    'kpi.today_returns': 'આજના રિટર્ન',
    'kpi.quick_stats': 'ઝડપી આંકડાકીય વિગત',

    // Active Rentals
    'rentals.active_title': 'સક્રિય વાહન ભાડાં',
    'rentals.new_rental': 'નવું ભાડું શરૂ કરો',
    'rentals.search_placeholder': 'ગ્રાહકનું નામ, વાહન નંબર અથવા ID થી શોધો...',
    'rentals.customer_details': 'ગ્રાહકની વિગત',
    'rentals.customer_name': 'ગ્રાહકનું પૂરું નામ',
    'rentals.mobile_number': 'મોબાઇલ નંબર',
    'rentals.address': 'સરનામું',
    'rentals.id_proof_type': 'ઓળખ કાર્ડ પ્રકાર (આધાર / લાયસન્સ)',
    'rentals.id_proof_number': 'ઓળખ કાર્ડ નંબર',
    'rentals.rental_specifics': 'ભાડાની વિગત',
    'rentals.select_vehicle': 'વાહન પસંદ કરો',
    'rentals.vehicle_search': 'વાહનનું નામ અથવા નંબર શોધો...',
    'rentals.include_all_branches': 'બધી બ્રાન્ચના વાહનો બતાવો',
    'rentals.package': 'ભાડા પેકેજ',
    'rentals.hourly': 'કલાક દીઠ દર',
    'rentals.deposit': 'સિક્યોરિટી ડિપોઝિટ',
    'rentals.pickup_date': 'ઉપાડવાનો સમય અને તારીખ',
    'rentals.notes': 'ખાસ નોંધ / રિમાર્ક્સ',
    'rentals.start_rental': 'ભાડું શરૂ કરો',
    'rentals.starting': 'ભાડું શરૂ થઈ રહ્યું છે...',
    'rentals.no_active': 'હાલમાં કોઈ વાહન ભાડે ગયેલું નથી.',

    // Return Dialog & Calculations
    'return.title': 'વાહન પરત અને હિસાબ સેટલમેન્ટ',
    'return.vehicle_info': 'વાહન અને ગ્રાહકની વિગત',
    'return.pickup_time': 'ઉપાડવાનો સમય',
    'return.return_time': 'પરત કરવાનો સમય',
    'return.duration': 'કુલ સમય (કલાક : મિનિટ)',
    'return.calculated_rent': 'ગણતરી કરેલ ભાડું',
    'return.settlement_amount': 'આખરી સેટલમેન્ટ રકમ',
    'return.payment_mode': 'ચૂકવણી પદ્ધતિ',
    'return.cash': '💵 રોકડ (Cash)',
    'return.online': '📱 ઓનલાઇન / UPI',
    'return.confirm_return': 'વાહન પરત લો અને બિલ પૂર્ણ કરો',
    'return.completing': 'બિલિંગ પ્રોસેસ ચાલુ છે...',

    // Vehicles Management
    'vehicles.title': 'વાહનોની યાદી (ફ્લીટ)',
    'vehicles.subtitle': 'તમામ વાહનો અને કલાકના દરો મેનેજ કરો',
    'vehicles.add_vehicle': 'નવું વાહન ઉમેરો',
    'vehicles.edit_vehicle': 'વાહનની વિગત સુધારો',
    'vehicles.number': 'વાહન નંબર (GJ...)',
    'vehicles.name': 'વાહનનું નામ / મોડેલ',
    'vehicles.type': 'વાહન પ્રકાર',
    'vehicles.hourly_rate': 'કલાકનો દર',
    'vehicles.security_deposit': 'ડિફોલ્ટ ડિપોઝિટ',
    'vehicles.status': 'સ્થિતિ',
    'vehicles.status_available': 'ઉપલબ્ધ (AVAILABLE)',
    'vehicles.status_rented': 'ભાડે ગયેલ (RENTED)',
    'vehicles.status_inactive': 'બંધ / રિપેરિંગ (INACTIVE)',
    'vehicles.description': 'વિશેષ નોંધ',
    'vehicles.no_vehicles': 'કોઈ વાહનો મળ્યા નથી.',

    // Completed Rentals
    'completed.title': 'પૂર્ણ થયેલ ટ્રાન્ઝેક્શન્સ (હિસાબ)',
    'completed.records_found': 'રેકોર્ડ મળ્યા',
    'completed.rental_id': 'ભાડા નંબર (ID)',
    'completed.customer': 'ગ્રાહક',
    'completed.vehicle': 'વાહન',
    'completed.pickup': 'ઉપાડ સમય',
    'completed.return': 'પરત સમય',
    'completed.hours': 'કલાકો',
    'completed.amount': 'કુલ રકમ',
    'completed.payment': 'પેમેન્ટ',
    'completed.no_records': 'પસંદ કરેલ તારીખમાં કોઈ હિસાબ રેકોર્ડ નથી.',

    // Analysis / BI
    'analysis.title': 'બિઝનેસ એનાલિસિસ અને ચાર્ટ્સ',
    'analysis.subtitle': 'બ્રાન્ચ વાઇઝ આવક, પેમેન્ટ ફ્લો અને ફ્લીટ આંકડા',
    'analysis.all_time': 'શરૂઆતથી અત્યાર સુધી (All Time)',
    'analysis.today': 'આજે (Today)',
    'analysis.this_week': 'આ અઠવાડિયે',
    'analysis.this_month': 'આ મહિને',
    'analysis.all_branches': 'તમામ બ્રાન્ચ',
    'analysis.branch_revenue': 'બ્રાન્ચ વાઇઝ આવક સરખામણી',
    'analysis.payment_split': 'ઓનલાઇન વિરુદ્ધ રોકડ (Cash)',
    'analysis.fleet_distribution': 'વાહનોની સ્થિતિ',
    'analysis.timeline': 'દૈનિક આવક અને મેઇન્ટેનન્સ ટાઈમલાઈન',
    'analysis.top_vehicles': 'સૌથી વધુ આવક આપતા વાહનો',

    // Maintenance
    'maint.title': 'વાહન મેઇન્ટેનન્સ અને ખર્ચ',
    'maint.subtitle': 'સર્વિસિંગ, રિપેરિંગ અને પાર્ટ્સના ખર્ચની નોંધ',
    'maint.add_expense': 'નવો ખર્ચ નોંધો',
    'maint.amount': 'ખર્ચની રકમ',
    'maint.date': 'તારીખ',
    'maint.remarks': 'ખર્ચની વિગત / રિમાર્ક્સ',

    // Settings
    'settings.title': 'બિઝનેસ અને બ્રાન્ચ સેટિંગ્સ',
    'settings.company_name': 'દુકાન / કંપનીનું નામ',
    'settings.contact': 'સંપર્ક નંબર',
    'settings.address': 'સરનામું',
    'settings.receipt_footer': 'બિલના નીચેનો મેસેજ',
    'settings.backup_restore': 'ડેટાબેઝ બેકઅપ અને રીસ્ટોર',
    'settings.download_backup': 'સંપૂર્ણ બેકઅપ ડાઉનલોડ (.json)',
    'settings.restore_backup': 'ફાઇલમાંથી ડેટા રીસ્ટોર કરો',
    'settings.fleet_management': 'વાહનોનું એક્સેલ ઇમ્પોર્ટ / એક્સપોર્ટ',
    'settings.danger_zone': 'ડેન્જર ઝોન (માસ્ટર ડેટા રીસેટ)',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['en'] | string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => { },
  toggleLanguage: () => { },
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved === 'gu' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'gu' : 'en');
  };

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language] as Record<string, string>;
    if (dict && dict[key]) {
      return dict[key];
    }
    const enDict = translations.en as Record<string, string>;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
