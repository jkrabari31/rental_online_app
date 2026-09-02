import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  currencySymbol: '₹',
  setCurrencySymbol: (symbol) => set({ currencySymbol: symbol }),
}));
