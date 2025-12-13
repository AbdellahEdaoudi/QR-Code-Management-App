"use client";
import React, { useState, useEffect, useRef, useContext } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { SwitchCamera, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { MyContext } from '../Context/Mycontext';

export default function ScanQrCode() {
  const { t, language } = useContext(MyContext);
  const [scanResult, setScanResult] = useState('');
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    document.title = `${t('scanQr.title')} | EdQrCode`;
  }, [language, t]);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    const getDevices = async () => {
      try {
        const devices = await codeReaderRef.current.listVideoInputDevices();
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
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const codeReader = codeReaderRef.current;

    // Use selectedDeviceId if available, otherwise undefined (browser default)
    const deviceIdToUse = selectedDeviceId || undefined;

    codeReader.decodeFromVideoDevice(deviceIdToUse, videoRef.current, (result, error) => {
      if (result) {
        // Only update if the result is different
        setScanResult(prev => {
          if (prev !== result.text) {
            return result.text;
          }
          return prev;
        });
      }
    });

    return () => {
      codeReader.reset();
    };
  }, [selectedDeviceId]);

  const switchCamera = () => {
    if (videoDevices.length > 0) {
      const currentIndex = videoDevices.findIndex(device => device.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % videoDevices.length;
      setSelectedDeviceId(videoDevices[nextIndex].deviceId);
    }
  };

  const copyToClipboard = async () => {
    if (scanResult) {
      try {
        await navigator.clipboard.writeText(scanResult);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const parseWifiString = (wifiString) => {
    const ssidMatch = wifiString.match(/S:([^;]+)/);
    const passwordMatch = wifiString.match(/P:([^;]+)/);
    const typeMatch = wifiString.match(/T:([^;]+)/);
    const hiddenMatch = wifiString.match(/H:([^;]+)/);

    return {
      ssid: ssidMatch ? ssidMatch[1] : 'Unknown',
      password: passwordMatch ? passwordMatch[1] : '',
      type: typeMatch ? typeMatch[1] : 'WPA',
      hidden: hiddenMatch ? hiddenMatch[1] === 'true' : false,
    };
  };

  const renderScanResult = () => {
    if (!scanResult) return <p className="text-gray-500 italic min-h-[3rem] flex items-center justify-center">{t('scanQr.scanning')}</p>;

    if (scanResult.startsWith('WIFI:')) {
      const { ssid, password, type } = parseWifiString(scanResult);
      return (
        <div className="bg-white p-4 rounded border border-gray-200 text-left space-y-2">
          <div className="font-semibold text-lg border-b pb-2 mb-2 flex items-center gap-2">
            <span className="text-blue-600">{t('scanQr.wifiDetected')}</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
            <span className="font-medium text-gray-500">{t('scanQr.ssid')}:</span>
            <span className="font-medium text-gray-800">{ssid}</span>

            <span className="font-medium text-gray-500">{t('scanQr.password')}:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800 break-all">{password}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(password);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className="text-gray-400 hover:text-green-600 transition-colors"
                title={t('scanQr.copy')}
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <span className="font-medium text-gray-500">{t('scanQr.security')}:</span>
            <span className="text-gray-800">{type}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="bg-white p-3 rounded border border-gray-200 break-words text-indigo-600 min-h-[3rem] flex items-center justify-center">
          {scanResult.startsWith('http') ? (
            <Link href={scanResult} target="_blank" rel="noopener noreferrer" className='hover:underline'>
              {scanResult}
            </Link>
          ) : (
            <span className='text-gray-800'>{scanResult}</span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className={`mt-2 flex items-center justify-center gap-2 transition-colors py-2 px-4 rounded ${isCopied ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}
        >
          {isCopied ? <Check size={18} /> : <Copy size={18} />}
          <span>{isCopied ? t('scanQr.copied') : t('scanQr.copy')}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 py-4 px-6 md:px-16">
      <div className="flex md:flex-row pb-24 flex-col md:space-x-10 bg-white p-6 rounded-lg border border-gray-200 shadow-md">
        <section className="md:w-1/2 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{t('scanQr.title')}</h1>
          <div className="flex justify-center relative min-h-[300px]">
            {isVideoLoading && (
              <div className="absolute inset-0 w-[90%] mx-auto bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                <span className="text-gray-400 font-medium">{t('scanQr.loading')}</span>
              </div>
            )}
            <video
              ref={videoRef}
              className={`w-[90%] rounded-lg shadow-sm transition-opacity duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
              style={{ transform: 'scaleX(-1)' }}
              onCanPlay={() => setIsVideoLoading(false)}
            />
          </div>
          <div className='flex justify-center'>
            {videoDevices.length > 1 && (
              <button
                onClick={switchCamera}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <SwitchCamera /> {t('scanQr.switchCamera')}
              </button>
            )}
          </div>
        </section>
        {/* Section for Displaying QR Code Data */}
        <section className="md:w-1/2 flex flex-col items-center justify-center">
          <div className="bg-gray-200 p-6 rounded-lg text-center shadow-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('readQr.qrData')}</h2>
            {renderScanResult()}
          </div>
        </section>
      </div>
    </div>
  );
}
