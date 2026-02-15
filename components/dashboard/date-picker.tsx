"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  onDateSelect: (date: Date) => void;
}

const DatePicker = ({ onDateSelect }: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
        setShowMonthDropdown(false);
        setShowYearDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    onDateSelect(newDate);
    setShowCalendar(false);
  };

  const renderCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    // Previous month's days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`prev-${i}`}
          className="text-[#9A9AAF] text-xs px-[10px] py-[5px] rounded-[5px]"
        >
          {prevMonthDays - firstDayOfMonth + i + 1}
        </div>,
      );
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected =
        i === selectedDate.getDate() &&
        currentMonth === selectedDate.getMonth() &&
        currentYear === selectedDate.getFullYear();

      days.push(
        <div
          key={i}
          className={`cursor-pointer rounded-[5px] text-xs px-[10px] py-[5px] ${isSelected ? "bg-blue-600 text-white shadow-[0_4px_35px_0_rgba(0,98,255,0.10)]" : "hover:bg-blue-100"}`}
          onClick={() => handleDateSelect(i)}
          style={{ backdropFilter: "blur(2px)" }}
        >
          {i}
        </div>,
      );
    }

    // Next month's days
    const totalCells = 42; // 6 weeks
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="text-[#9A9AAF] text-xs px-[10px] py-[5px] rounded-[5px]"
        >
          {i}
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="relative inline-block">
      {/* Button */}
      <button
        ref={buttonRef}
        className="flex items-center gap-2 bg-white p-[9px] rounded-[6px] border border-gray-200 shadow-sm"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <Calendar className="w-5 h-5 text-[#9A9AAF]" />
        <span className="text-xs font-bold text-[#2E2E3A]">
          {months[selectedDate.getMonth()]}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform text-[#9A9AAF] ${showCalendar ? "rotate-180" : ""}`}
        />
      </button>

      {/* Calendar Popup */}
      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute top-full right-0 mt-1 w-[335px] max-w-[90vw] p-3 lg:p-5 rounded-[10px] z-50 overflow-visible"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 4px 35px 0 rgba(0, 98, 255, 0.10)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="head flex gap-3 lg:gap-5 items-center mb-5">
            <div className="icon bg-white p-2 rounded-[10px] shadow-[0_2px_10px_0_rgba(0,98,255,0.05)]">
              <Calendar className="w-5 h-5 text-[#0062FF]" />
            </div>
            <div className="text text-left">
              <h2 className="text-[15px] text-[#2E2E3A] font-bold">
                Change Date
              </h2>
              <p className="text-xs text-[#2E2E3A]">
                Change between Date, Month, and Year
              </p>
            </div>
          </div>
          <div className="p-[10px] bg-white rounded-[10px] z-50">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <button
                className="px-3 py-[9px] flex items-center gap-2 group relative"
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false);
                }}
              >
                <span className="text-xs text-[#2E2E3A] group-hover:text-[#0062FF]">
                  {months[currentMonth]}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform text-[#9A9AAF] ${showMonthDropdown ? "rotate-180" : ""} group-hover:text-[#0062FF]`}
                />

                {/* Month Dropdown */}
                {showMonthDropdown && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-white flex flex-col gap-1 z-[60] w-32 shadow-[0_4px_30px_0_rgba(0,98,255,0.15)] rounded-md max-h-48 overflow-y-auto">
                    {months.map((month, index) => (
                      <div
                        key={month}
                        className={`cursor-pointer p-2 hover:bg-blue-50 rounded text-xs ${currentMonth === index ? "bg-blue-600 text-white" : "text-gray-700"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentMonth(index);
                          setShowMonthDropdown(false);
                        }}
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                )}
              </button>

              <button
                className="px-3 py-[9px] flex items-center gap-2 group relative"
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowMonthDropdown(false);
                }}
              >
                <span className="text-xs text-[#2E2E3A] group-hover:text-[#0062FF]">
                  {currentYear}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform text-[#9A9AAF] ${showYearDropdown ? "rotate-180" : ""} group-hover:text-[#0062FF]`}
                />

                {/* Year Dropdown */}
                {showYearDropdown && (
                  <div className="absolute top-full right-0 mt-1 p-2 bg-white flex flex-col gap-1 z-[60] w-24 shadow-[0_4px_30px_0_rgba(0,98,255,0.15)] rounded-md max-h-48 overflow-y-auto">
                    {years.map((year) => (
                      <div
                        key={year}
                        className={`cursor-pointer p-2 hover:bg-blue-50 rounded text-xs ${currentYear === year ? "bg-blue-600 text-white" : "text-gray-700"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentYear(year);
                          setShowYearDropdown(false);
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 rounded-[5px] text-center text-sm">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="font-medium text-gray-400 py-1 text-[11px] uppercase"
                >
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>
          {/* Footer Buttons */}
          <div className="flex justify-between mt-5 pt-4 border-t border-gray-100">
            <button
              className="px-4 py-2 text-xs font-bold text-[#0062FF] hover:bg-blue-50 rounded-md transition-colors"
              onClick={() => setShowCalendar(false)}
            >
              CANCEL
            </button>
            <button
              className="px-4 py-2 text-xs font-bold bg-[#0062FF] text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setShowCalendar(false)}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const DashboardDatePicker = DatePicker;
export default DatePicker;
