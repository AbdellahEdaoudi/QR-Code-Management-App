"use client";
import React, { useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { toast } from 'react-toastify';

export default function ScanQrCode() {
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0); // تتبع عدد المحاولات
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const getDevices = async () => {
      try {
        const devices = await codeReader.listVideoInputDevices();
        setVideoDevices(devices);
        if (devices.length > 0) {
          setSelectedDeviceId(devices[0].deviceId);
        }
      } catch (error) {
        console.error('Error listing video input devices:', error);
      }
    };

    getDevices();

    return () => {
      codeReader.reset();
    };
  }, []);

  useEffect(() => {
    if (!selectedDeviceId) return;

    const codeReader = new BrowserMultiFormatReader();

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

    return () => {
      codeReader.reset();
    };
  }, [selectedDeviceId]);

  const switchCamera = () => {
    const currentIndex = videoDevices.findIndex(device => device.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    setSelectedDeviceId(videoDevices[nextIndex].deviceId);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 py-4 px-6 md:px-16">
      <div className="flex md:flex-row flex-col md:space-x-10 bg-white p-6 rounded-lg border border-gray-200 shadow-md">
        <nav className="md:w-1/2 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Scan QR Code</h1>
          <div className="flex justify-center">
            <video
              id="video"
              width="100%"
              style={{ transform: 'scaleX(-1)' }} // عكس الفيديو أفقيًا
            />
          </div>
          <button 
            onClick={switchCamera} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Switch Camera
          </button>
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
