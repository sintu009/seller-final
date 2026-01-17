"use client";

import Flatpickr from "react-flatpickr";
import { CalendarRangeIcon } from "lucide-react";
import "flatpickr/dist/themes/material_blue.css";

const DatePicker = ({
    value,
    onChange,
    placeholder = "Select date range",
    className = "",
}) => {
    return (
        <div className="relative w-full">
            {/* Calendar Icon */}
            <CalendarRangeIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            {/* Flatpickr Input */}
            <Flatpickr
                value={value}
                onChange={onChange}
                options={{
                    mode: "range",
                    dateFormat: "Y-m-d",
                }}
                placeholder={placeholder}
                className={`
          h-11 w-full
          rounded-lg
          border border-gray-300
          bg-white
          pl-10 pr-4
          text-sm text-gray-700
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition
          ${className}
        `}
            />
        </div>
    );
};

export default DatePicker;
