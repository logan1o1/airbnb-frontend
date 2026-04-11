import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  min?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  min,
  placeholder = "DD/MM/YYYY",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => 
    value ? dayjs(value).format("DD/MM/YYYY") : ""
  );
  const [pickerDate, setPickerDate] = useState(() => 
    value ? dayjs(value) : dayjs()
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputClick = () => {
    if (!disabled) setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const parsed = dayjs(inputVal, "DD/MM/YYYY", true);
    
    if (parsed.isValid()) {
      const isoDate = parsed.format("YYYY-MM-DD");
      onChange(isoDate);
      setDisplayValue(inputVal);
    } else {
      setDisplayValue(inputVal);
    }
  };

  const handleDayClick = (day: number) => {
    const newDate = pickerDate.date(day);
    const isoDate = newDate.format("YYYY-MM-DD");
    onChange(isoDate);
    setDisplayValue(newDate.format("DD/MM/YYYY"));
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setPickerDate(pickerDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setPickerDate(pickerDate.add(1, "month"));
  };

  const getDaysInMonth = () => {
    const daysInMonth = pickerDate.daysInMonth();
    const startDay = pickerDate.startOf("month").day();
    const days: (number | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const isDayDisabled = (day: number) => {
    const date = pickerDate.date(day);
    const today = dayjs();
    const minDate = min ? dayjs(min) : null;

    if (date.isBefore(today, "day")) return true;
    if (minDate && date.isBefore(minDate, "day")) return true;
    return false;
  };

  const today = dayjs();

  if (!isOpen) {
    return (
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onClick={handleInputClick}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={displayValue}
        onClick={handleInputClick}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-72">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-semibold text-gray-900">
            {pickerDate.format("MMMM YYYY")}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="p-1" />;
            }
            const disabled = isDayDisabled(day);
            const isToday = pickerDate.date(day).isSame(today, "day");
            const isSelected = value && pickerDate.date(day).isSame(dayjs(value), "day");

            return (
              <button
                key={day}
                type="button"
                onClick={() => !disabled && handleDayClick(day)}
                disabled={disabled}
                className={`
                  p-1 text-sm rounded
                  ${disabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer text-gray-900"}
                  ${isToday ? "border border-blue-500" : ""}
                  ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};