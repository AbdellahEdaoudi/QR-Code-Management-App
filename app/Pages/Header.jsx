"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { QrCode, Scan, FileSearch, Globe, Menu, X, Sparkles } from '../components/Icons';
import CustomSelect from '../components/CustomSelect';
import ThemeToggle from '../components/ThemeToggle';

function Header({ content, lang }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = lang || 'en';
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleLanguageChange = (newLang) => {
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = newLang;
      const newPath = segments.join('/');
      router.push(newPath);
    } else {
      router.push(`/${newLang}`);
    }
  };

  const getFlag = (countryCode) => (
    <img src={`https://flagcdn.com/w20/${countryCode}.png`} srcSet={`https://flagcdn.com/w40/${countryCode}.png 2x`} width="20" alt="flag" className="rounded-sm" />
  );

  const languages = [
    { code: 'en', name: 'English', flag: getFlag('gb') },
    { code: 'ar', name: 'العربية', flag: getFlag('sa') },
    { code: 'fr', name: 'Français', flag: getFlag('fr') },
    { code: 'es', name: 'Español', flag: getFlag('es') },
    { code: 'de', name: 'Deutsch', flag: getFlag('de') },
    { code: 'ru', name: 'Русский', flag: getFlag('ru') },
  ];

  const isGenerateActive = pathname === `/${currentLang}` || pathname === `/${currentLang}/`;
  const isReadActive = pathname.includes('/ReadQrCode');
  const isScanActive = pathname.includes('/ScanQrCode');

  return (
    <header className="w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/80 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo Section */}
          <Link
            href={`/`}
            className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 shadow-lg shadow-purple-500/25 p-2 border border-purple-400/30 group-hover:shadow-purple-500/40 transition-shadow">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors">
                  EdQr<span className="text-purple-400">Code</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                {content?.qrStudio || 'QR Studio & Scanner'}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
            <Link
              href={`/${currentLang}`}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isGenerateActive
                  ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{content?.generateQr || 'Generate QR'}</span>
            </Link>

            <Link
              href={`/${currentLang}/ReadQrCode`}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isReadActive
                  ? 'bg-linear-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>{content?.readQr || 'Read QR'}</span>
            </Link>

            <Link
              href={`/${currentLang}/ScanQrCode`}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isScanActive
                  ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <Scan className="w-4 h-4" />
              <span>{content?.scanQr || 'Scan QR'}</span>
            </Link>
          </nav>

          {/* Right Section: Theme Toggle, Language Switcher & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Selector */}
            <div className="relative flex items-center">
              <CustomSelect
                value={currentLang}
                onChange={handleLanguageChange}
                options={languages.map(lang => ({
                  value: lang.code,
                  label: lang.name,
                  flag: lang.flag
                }))}
                icon={Globe}
                buttonClassName="border-slate-700/80"
              />
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-2 space-y-2 border-t border-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href={`/${currentLang}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${isGenerateActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80'
                }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>{content?.generateQr || 'Generate QR'}</span>
            </Link>

            <Link
              href={`/${currentLang}/ReadQrCode`}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${isReadActive
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80'
                }`}
            >
              <FileSearch className="w-5 h-5" />
              <span>{content?.readQr || 'Read QR'}</span>
            </Link>

            <Link
              href={`/${currentLang}/ScanQrCode`}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition ${isScanActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80'
                }`}
            >
              <Scan className="w-5 h-5" />
              <span>{content?.scanQr || 'Scan QR'}</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
