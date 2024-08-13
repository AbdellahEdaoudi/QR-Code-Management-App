import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Header() {
  return (
    <header className='bg-white shadow-lg md:py-0 sm:py-1 py-3'>
      <div className='container mx-auto flex items-center justify-between px-4 md:px-0'>
        {/* Logo Section */}
        <Link href={"/"} className='flex items-center p-2'>
          <Image 
            src={"/Logo/ed_Qrcode_img.png"} 
            alt="Logo"
            className='hover:scale-105 duration-300'
            width={150} 
            height={50} 
          />
        </Link>
        
        {/* Navigation Links */}
        <nav className='flex items-center space-x-4'>
          <Link href={"/ReadQrCode"} className='text-white bg-lime-500 py-2 px-4 rounded-md hover:bg-lime-400 transition duration-300'>
            Read QRCode
          </Link>
          <Link href={"/ScanQrCode"} className='text-white bg-emerald-500 py-2 px-4 rounded-md hover:bg-emerald-400 transition duration-300'>
            Scan QrCode
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
