import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Phone,
  MapPin,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Fuel,
  Gauge,
  Zap,
  Award,
  Star,
  Building2,
  Clock,
  FileText,
  Headphones,
  ChevronDown,
  X,
  Menu,
  ExternalLink,
  Shield,
  Layers,
  HeartHandshake,
  Car,
  Bike
} from 'lucide-react';

// Vehicle Categories & Types
type FleetType = 'all' | 'two-wheeler' | 'four-wheeler';
type Category = 'all' | 'scooter' | 'commuter' | 'sports' | 'cruiser' | 'suv' | 'sedan' | 'hatchback';

interface FourWheelerPackage {
  h4?: number;
  h8?: number;
  h12: number;
  h24: number;
}

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  vehicleType?: 'two-wheeler' | 'four-wheeler';
  category: 'scooter' | 'commuter' | 'sports' | 'cruiser' | 'suv' | 'sedan' | 'hatchback';
  categoryLabel: string;
  image: string;
  engine: string;
  transmission?: string;
  mileage: string;
  tag: string;
  ratePerHr?: number;
  ratePerDay?: number;
  packages?: FourWheelerPackage;
  features: string[];
}

const TWO_WHEELERS: Vehicle[] = [
  {
    id: 'activa',
    name: 'Honda Activa 6G',
    brand: 'Honda',
    category: 'scooter',
    categoryLabel: 'Scooter',
    image: '/images/vehicles/activa.jpg',
    engine: '109.5 cc',
    mileage: '48 km/l',
    tag: 'Campus & City Favourite',
    ratePerHr: 100,
    ratePerDay: 450,
    features: ['Silent ACG Starter', 'Full Metal Body', 'Telescopic Suspension'],
  },
  {
    id: 'access',
    name: 'Suzuki Access 125',
    brand: 'Suzuki',
    category: 'scooter',
    categoryLabel: 'Scooter',
    image: '/images/vehicles/access.jpg',
    engine: '124 cc',
    mileage: '50 km/l',
    tag: 'Premium Luxury Comfort',
    ratePerHr: 100,
    ratePerDay: 500,
    features: ['Retro Leather Seat', 'LED Headlamp', 'Superior Legroom'],
  },
  {
    id: 'avnies',
    name: 'Suzuki Avenis 125',
    brand: 'Suzuki',
    category: 'scooter',
    categoryLabel: 'Scooter',
    image: '/images/vehicles/avnies.jpg',
    engine: '124.3 cc',
    mileage: '48 km/l',
    tag: 'Sporty Aerodynamic Ride',
    ratePerHr: 100,
    ratePerDay: 520,
    features: ['Aggressive Styling', 'Digital Console', 'Lightweight Agility'],
  },
  {
    id: 'destini',
    name: 'Hero Destini 125',
    brand: 'Hero',
    category: 'scooter',
    categoryLabel: 'Scooter',
    image: '/images/vehicles/destini.jpg',
    engine: '124.6 cc',
    mileage: '46 km/l',
    tag: 'Pillion Backrest Comfort',
    ratePerHr: 100,
    ratePerDay: 480,
    features: ['Rear Backrest', 'i3S Start-Stop', 'Wide Cushioned Seat'],
  },
  {
    id: 'splendor',
    name: 'Hero Splendor Plus',
    brand: 'Hero',
    category: 'commuter',
    categoryLabel: 'Commuter',
    image: '/images/vehicles/splendor.jpg',
    engine: '97.2 cc',
    mileage: '65+ km/l',
    tag: 'Supreme Fuel Efficiency',
    ratePerHr: 100,
    ratePerDay: 400,
    features: ['Highest Mileage in Class', 'Unbeatable Reliability', 'Smooth Commute'],
  },
  {
    id: 'shine',
    name: 'Honda Shine 125',
    brand: 'Honda',
    category: 'commuter',
    categoryLabel: 'Commuter',
    image: '/images/vehicles/shine.jpg',
    engine: '124 cc',
    mileage: '55 km/l',
    tag: 'Smooth 5-Speed Highway Ride',
    ratePerHr: 150,
    ratePerDay: 480,
    features: ['Zero Vibration Engine', '5-Speed Gearbox', 'Tubeless Tyres'],
  },
  {
    id: 'hfdelux',
    name: 'Hero HF Deluxe',
    brand: 'Hero',
    category: 'commuter',
    categoryLabel: 'Commuter',
    image: '/images/vehicles/hfdelux.jpg',
    engine: '97.2 cc',
    mileage: '68 km/l',
    tag: 'Pocket-Friendly Daily Ride',
    ratePerHr: 100,
    ratePerDay: 350,
    features: ['Lightweight Handling', 'Low Running Cost', 'High Economy'],
  },
  {
    id: 'pulsar',
    name: 'Bajaj Pulsar 150',
    brand: 'Bajaj',
    category: 'sports',
    categoryLabel: 'Street Sports',
    image: '/images/vehicles/pulsar.jpg',
    engine: '149.5 cc',
    mileage: '45 km/l',
    tag: 'Iconic Street Stance',
    ratePerHr: 150,
    ratePerDay: 600,
    features: ['Twin Disc Brakes', 'Signature Pulsar Roar', 'Clip-on Handlebars'],
  },
  {
    id: 'mt',
    name: 'Yamaha MT-15',
    brand: 'Yamaha',
    category: 'sports',
    categoryLabel: 'Naked Streetfighter',
    image: '/images/vehicles/mt.jpg',
    engine: '155 cc VVA',
    mileage: '45 km/l',
    tag: 'Dark Warrior Beast',
    ratePerHr: 200,
    ratePerDay: 850,
    features: ['Variable Valve Actuation', 'USD Front Forks', 'Assist & Slipper Clutch'],
  },
  {
    id: 'gixxer',
    name: 'Suzuki Gixxer 150',
    brand: 'Suzuki',
    category: 'sports',
    categoryLabel: 'Street Sports',
    image: '/images/vehicles/gixxer.jpg',
    engine: '155 cc SEP',
    mileage: '45 km/l',
    tag: 'Japanese Precision Handling',
    ratePerHr: 150,
    ratePerDay: 650,
    features: ['Chiseled Muscle Tank', 'Twin Exhaust Muffler', 'Superb Cornering'],
  },
  {
    id: 'xtreme',
    name: 'Hero Xtreme 160R',
    brand: 'Hero',
    category: 'sports',
    categoryLabel: 'Street Sports',
    image: '/images/vehicles/xtreme.jpg',
    engine: '163 cc',
    mileage: '46 km/l',
    tag: 'Swift 0-60 Sprint Star',
    ratePerHr: 150,
    ratePerDay: 620,
    features: ['Ultra-Lightweight Frame', 'Full LED Package', 'Single Channel ABS'],
  },
  {
    id: 'bullet',
    name: 'Royal Enfield Bullet 350',
    brand: 'Royal Enfield',
    category: 'cruiser',
    categoryLabel: 'Classic Cruiser',
    image: '/images/vehicles/bullet.jpg',
    engine: '349 cc',
    mileage: '35 km/l',
    tag: 'Timeless Royal Legend',
    ratePerHr: 200,
    ratePerDay: 950,
    features: ['Heavy Flywheel Thump', 'Handcrafted Pinstripes', 'Majestic Highway Ride'],
  },
  {
    id: 'hunter',
    name: 'Royal Enfield Hunter 350',
    brand: 'Royal Enfield',
    category: 'cruiser',
    categoryLabel: 'Modern Roadster',
    image: '/images/vehicles/hunter.jpg',
    engine: '349 cc',
    mileage: '36 km/l',
    tag: 'Nimble Retro Cruiser',
    ratePerHr: 200,
    ratePerDay: 950,
    features: ['Compact Easy Handling', 'Dual Channel ABS', 'Deep Exhaust Tone'],
  },
  {
    id: 'roadster',
    name: 'Yezdi Roadster',
    brand: 'Yezdi',
    category: 'cruiser',
    categoryLabel: 'Modern Cruiser',
    image: '/images/vehicles/roadster.jpeg',
    engine: '334 cc Liquid-Cooled',
    mileage: '30 km/l',
    tag: 'Muscular Touring Power',
    ratePerHr: 250,
    ratePerDay: 1000,
    features: ['29.7 PS Liquid Engine', 'Twin Exhaust Pipes', 'Low Slung Comfort'],
  },
  {
    id: 'adventures',
    name: 'Yezdi Adventure',
    brand: 'Yezdi',
    category: 'cruiser',
    categoryLabel: 'Adventure Tourer',
    image: '/images/vehicles/adventures.jpg',
    engine: '411 cc',
    mileage: '30 km/l',
    tag: 'All-Terrain Explorer',
    ratePerHr: 250,
    ratePerDay: 1200,
    features: ['21" Front Spoke Wheel', 'Long Travel Suspension', 'Rugged Luggage Mounts'],
  },
];

const FOUR_WHEELERS: Vehicle[] = [
  {
    id: 'thar-black',
    name: 'Thar Black',
    brand: 'Mahindra',
    vehicleType: 'four-wheeler',
    category: 'suv',
    categoryLabel: '4x4 Lifestyle SUV',
    image: '/images/cars/thar_black.jpg',
    engine: '2.0L Turbo / 2.2L mHawk',
    transmission: 'Manual 4x4',
    mileage: '13-15 km/l',
    tag: 'Iconic Off-Road Stance',
    packages: { h4: 2000, h8: 3500, h12: 4500, h24: 6000 },
    features: ['Hard Top 4x4 Off-Roader', 'Commanding Road Presence', 'All-Terrain Capability'],
  },
  {
    id: 'thar-roxx',
    name: 'Thar Roxx',
    brand: 'Mahindra',
    vehicleType: 'four-wheeler',
    category: 'suv',
    categoryLabel: '5-Door 4x4 SUV',
    image: '/images/cars/thar_roxx.jpg',
    engine: '2.2L mHawk / 2.0L Turbo',
    transmission: 'Automatic / Manual',
    mileage: '14-16 km/l',
    tag: 'Spacious 5-Door 4x4 Beast',
    packages: { h4: 2500, h8: 4000, h12: 6000, h24: 9000 },
    features: ['Extended 5-Door Wheelbase', 'Panoramic Skyroof & Touchscreen', 'Premium Dual-Tone Leatherette'],
  },
  {
    id: 'scorpio-black',
    name: 'Scorpio Black Diesel',
    brand: 'Mahindra',
    vehicleType: 'four-wheeler',
    category: 'suv',
    categoryLabel: '7-Seater Power SUV',
    image: '/images/cars/scorpio_black.jpg',
    engine: '2.2L mHawk Diesel',
    transmission: 'Manual',
    mileage: '15 km/l',
    tag: 'Dominant Highway Stance',
    packages: { h4: 2000, h8: 4000, h12: 5000, h24: 7000 },
    features: ['High-Torque mHawk Diesel', 'Spacious 7-Seater Cabin', 'Commanding Elevated Seating'],
  },
  {
    id: 'swift-white',
    name: 'Swift White Petrol',
    brand: 'Maruti Suzuki',
    vehicleType: 'four-wheeler',
    category: 'hatchback',
    categoryLabel: 'Premium Hatchback',
    image: '/images/cars/swift_white.jpg',
    engine: '1.2L DualJet Petrol',
    transmission: 'Manual',
    mileage: '24.8 km/l',
    tag: 'Peppy & Ultra Fuel-Efficient',
    packages: { h4: 1500, h8: 2000, h12: 2500, h24: 3500 },
    features: ['Top-Class Fuel Economy', 'SmartPlay Touchscreen', 'Nimble City Handling'],
  },
  {
    id: 'swift-black',
    name: 'Swift Black Petrol',
    brand: 'Maruti Suzuki',
    vehicleType: 'four-wheeler',
    category: 'hatchback',
    categoryLabel: 'Premium Hatchback',
    image: '/images/cars/swift_black.jpg',
    engine: '1.2L DualJet Petrol',
    transmission: 'Manual',
    mileage: '24.8 km/l',
    tag: 'Sleek Black Street Hatch',
    packages: { h4: 1500, h8: 2000, h12: 2500, h24: 3500 },
    features: ['Phantom Black Paint', 'Chiseled Sporty Aerodynamics', 'Ultra Low Fuel Cost'],
  },
  {
    id: 'baleno-petrol',
    name: 'Baleno Manual Petrol',
    brand: 'Maruti Suzuki',
    vehicleType: 'four-wheeler',
    category: 'hatchback',
    categoryLabel: 'Luxury Hatchback',
    image: '/images/cars/baleno_white.jpg',
    engine: '1.2L DualJet Petrol',
    transmission: 'Manual',
    mileage: '22.3 km/l',
    tag: 'Spacious Nexa Comfort',
    packages: { h4: 1500, h8: 2000, h12: 2500, h24: 3500 },
    features: ['Plush Wide Legroom Cabin', 'Whisper-Quiet Petrol Motor', 'Large 318L Boot Space'],
  },
  {
    id: 'creta-black',
    name: 'Creta Black Diesel',
    brand: 'Hyundai',
    vehicleType: 'four-wheeler',
    category: 'suv',
    categoryLabel: 'Mid-Size SUV',
    image: '/images/cars/creta_black.jpg',
    engine: '1.5L CRDi Diesel',
    transmission: 'Manual',
    mileage: '19-21 km/l',
    tag: 'Knight Black Comfort Cruiser',
    packages: { h4: 1500, h8: 2500, h12: 3500, h24: 5000 },
    features: ['Punchy Diesel Torque', 'Panoramic Sunroof & Display', 'Supreme Long-Distance Ride'],
  },
  {
    id: 'creta-white',
    name: 'Creta White Petrol',
    brand: 'Hyundai',
    vehicleType: 'four-wheeler',
    category: 'suv',
    categoryLabel: 'Mid-Size SUV',
    image: '/images/cars/creta_white.jpg',
    engine: '1.5L MPi Petrol',
    transmission: 'Manual',
    mileage: '17 km/l',
    tag: 'Pearl White Family Cruiser',
    packages: { h4: 1500, h8: 2500, h12: 3500, h24: 5000 },
    features: ['Ultra-Refined Petrol Motor', 'Plush Cushioned 5-Seater Cabin', 'Smooth Highway Dynamics'],
  },
  {
    id: 'verna-white',
    name: 'Verna White Auto + Petrol',
    brand: 'Hyundai',
    vehicleType: 'four-wheeler',
    category: 'sedan',
    categoryLabel: 'Executive Sedan',
    image: '/images/cars/verna_white.jpg',
    engine: '1.5L MPi Petrol',
    transmission: 'Automatic',
    mileage: '18-20 km/l',
    tag: 'Futuristic Fastback Sedan',
    packages: { h4: 2000, h8: 3500, h12: 4500, h24: 6000 },
    features: ['Effortless Automatic Drive', 'Horizon LED Lightbar', 'Ventilated Front Seats & Infotainment'],
  },
  {
    id: 'virtus-petrol',
    name: 'Virtus Manual Petrol',
    brand: 'Volkswagen',
    vehicleType: 'four-wheeler',
    category: 'sedan',
    categoryLabel: 'German Sports Sedan',
    image: '/images/cars/virtus_red.jpg',
    engine: '1.0L TSI Turbo Petrol',
    transmission: 'Manual',
    mileage: '19.4 km/l',
    tag: '5-Star German Performance',
    packages: { h4: 2500, h8: 4000, h12: 5000, h24: 7000 },
    features: ['Global NCAP 5-Star Safety', 'TSI Turbo Punchy Acceleration', '521L Massive Boot Space'],
  },
  {
    id: 'slavia-petrol',
    name: 'Slavia Skoda Petrol',
    brand: 'Skoda',
    vehicleType: 'four-wheeler',
    category: 'sedan',
    categoryLabel: 'European Luxury Sedan',
    image: '/images/cars/slavia_blue.jpg',
    engine: '1.0L TSI Turbo Petrol',
    transmission: 'Manual',
    mileage: '19.4 km/l',
    tag: 'Pure European Elegance',
    packages: { h4: 2500, h8: 4000, h12: 5000, h24: 7000 },
    features: ['Signature Butterfly Grille', '5-Star Safety Rated Structure', 'Class-Leading Rear Knee Room'],
  },
  {
    id: 'venue-black',
    name: 'Venue Black',
    brand: 'Hyundai',
    vehicleType: 'four-wheeler',
    category: 'suv',
    categoryLabel: 'Compact SUV',
    image: '/images/cars/venue_black.jpg',
    engine: '1.2L Kappa Petrol',
    transmission: 'Manual',
    mileage: '18 km/l',
    tag: 'Bold Urban High Stance',
    packages: { h4: 1500, h8: 2000, h12: 3000, h24: 4500 },
    features: ['High Ground Clearance', 'Connecting LED Tail Lamps', 'Compact Easy City Parking'],
  },
  {
    id: 'brezza-white',
    name: 'Brezza White Petrol + CNG',
    brand: 'Maruti Suzuki',
    vehicleType: 'four-wheeler',
    category: 'suv',
    categoryLabel: 'Dual-Fuel Hybrid SUV',
    image: '/images/cars/brezza_white.jpg',
    engine: '1.5L Petrol + CNG',
    transmission: 'Manual',
    mileage: '25.5 km/kg CNG',
    tag: 'Dual-Fuel Ultimate Savings',
    packages: { h4: 1500, h8: 2000, h12: 3000, h24: 4500 },
    features: ['Petrol + Factory CNG Economy', 'Electric Sunroof & SmartPlay', 'Robust SUV Stance & Suspension'],
  },
  {
    id: 'fortuner-white',
    name: 'Fortuner White Auto',
    brand: 'Toyota',
    vehicleType: 'four-wheeler',
    category: 'suv',
    categoryLabel: 'Flagship Luxury SUV',
    image: '/images/cars/fortuner_white.jpg',
    engine: '2.8L D-4D Diesel',
    transmission: 'Automatic',
    mileage: '12-14 km/l',
    tag: 'Unchallenged Highway King',
    packages: { h12: 8000, h24: 12000 },
    features: ['500 Nm Massive Diesel Torque', '7-Seater Royal Leather Seating', 'Supreme Dominant Road Presence'],
  },
];

const ALL_VEHICLES: Vehicle[] = [...TWO_WHEELERS, ...FOUR_WHEELERS];
const VEHICLES = ALL_VEHICLES;

// 4 Strategic Offices as specified by the business
const OFFICES = [
  {
    number: 'OFFICE 2',
    name: 'Head Office — Maple House',
    address: 'G-29, Shiv Shakti Residency, Maple House, Waghodia road',
    phone: '7778999372',
    isHeadOffice: true,
    timing: '7:00 AM – 10:30 PM (All 7 Days)',
    badge: 'Central Fleet & Operations HQ',
  },
  {
    number: 'OFFICE 1',
    name: 'Parul University Campus Branch',
    address: 'Ishwarpura road, B/s. Bajarang Food Zone, Nr. Parul University, Limda',
    phone: '8849101045',
    isHeadOffice: false,
    timing: '7:00 AM – 10:30 PM (All 7 Days)',
    badge: 'Near University Gate & Hostels',
  },
  {
    number: 'OFFICE 3',
    name: 'Kamlapura Bus Stand Branch',
    address: 'Kamlapura bus stand, Nr. Kishan Vintage, Waghodia road',
    phone: '7778880416',
    isHeadOffice: false,
    timing: '7:00 AM – 10:00 PM (All 7 Days)',
    badge: 'Highway & Transit Junction',
  },
  {
    number: 'OFFICE 4',
    name: 'Shivalika Palace — Duttpura Branch',
    address: 'C/o. Rollito Shivalika Palace, Duttpura, Waghodia road',
    phone: '7778880416',
    isHeadOffice: false,
    timing: '7:00 AM – 10:00 PM (All 7 Days)',
    badge: 'Express Commuter Station',
  },
  {
    number: 'OFFICE 5',
    name: 'Marvadi College — Rajkot',
    address: 'Nr. Marvadi College, Rajkot',
    phone: '7778880416',
    isHeadOffice: false,
    timing: '7:00 AM – 10:00 PM (All 7 Days)',
    badge: 'Express Commuter Station',
  },
  {
    number: 'OFFICE 6',
    name: 'Katargam — Surat Branch',
    address: 'A-107 Suman sarthak,Lig awas, near laxminarayan Society, Dabholi char rasta,Katargam, Surat',
    phone: '7778880416',
    isHeadOffice: false,
    timing: '7:00 AM – 10:00 PM (All 7 Days)',
    badge: 'Express Commuter Station',
  },
  {
    number: 'OFFICE 7',
    name: 'Narayanpura - Ahmedabad',
    address: 'Narayanpura - Ahmedabad',
    phone: '7778880416',
    isHeadOffice: false,
    timing: '7:00 AM – 10:00 PM (All 7 Days)',
    badge: 'Express Commuter Station',
  },
];

const HERO_SLIDES = [
  {
    id: 'city-ride',
    image: '/images/Gemini_Generated_Image_b0nm93b0nm93b0nm.png',
    alt: 'City street motorcycle ride in Vadodara',
  },
  {
    id: 'college-activa',
    image: '/images/Gemini_Generated_Image_iw3pvuiw3pvuiw3p.png',
    alt: 'Student riding SB Bike Rental Activa near Parul University',
  },
  {
    id: 'scenic-bullet',
    image: '/images/Gemini_Generated_Image_x1agpsx1agpsx1ag.png',
    alt: 'Royal Enfield Bullet highway ride across Vadodara scenic route',
  },
];

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeFleetType, setActiveFleetType] = useState<FleetType>('two-wheeler');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState<Vehicle | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const handleFleetTypeChange = (type: FleetType) => {
    setActiveFleetType(type);
    setActiveCategory('all');
  };

  // Auto-slide hero background images every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    let list = ALL_VEHICLES;
    if (activeFleetType !== 'all') {
      list = list.filter((v) => (v.vehicleType || 'two-wheeler') === activeFleetType);
    }
    if (activeCategory !== 'all') {
      list = list.filter((v) => v.category === activeCategory);
    }
    return list;
  }, [activeFleetType, activeCategory]);

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Frosted Glass Apple-Style Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-slate-200/90 shadow-xs bg-white p-0.5 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <img
                src="/logo.png"
                alt="SB Group Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
                  SB Bike Rental LLP
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#what-we-do" className="hover:text-blue-600 transition-colors">
              What We Do
            </a>
            <a href="#services" className="hover:text-blue-600 transition-colors">
              Services
            </a>
            <a href="#fleet" className="hover:text-blue-600 transition-colors">
              Fleet Gallery
            </a>
            <a href="#branches" className="hover:text-blue-600 transition-colors">
              Our Offices
            </a>
            <a href="#about" className="hover:text-blue-600 transition-colors">
              About Us
            </a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* Action CTAs & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:7778999372"
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Head Office: 7778999372</span>
            </a>

            {user && (
              <Button
                onClick={() => navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/20 text-xs font-semibold px-3 sm:px-4 h-9 sm:h-9.5 flex items-center gap-1.5"
              >
                <span className="hidden sm:inline">Portal</span> Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-lg">
            <nav className="flex flex-col space-y-1 text-sm font-semibold text-slate-700">
              <a
                href="#what-we-do"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                What We Do
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                Services
              </a>
              <a
                href="#fleet"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                Fleet Gallery
              </a>
              <a
                href="#branches"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                Our Offices
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                About Us
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="tel:7778999372"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Head Office: 7778999372</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section: Auto-Sliding Background Carousel with Refined Soft Dark Effect */}
      <section className="relative pt-10 pb-14 sm:pt-16 sm:pb-20 md:pt-24 md:pb-28 overflow-hidden bg-slate-900">
        {/* Background Auto-Sliding Images */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroSlide ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
                }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center scale-102"
              />
            </div>
          ))}

          {/* Lighter dark overlay: Kept slightly dark for text clarity, but lighter so images are clearly visible */}
          <div className="absolute inset-0 z-2 bg-slate-950/50" />
          <div className="absolute inset-0 z-2 bg-gradient-to-b from-slate-950/50 via-slate-950/20 to-slate-950/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/90 shadow-md mb-5 sm:mb-6 animate-in fade-in slide-in-from-top-4 duration-700 max-w-full flex-wrap justify-center sm:flex-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-slate-800">
              Vadodara's Most Trusted 2-Wheeler Fleet Rental Network
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-[11px] sm:text-xs font-bold text-blue-600">4 Pickup Hubs</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] sm:leading-[1.1] max-w-4xl mx-auto drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
            Ride On Your Terms. <br />
            <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              Clean. Affordable. Instant.
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-white max-w-2xl mx-auto font-medium leading-relaxed px-1 sm:px-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            From daily college runs at <strong className="text-white font-bold underline decoration-sky-400/50 underline-offset-4">Parul University</strong> to smooth city cruising across <strong className="text-white font-bold underline decoration-sky-400/50 underline-offset-4">Waghodia Road</strong>. Choose from 50+ verified scooters and motorcycles with flexible hourly and daily packages.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto w-full sm:w-auto">
            <a
              href="#fleet"
              className="w-full sm:w-auto justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/35 hover:shadow-2xl hover:shadow-blue-600/50 transition-all flex items-center gap-2 group"
            >
              <span>Explore Fleet & Rates</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#branches"
              className="w-full sm:w-auto justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>Our Offices</span>
            </a>
          </div>

          {/* Subtle 2s Slide Progress Dots */}
          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-1.5 relative z-10">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentHeroSlide
                  ? 'w-7 bg-white shadow-md'
                  : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Floating Key Highlights */}
          <div className="mt-10 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/80 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Clock className="w-4 h-4 shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Hourly Pricing</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900">Starts at ₹100 / Hr</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">1st Hr fixed - fair grace</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/80 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Zero Hidden Fee</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900">100% Transparent</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Exact settlement without cuts</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/80 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Network</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900">4 Offices in Town</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Pick up & swap at ease</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/80 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-2 text-sky-600 mb-1">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Fleet Quality</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900">50+ Two-Wheelers</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Serviced & road-ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What We Do (Seamless 4-Step Journey) */}
      <section id="what-we-do" className="py-12 sm:py-20 md:py-28 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              EFFORTLESS RENTAL WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">
              How SB Bike Rental Works
            </h2>
            <p className="text-slate-600 mt-2.5 sm:mt-3 text-sm sm:text-base">
              Renting a two-wheeler in Vadodara has never been this smooth. No paperwork headache — just 4 simple steps to hit the road.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="relative bg-[#fbfbfd] p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-blue-400 transition-all duration-300 group shadow-xs">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center font-extrabold text-base sm:text-lg mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">Pick Your Two-Wheeler</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose between fuel-efficient commuters (Splendor, Shine), automatic scooters (Activa, Access), or iconic cruisers (Bullet, Hunter, MT-15).
              </p>
            </div>

            <div className="relative bg-[#fbfbfd] p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-blue-400 transition-all duration-300 group shadow-xs">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-100/70 text-indigo-600 flex items-center justify-center font-extrabold text-base sm:text-lg mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">2-Minute Verification</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Provide a valid Driving License and any standard Govt ID proof (Aadhaar or College ID). Instant digital check-in on the spot.
              </p>
            </div>

            <div className="relative bg-[#fbfbfd] p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-blue-400 transition-all duration-300 group shadow-xs">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center font-extrabold text-base sm:text-lg mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">Pickup at 4 Branches</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Walk into Maple House Head Office, Parul University Limda gate, Kamlapura, or Duttpura. Key handed over with a complimentary helmet.
              </p>
            </div>

            <div className="relative bg-[#fbfbfd] p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-blue-400 transition-all duration-300 group shadow-xs">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-100/70 text-purple-600 flex items-center justify-center font-extrabold text-base sm:text-lg mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                04
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">Ride & Settle Fairly</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ride wherever you need. Return at your convenience. Accurate minute-by-minute system billing with advance deposit settled on the spot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services & Unique Perks */}
      <section id="services" className="py-12 sm:py-20 md:py-28 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              PREMIUM ADVANTAGES
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">
              Why Vadodara Rides With SB
            </h2>
            <p className="text-slate-600 mt-2.5 sm:mt-3 text-sm sm:text-base">
              Built specifically to solve the mobility problems of university students, daily job commuters, and weekend travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 sm:mb-6">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">Hourly & Multi-Day Flexibility</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Only need a bike for 2 hours to visit a friend, or need it for 3 days for exams? We offer packages from 1-Hour fixed to multi-week rentals at graduated discount rates.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 sm:mb-6">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">Parul University Dedicated Hub</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Located right opposite Parul University at Limda (Ishwarpura Rd, next to Bajarang Food Zone). No expensive auto-rickshaws — pick up your scooter right next to campus.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 sm:mb-6">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">Sanitized & Thoroughly Serviced</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Zero breakdown surprises. Every bike in our fleet undergoes oil level, brake, clutch, tyre pressure, and battery health inspections before check-out.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 sm:mb-6">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">Flexible Vehicle Exchange</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Renting a scooter but suddenly planning a long highway tour? Swap smoothly for a Bullet, Hunter, or Pulsar at any of our branches anytime during your active trip.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 sm:mb-6">
                <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">Zero Hidden Deductions</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Our digital billing automatically calculates your exact duration with transparent grace period allowances. Your security deposit balance is settled immediately.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 sm:mb-6">
                <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">Direct Hotline Support</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Friendly support for route inquiries, breakdown assistance, package extension requests, or branch coordination. We are just a phone call away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Apple-Style Fleet Gallery Showcase */}
      <section id="fleet" className="py-12 sm:py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5 sm:gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                50+ BIKES & 14+ CARS / SUVS AVAILABLE
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-1.5 sm:mt-2">
                The SB Rental Fleet Gallery
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-xl">
                Browse our complete line-up of verified two-wheelers and premium self-drive cars with exact duration packages and transparent hourly pricing.
              </p>
            </div>

            {/* Master Fleet Segment + Category Filter Pills */}
            <div className="flex flex-col gap-2.5 items-start md:items-end w-full md:w-auto">
              {/* Primary Type Switcher: 2-Wheelers vs 4-Wheelers */}
              <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 max-w-full">
                <button
                  onClick={() => handleFleetTypeChange('two-wheeler')}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeFleetType === 'two-wheeler'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Bike className="w-4 h-4 text-blue-600" />
                  <span>2-Wheelers ({TWO_WHEELERS.length})</span>
                </button>
                <button
                  onClick={() => handleFleetTypeChange('four-wheeler')}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeFleetType === 'four-wheeler'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Car className="w-4 h-4 text-indigo-600" />
                  <span>4-Wheelers ({FOUR_WHEELERS.length})</span>
                </button>
                <button
                  onClick={() => handleFleetTypeChange('all')}
                  className={`flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeFleetType === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <span>All ({ALL_VEHICLES.length})</span>
                </button>
              </div>

              {/* Sub-Category Filter Pills */}
              <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 max-w-full">
                {activeFleetType === 'two-wheeler' && (
                  <>
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      All Bikes ({TWO_WHEELERS.length})
                    </button>
                    <button
                      onClick={() => setActiveCategory('scooter')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'scooter' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      Scooters (4)
                    </button>
                    <button
                      onClick={() => setActiveCategory('commuter')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'commuter' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      Commuters (3)
                    </button>
                    <button
                      onClick={() => setActiveCategory('sports')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'sports' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      Street & Sports (4)
                    </button>
                    <button
                      onClick={() => setActiveCategory('cruiser')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'cruiser' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      Cruisers & Classics (4)
                    </button>
                  </>
                )}

                {activeFleetType === 'four-wheeler' && (
                  <>
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      All Cars ({FOUR_WHEELERS.length})
                    </button>
                    <button
                      onClick={() => setActiveCategory('suv')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'suv' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      SUVs & 4x4 (8)
                    </button>
                    <button
                      onClick={() => setActiveCategory('sedan')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'sedan' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      Executive Sedans (3)
                    </button>
                    <button
                      onClick={() => setActiveCategory('hatchback')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'hatchback' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      Hatchbacks (3)
                    </button>
                  </>
                )}

                {activeFleetType === 'all' && (
                  <>
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      All Vehicles ({ALL_VEHICLES.length})
                    </button>
                    <button
                      onClick={() => setActiveCategory('suv')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'suv' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      SUVs (8)
                    </button>
                    <button
                      onClick={() => setActiveCategory('sedan')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'sedan' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      Sedans (3)
                    </button>
                    <button
                      onClick={() => setActiveCategory('hatchback')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'hatchback' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      Hatchbacks (3)
                    </button>
                    <button
                      onClick={() => setActiveCategory('scooter')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'scooter' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      Scooters (4)
                    </button>
                    <button
                      onClick={() => setActiveCategory('cruiser')}
                      className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'cruiser' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                        }`}
                    >
                      Cruisers (4)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-[#fbfbfd] rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Vehicle Image Stage */}
                <div className="relative aspect-[4/3] bg-white p-4 sm:p-6 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <span className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                    {vehicle.categoryLabel}
                  </span>
                  <span className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                    {vehicle.brand}
                  </span>

                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-contain group-hover:scale-106 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      {vehicle.tag}
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                      {vehicle.name}
                    </h3>

                    {/* Specs Badges */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5 sm:mt-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200/70 shadow-2xs">
                        <Gauge className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-semibold text-xs">{vehicle.engine}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200/70 shadow-2xs">
                        <Fuel className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-semibold text-xs">{vehicle.mileage}</span>
                      </div>
                      {vehicle.transmission && (
                        <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200/70 shadow-2xs">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-semibold text-xs">{vehicle.transmission}</span>
                        </div>
                      )}
                    </div>

                    {/* Feature bullets */}
                    <ul className="mt-3.5 sm:mt-4 space-y-1.5 text-xs text-slate-600">
                      {vehicle.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing & CTA */}
                  {vehicle.packages ? (
                    <div className="mt-4 pt-3.5 border-t border-slate-200/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Package Pricing
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50">
                          Exact Rates
                        </span>
                      </div>

                      {/* Duration Package Grid */}
                      <div className="grid grid-cols-2 gap-1.5 mb-3.5">
                        {vehicle.packages.h4 && (
                          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                            <span className="text-[11px] font-semibold text-slate-500">4 Hours</span>
                            <span className="text-xs font-black text-slate-900">₹{vehicle.packages.h4.toLocaleString()}</span>
                          </div>
                        )}
                        {vehicle.packages.h8 && (
                          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                            <span className="text-[11px] font-semibold text-slate-500">8 Hours</span>
                            <span className="text-xs font-black text-slate-900">₹{vehicle.packages.h8.toLocaleString()}</span>
                          </div>
                        )}
                        {vehicle.packages.h12 && (
                          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                            <span className="text-[11px] font-semibold text-slate-500">12 Hours</span>
                            <span className="text-xs font-black text-slate-900">₹{vehicle.packages.h12.toLocaleString()}</span>
                          </div>
                        )}
                        {vehicle.packages.h24 && (
                          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                            <span className="text-[11px] font-semibold text-slate-500">24 Hours</span>
                            <span className="text-xs font-black text-slate-900">₹{vehicle.packages.h24.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting from</span>
                          <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                            ₹{(vehicle.packages.h4 || vehicle.packages.h12).toLocaleString()}
                            <span className="text-[11px] font-medium text-slate-500 ml-1">
                              / {vehicle.packages.h4 ? '4h' : '12h'}
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={() => setSelectedVehicleForModal(vehicle)}
                          className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold px-4 h-9 shadow-sm transition-colors shrink-0"
                        >
                          Book / Inquire
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 pt-4 sm:mt-6 sm:pt-5 border-t border-slate-200/80 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-black text-slate-900">₹{vehicle.ratePerHr}</span>
                          <span className="text-[11px] sm:text-xs text-slate-500 font-medium">/ Hour</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => setSelectedVehicleForModal(vehicle)}
                        className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold px-3.5 sm:px-4 h-9 shadow-sm transition-colors shrink-0"
                      >
                        Book / Inquire
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Our 4 Branch Offices (Interactive Location Directory) */}
      <section id="branches" className="py-12 sm:py-20 md:py-28 bg-[#f5f5f7] border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              VADODARA & WAGHODIA ROAD NETWORK
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-1.5 sm:mt-2">
              Our Strategic Offices
            </h2>
            <p className="text-slate-600 mt-2.5 sm:mt-3 text-sm sm:text-base">
              Conveniently located near Parul University, major residential zones, and transit hubs. Walk in to pick up or return your ride anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {OFFICES.map((office, idx) => (
              <div
                key={idx}
                className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-300 relative overflow-hidden bg-white shadow-xs hover:shadow-xl ${office.isHeadOffice
                  ? 'border-blue-400 ring-2 ring-blue-500/20'
                  : 'border-slate-200/90 hover:border-slate-300'
                  }`}
              >
                {office.isHeadOffice && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] sm:text-[11px] font-extrabold px-3 sm:px-4 py-0.5 sm:py-1 rounded-bl-xl sm:rounded-bl-2xl uppercase tracking-wider shadow-sm">
                    Head Office
                  </div>
                )}

                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/60 mb-1.5 sm:mb-2">
                      {office.number}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {office.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="font-medium text-slate-800 leading-snug">
                      {office.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">{office.timing}</span>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-xs text-indigo-700 font-semibold">{office.badge}</span>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                  <a
                    href={`tel:${office.phone}`}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all w-full sm:w-auto"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call: +91 {office.phone}</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      office.address + ', Vadodara, Gujarat'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors py-1 sm:py-0"
                  >
                    <span>View on Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. About Us Section */}
      <section id="about" className="py-12 sm:py-20 md:py-28 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                ABOUT SB BIKE RENTAL
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-1.5 sm:mt-2 leading-tight">
                Empowering Daily Freedom Across Vadodara
              </h2>
              <p className="text-slate-600 mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed">
                Founded with a mission to eliminate daily commuting friction in Vadodara, <strong className="text-slate-900 font-semibold">SB Bike Rental</strong> has grown from a single branch into a premier 4-hub network catering to university scholars, corporate commuters, and explorers.
              </p>
              <p className="text-slate-600 mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed">
                With our Head Office on <strong className="text-slate-900 font-semibold">Waghodia Road</strong> and a dedicated campus station outside <strong className="text-slate-900 font-semibold">Parul University</strong>, we provide clean, meticulously serviced scooters and bikes backed by digital billing and zero hidden surprises.
              </p>

              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2.5 sm:gap-4 border-t border-slate-100 pt-5 sm:pt-6">
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-blue-600">4</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 sm:mt-1">Branches in City</p>
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-indigo-600">15+</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 sm:mt-1">Vehicle Models</p>
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-600">100%</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 sm:mt-1">Verified Fleet</p>
                </div>
              </div>
            </div>

            {/* Visual Box */}
            <div className="bg-[#fbfbfd] p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="p-2.5 sm:p-3 bg-blue-600 text-white rounded-xl sm:rounded-2xl shadow-md shadow-blue-500/30 shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">The SB Rental Guarantee</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">Every single ride backed by our promise</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5 sm:gap-3 bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/70 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">Standard Helmets Provided</h5>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Safety first — sanitized ISI-certified helmets included with every rental.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3 bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/70 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">Full Legal Documentation</h5>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">All vehicles have active RTO commercial registration, insurance, and PUC certificates.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3 bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/70 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">Instant Security Deposit Settlement</h5>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Cash or Online UPI refund immediately after return with transparent time logs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Contact Section & Quick Inquiry */}
      <section id="contact" className="py-12 sm:py-20 md:py-28 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl p-5 sm:p-8 md:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  REACH OUT TO US
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5 sm:mt-2">
                  Need a Ride or Have Questions?
                </h2>
                <p className="text-slate-600 mt-2.5 sm:mt-4 text-sm sm:text-base">
                  Contact our Head Office or the branch closest to you. We are open every day from 7:00 AM to 10:30 PM.
                </p>

                <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Head Office Hotline</p>
                      <a href="tel:7778999372" className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                        +91 77789 99372
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Parul University Campus Hotline</p>
                      <a href="tel:8849101045" className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                        +91 88491 01045
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Branches 3 & 4 Hotline</p>
                      <a href="tel:7778880416" className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                        +91 77788 80416
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Inquiry Card */}
              <div className="bg-[#fbfbfd] p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">Book Your Two-Wheeler</h3>
                <p className="text-xs text-slate-500 mb-4 sm:mb-6">
                  Select your vehicle and call or visit our nearest branch for instant pickup.
                </p>

                <div className="space-y-3.5 sm:space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Available Vehicle Lineup
                    </label>
                    <select className="w-full h-10 sm:h-11 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium">
                      {VEHICLES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.brand}) — Starting ₹{v.ratePerHr}/hr
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Choose Nearest Branch
                    </label>
                    <select className="w-full h-10 sm:h-11 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium">
                      {OFFICES.map((off, idx) => (
                        <option key={idx} value={off.number}>
                          {off.name} ({off.number})
                        </option>
                      ))}
                    </select>
                  </div>

                  <a
                    href="tel:7778999372"
                    className="w-full h-11 sm:h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 mt-3 sm:mt-4 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Head Office for Instant Booking</span>
                  </a>

                  <p className="text-[10px] sm:text-[11px] text-center text-slate-400 mt-2">
                    Open 7 days a week from 7:00 AM onwards. Valid Driving License required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Clean Apple-Style Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-8 sm:py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-100">
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-slate-200 shadow-xs bg-white p-0.5 shrink-0">
                <img
                  src="/logo.png"
                  alt="SB Group Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-sm">SB Bike Rental LLP</span>
                <p className="text-[11px] text-slate-500">SB Group • Vadodara & Waghodia Road</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-medium text-slate-600 text-xs">
              <a href="#what-we-do" className="hover:text-blue-600 transition-colors">What We Do</a>
              <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
              <a href="#fleet" className="hover:text-blue-600 transition-colors">Fleet Gallery</a>
              <a href="#branches" className="hover:text-blue-600 transition-colors">Our Offices</a>
              <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>

          <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-slate-400 text-[11px] text-center sm:text-left">
            <p>© {new Date().getFullYear()} SB Bike Rental. All rights reserved.</p>
            <p>Designed by JK Rabari.</p>
          </div>
        </div>
      </footer>

      {/* Booking Inquiry Modal */}
      {selectedVehicleForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedVehicleForModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 sm:gap-4 mb-5 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-[#f5f5f7] p-1.5 sm:p-2 flex items-center justify-center border border-slate-100 shrink-0">
                <img
                  src={selectedVehicleForModal.image}
                  alt={selectedVehicleForModal.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  {selectedVehicleForModal.categoryLabel}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {selectedVehicleForModal.name}
                </h3>
                {selectedVehicleForModal.packages ? (
                  <div className="mt-1">
                    <span className="text-xs font-bold text-slate-600">
                      Starting at ₹{(selectedVehicleForModal.packages.h4 || selectedVehicleForModal.packages.h12).toLocaleString()} / {selectedVehicleForModal.packages.h4 ? '4h' : '12h'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base sm:text-lg font-black text-slate-900">₹{selectedVehicleForModal.ratePerHr} / Hour</span>
                  </div>
                )}
              </div>
            </div>

            {/* Package Grid if 4-Wheeler */}
            {selectedVehicleForModal.packages && (
              <div className="mb-5 bg-blue-50/60 p-3.5 sm:p-4 rounded-2xl border border-blue-100">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-2.5">
                  Official Package Duration Rates
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedVehicleForModal.packages.h4 && (
                    <div className="p-2.5 rounded-xl bg-white border border-blue-100 flex justify-between items-center shadow-2xs">
                      <span className="text-xs font-medium text-slate-600">4 Hours</span>
                      <strong className="text-sm font-black text-slate-900">₹{selectedVehicleForModal.packages.h4.toLocaleString()}</strong>
                    </div>
                  )}
                  {selectedVehicleForModal.packages.h8 && (
                    <div className="p-2.5 rounded-xl bg-white border border-blue-100 flex justify-between items-center shadow-2xs">
                      <span className="text-xs font-medium text-slate-600">8 Hours</span>
                      <strong className="text-sm font-black text-slate-900">₹{selectedVehicleForModal.packages.h8.toLocaleString()}</strong>
                    </div>
                  )}
                  {selectedVehicleForModal.packages.h12 && (
                    <div className="p-2.5 rounded-xl bg-white border border-blue-100 flex justify-between items-center shadow-2xs">
                      <span className="text-xs font-medium text-slate-600">12 Hours</span>
                      <strong className="text-sm font-black text-slate-900">₹{selectedVehicleForModal.packages.h12.toLocaleString()}</strong>
                    </div>
                  )}
                  {selectedVehicleForModal.packages.h24 && (
                    <div className="p-2.5 rounded-xl bg-white border border-blue-100 flex justify-between items-center shadow-2xs">
                      <span className="text-xs font-medium text-slate-600">24 Hours</span>
                      <strong className="text-sm font-black text-slate-900">₹{selectedVehicleForModal.packages.h24.toLocaleString()}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/60 mb-5 sm:mb-6 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Engine Capacity:</span>
                <strong className="text-slate-900">{selectedVehicleForModal.engine}</strong>
              </div>
              {selectedVehicleForModal.transmission && (
                <div className="flex justify-between text-slate-600">
                  <span>Transmission:</span>
                  <strong className="text-slate-900">{selectedVehicleForModal.transmission}</strong>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Fuel Mileage:</span>
                <strong className="text-slate-900">{selectedVehicleForModal.mileage}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pickup Locations:</span>
                <strong className="text-slate-900">All 4 SB Branches</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3.5 sm:mb-4 font-medium">
              Call our team now to check real-time availability at your nearest branch:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              <a
                href="tel:7778999372"
                className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Head Office</span>
              </a>

              <a
                href={`https://wa.me/917778999372?text=${encodeURIComponent(
                  selectedVehicleForModal.packages
                    ? `Hello SB Rental, I want to book/inquire about the ${selectedVehicleForModal.name} (${[
                      selectedVehicleForModal.packages.h4 ? `4h: ₹${selectedVehicleForModal.packages.h4}` : '',
                      selectedVehicleForModal.packages.h8 ? `8h: ₹${selectedVehicleForModal.packages.h8}` : '',
                      `12h: ₹${selectedVehicleForModal.packages.h12}`,
                      `24h: ₹${selectedVehicleForModal.packages.h24}`,
                    ]
                      .filter(Boolean)
                      .join(', ')}). Please share availability.`
                    : `Hello SB Bike Rental, I want to book/inquire about the ${selectedVehicleForModal.name} (₹${selectedVehicleForModal.ratePerHr}/hr).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.979-.276-.1-.476-.15-.677.15-.201.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.201-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.928-2.235-.244-.588-.493-.508-.677-.517-.176-.009-.376-.009-.577-.009s-.527.075-.803.376c-.276.301-1.053 1.029-1.053 2.509s1.079 2.91 1.229 3.111c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.634.721.229 1.377.197 1.896.119.579-.088 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.351zM12.04 2c-5.523 0-10 4.477-10 10 0 1.764.458 3.424 1.26 4.872L2 22l5.302-1.222A9.957 9.957 0 0012.04 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.283a8.23 8.23 0 01-4.2-1.152l-.301-.179-3.125.72.831-3.045-.196-.312A8.258 8.258 0 013.78 12c0-4.555 3.705-8.26 8.26-8.26 4.555 0 8.26 3.705 8.26 8.26 0 4.555-3.705 8.283-8.26 8.283z" />
                </svg>
                <span>WhatsApp Head Office</span>
              </a>
            </div>

            <Button
              variant="outline"
              onClick={() => setSelectedVehicleForModal(null)}
              className="w-full mt-3 text-xs rounded-xl"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Instant Chat Button (Round Icon Only) */}
      <a
        href="https://wa.me/917778999372?text=Hello%20SB%20Bike%20Rental%2C%20I%20want%20to%20inquire%20about%20renting%20a%20bike."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl shadow-[#25D366]/50 hover:shadow-[#25D366]/70 transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="Chat with SB Bike Rental Head Office on WhatsApp (+91 77789 99372)"
        title="Chat with SB Bike Rental on WhatsApp"
      >
        {/* Subtle pulsating ripple */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none -z-10" />

        {/* WhatsApp Official SVG Icon */}
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current shrink-0"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.979-.276-.1-.476-.15-.677.15-.201.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.201-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.928-2.235-.244-.588-.493-.508-.677-.517-.176-.009-.376-.009-.577-.009s-.527.075-.803.376c-.276.301-1.053 1.029-1.053 2.509s1.079 2.91 1.229 3.111c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.634.721.229 1.377.197 1.896.119.579-.088 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.351zM12.04 2c-5.523 0-10 4.477-10 10 0 1.764.458 3.424 1.26 4.872L2 22l5.302-1.222A9.957 9.957 0 0012.04 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.283a8.23 8.23 0 01-4.2-1.152l-.301-.179-3.125.72.831-3.045-.196-.312A8.258 8.258 0 013.78 12c0-4.555 3.705-8.26 8.26-8.26 4.555 0 8.26 3.705 8.26 8.26 0 4.555-3.705 8.283-8.26 8.283z" />
        </svg>
      </a>
    </div>
  );
}
