"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { MyContext } from '../Context/Mycontext';

function Header() {
  const { t, language, changeLanguage } = useContext(MyContext);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLang = params.lang || 'en';

  useEffect(() => {
    if (params.lang && params.lang !== language) {
      changeLanguage(params.lang);
    }
  }, [params.lang]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    changeLanguage(newLang);

    // Replace language segment in URL
    const segments = pathname.split('/');
    // segments[0] is "" (leading slash), segments[1] is lang
    if (segments.length > 1) {
      segments[1] = newLang;
      const newPath = segments.join('/');
      router.push(newPath);
    } else {
      router.push(`/${newLang}`);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'Arabic' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ru', name: 'Русский' },
    { code: 'pt', name: 'Português' },
    { code: 'ja', name: '日本語' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'zh', name: '中文' },
  ];

  return (
    <header className='bg-white shadow-lg md:py-0 sm:py-1 py-3'>
      <div className='container mx-auto flex flex-wrap items-center justify-between px-4 md:px-0'>
        {/* Logo Section */}
        <Link href={`/${currentLang}`} className='flex items-center p-2'>
          <Image
            src={"/Logo/ed_Qrcode_img.png"}
            alt="Logo"
            className='hover:scale-105 duration-300'
            width={150}
            height={50}
          />
        </Link>

        {/* Right Section: Nav Links + Language Switcher */}
        <div className='flex items-center gap-4'>
          {/* Navigation Links */}
          <nav className='flex items-center gap-2'>
            <Link href={`/${currentLang}/ReadQrCode`} className='text-white bg-lime-500 py-2 px-2 md:px-4 text-sm md:text-base rounded-md hover:bg-lime-400 transition duration-300 whitespace-nowrap'>
              {t('header.readQr')}
            </Link>
            <Link href={`/${currentLang}/ScanQrCode`} className='text-white bg-emerald-500 py-2 px-2 md:px-4 text-sm md:text-base rounded-md hover:bg-emerald-400 transition duration-300 whitespace-nowrap'>
              {t('header.scanQr')}
            </Link>
          </nav>

          {/* Language Switcher */}
          <select
            value={currentLang}
            onChange={handleLanguageChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;
