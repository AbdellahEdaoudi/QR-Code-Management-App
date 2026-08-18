"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  icon: Icon,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-purple-500/50 rounded-xl text-slate-200 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer select-none ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
          {selectedOption?.flag && <span className="text-sm">{selectedOption.flag}</span>}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-purple-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-1.5 w-48 sm:w-56 max-h-64 overflow-y-auto rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 scrollbar-thin ${dropdownClassName}`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left rtl:text-right ${
                  isSelected
                    ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md shadow-purple-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.flag && <span className="text-sm">{opt.flag}</span>}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
