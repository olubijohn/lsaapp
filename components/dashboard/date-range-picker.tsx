"use client";

import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isWithinInterval,
  isBefore,
  isAfter,
  startOfToday
} from "date-fns";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  onRangeSelect: (range: DateRange) => void;
  initialRange?: DateRange;
}

const DateRangePicker = ({ onRangeSelect, initialRange }: DateRangePickerProps) => {
  const [range, setRange] = useState<DateRange>(initialRange || { from: startOfToday(), to: undefined });
  const [showPicker, setShowPicker] = useState(false);
  const [leftMonth, setLeftMonth] = useState(range.from || new Date());
  const [rightMonth, setRightMonth] = useState(addMonths(leftMonth, 1));

  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateClick = (date: Date) => {
    if (!range.from || (range.from && range.to)) {
      const newRange = { from: date, to: undefined };
      setRange(newRange);
      onRangeSelect(newRange);
    } else if (isBefore(date, range.from)) {
      const newRange = { from: date, to: undefined };
      setRange(newRange);
      onRangeSelect(newRange);
    } else {
      const newRange = { from: range.from, to: date };
      setRange(newRange);
      onRangeSelect(newRange);
      // Optional: Close on selection completion
      // setShowPicker(false);
    }
  };

  const renderCalendar = (monthDate: Date) => {
    const start = startOfWeek(startOfMonth(monthDate));
    const end = endOfWeek(endOfMonth(monthDate));
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="w-[244px]">
        <div className="flex items-center justify-center mb-4 h-6 relative px-8">
          <h2 className="text-[14px] font-bold text-[#2E2E3A] whitespace-nowrap overflow-hidden text-ellipsis">
            {format(monthDate, "MMMM yyyy")}
          </h2>
        </div>
        <div className="grid grid-cols-7 text-center text-[11px] mb-2 uppercase font-medium text-gray-400">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, monthDate);
            const isRangeStart = range.from && isSameDay(day, range.from);
            const isRangeEnd = range.to && isSameDay(day, range.to);
            const isSelected = isRangeStart || isRangeEnd;
            const inRange = range.from && range.to && isWithinInterval(day, { start: range.from, end: range.to });

            return (
              <div
                key={day.toString()}
                className={cn(
                  "relative h-8.5 w-8.5 flex items-center justify-center cursor-pointer text-xs transition-all",
                  !isCurrentMonth && "text-gray-200 pointer-events-none",
                  isCurrentMonth && "text-[#2E2E3A] hover:bg-blue-50",
                  inRange && !isSelected && "bg-[#EDF4FF] text-[#0062FF]",
                  isRangeStart && range.to && "rounded-l-lg",
                  isRangeEnd && "rounded-r-lg",
                  isSelected && "bg-[#0062FF] text-white font-bold rounded-lg z-10"
                )}
                onClick={() => handleDateClick(day)}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const resetRange = () => {
    const newRange = { from: undefined, to: undefined };
    setRange(newRange);
    onRangeSelect(newRange);
  };

  const setToday = () => {
    const today = startOfToday();
    const newRange = { from: today, to: today };
    setRange(newRange);
    onRangeSelect(newRange);
    setShowPicker(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 bg-[#F9FAFB] border border-[#EAECF0] px-3 h-10 rounded-lg text-sm font-medium text-[#344054] hover:bg-gray-50 transition-colors"
      >
        <CalendarIcon className="h-4 w-4 text-[#667085]" />
        <span>
          {range.from ? (
            range.to && !isSameDay(range.from, range.to) ? (
              `${format(range.from, "d MMM yyyy")} - ${format(range.to, "d MMM yyyy")}`
            ) : (
              format(range.from, "d MMM yyyy")
            )
          ) : (
            "Select date range"
          )}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-[#667085] transition-transform", showPicker && "rotate-180")} />
      </button>

      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute top-full left-0 mt-2 p-5 bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] border border-[#E5E7EB] z-50 flex flex-col gap-6"
          style={{ width: "552px" }}
        >
          <div className="flex items-start gap-6">
            <div className="relative flex-1">
              <button 
                onClick={() => {
                  setLeftMonth(subMonths(leftMonth, 1));
                  setRightMonth(subMonths(rightMonth, 1));
                }}
                className="absolute left-0 top-0 p-1 hover:bg-gray-100 rounded-md text-gray-400 z-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {renderCalendar(leftMonth)}
            </div>
            <div className="relative flex-1">
              <button 
                onClick={() => {
                  setLeftMonth(addMonths(leftMonth, 1));
                  setRightMonth(addMonths(rightMonth, 1));
                }}
                className="absolute right-0 top-0 p-1 hover:bg-gray-100 rounded-md text-gray-400 z-10"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              {renderCalendar(rightMonth)}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              onClick={resetRange}
              className="px-4 h-11 text-sm font-bold border border-[#EAECF0] text-[#344054] hover:bg-gray-50 rounded-lg transition-colors flex-1"
            >
              Clear
            </button>
            <button
              onClick={setToday}
              className="px-4 h-11 text-sm font-bold bg-[#0062FF] text-white rounded-lg hover:bg-[#0052D9] transition-colors flex-1 flex items-center justify-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
