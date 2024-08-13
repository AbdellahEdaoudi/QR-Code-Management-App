"use client";
import React, { useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { toast } from 'react-toastify';


  

export default function ScanQrCode() {
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0); // تتبع عدد المحاولات

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader.listVideoInputDevices().then((devices) => {
      if (devices.length > 0) {
        const selectedDeviceId = devices[0].deviceId;
        codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, error) => {
          
          if (result) {
            setScanResult(result.text);
            toast.success('QR Code scanned successfully!');
            setAttemptCount(0);
          }
          if (error) {
            setError('Failed to scan QR Code!');
            console.error(error);
            setAttemptCount(prevCount => prevCount + 1); // تحديث عدد المحاولات
          }
        });
      }
    });

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 py-4 px-6 md:px-16">
      <div className="flex md:flex-row flex-col md:space-x-10 bg-white p-6 rounded-lg border border-gray-200 shadow-md">
        <nav className="md:w-1/2 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Scan QR Code</h1>
          <div className="flex justify-center">
            <video id="video" width="100%" />
          </div>
        </nav>
        {/* Section for Displaying QR Code Data */}
        <nav className="md:w-1/2 flex flex-col items-center justify-center">
            <div className="bg-gray-200 p-6 rounded-lg text-center shadow-md w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Code Data:</h2>
              <p className="text-indigo-600 break-words">{scanResult}</p>
              <p className="text-red-600 break-words">
                {error} 
                {/* {attemptCount > 0 && ` - Attempt #${attemptCount}`} */}
              </p>
            </div>
        </nav>
      </div>
    </div>
  );
}
