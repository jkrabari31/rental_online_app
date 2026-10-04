import * as React from "react";
import { 
  format, 
  parse, 
  isValid, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from "date-fns";
import { Calendar as CalendarIcon, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  value?: string; // "yyyy-MM-dd" or "ALL" or ""
  onChange: (dateStr: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  allowClear?: boolean;
  minDate?: Date;
  maxDate?: Date;
  size?: "default" | "sm";
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  allowClear = false,
  minDate,
  maxDate,
  size = "default",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => {
    if (!value || value === "ALL") return undefined;
    try {
      const parsed = parse(value, "yyyy-MM-dd", new Date());
      return isValid(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }, [value]);

  // Calendar navigation month
  const [viewMonth, setViewMonth] = React.useState<Date>(() => selectedDate || new Date());

  React.useEffect(() => {
    if (selectedDate && isValid(selectedDate)) {
      setViewMonth(selectedDate);
    }
  }, [selectedDate]);

  const handleSelect = (date: Date) => {
    if (disabledDate(date)) return;
    onChange(format(date, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewMonth((prev) => addMonths(prev, 1));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
  };

  const disabledDate = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Generate days in calendar grid (including buffer days from prev & next month)
  const calendarDays = React.useMemo(() => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [viewMonth]);

  const formattedDisplay = React.useMemo(() => {
    if (!selectedDate) return placeholder;
    return format(selectedDate, "dd MMM yyyy");
  }, [selectedDate, placeholder]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "group flex items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 shadow-xs transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-left cursor-pointer",
          size === "sm" ? "h-9 text-xs px-2.5" : "h-10 text-sm",
          !selectedDate && "text-muted-foreground font-normal",
          className
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <div className="flex items-center justify-center p-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
            <CalendarIcon className={cn("shrink-0", size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4")} />
          </div>
          <span className="truncate">{formattedDisplay}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {allowClear && selectedDate && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Clear date"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[304px] p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl z-50 animate-in fade-in-0 zoom-in-95"
      >
        {/* Month & Navigation Header */}
        <div className="flex items-center justify-between px-1 mb-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {format(viewMonth, "MMMM yyyy")}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday Row */}
        <div className="grid grid-cols-7 gap-1 mb-1.5 text-center">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="h-7 flex items-center justify-center text-[11px] font-bold text-slate-400 dark:text-slate-500 select-none uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, viewMonth);
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            const isCurrentDay = isToday(day);
            const isDisabled = disabledDate(day);

            return (
              <button
                key={idx}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelect(day)}
                className={cn(
                  "h-9 w-9 flex items-center justify-center rounded-xl text-xs font-semibold transition-all relative select-none",
                  // Selected state
                  isSelected &&
                    "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30 scale-105 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 z-10",
                  // Today state (unselected)
                  !isSelected &&
                    isCurrentDay &&
                    "border border-blue-500 text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30",
                  // Normal day state
                  !isSelected &&
                    !isCurrentDay &&
                    isCurrentMonth &&
                    "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400",
                  // Outside month state
                  !isSelected &&
                    !isCurrentMonth &&
                    "text-slate-300 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                  // Disabled state
                  isDisabled && "opacity-25 cursor-not-allowed pointer-events-none"
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
