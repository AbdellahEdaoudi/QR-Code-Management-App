"use client";
import React, { useState, useContext, useEffect } from 'react';
import jsQR from 'jsqr';
import { Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { MyContext } from '../Context/Mycontext';

export default function ReadQrCode() {
  const { t, language } = useContext(MyContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrCodeData, setQrCodeData] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    document.title = `${t('readQr.title')} | EdQrCode`;
  }, [language, t]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));

    const img = await loadImage(URL.createObjectURL(file));
    const qrCodeText = readQrCodeFromImage(img);
    setQrCodeData(qrCodeText);
  };

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  };

  const readQrCodeFromImage = (image) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    return code ? code.data : null;
  };

  const copyToClipboard = async () => {
    if (qrCodeData) {
      try {
        await navigator.clipboard.writeText(qrCodeData);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        toast.error('Failed to copy text!');
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 py-4 px-6 md:px-16 min-h-screen flex items-center justify-center">
      <div className="flex md:flex-row flex-col bg-white p-6 rounded-lg border border-gray-200 shadow-md w-full max-w-4xl">
        {/* Section for Upload and Image Preview */}
        <section className="md:w-1/2 mb-4 md:mb-0 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{t('readQr.title')}</h1>
          <div className='flex justify-center w-full'>
            <label htmlFor="file-upload" className="w-72 text-center bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg cursor-pointer hover:bg-purple-700 transition-colors duration-300">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span>{t('readQr.chooseImage')}</span>
            </label>
          </div>
          <div className="flex flex-col items-center mt-6">
            <p className="text-gray-700 mb-2 font-medium">{t('readQr.selectedImage')}:</p>
            <img
              src={selectedImage || '/Qrcode/Qrcode.png'}
              alt="Selected"
              className="w-48 h-48 object-contain rounded-md shadow-lg border border-gray-100"
            />
          </div>
        </section>

        {/* Section for Displaying QR Code Data */}
        <section className="md:w-1/2 flex flex-col items-center justify-center p-4">
          {qrCodeData === null ? (
            <div className="text-center text-red-500 font-semibold bg-red-50 p-4 rounded-lg w-full">
              {t('readQr.noQrFound')}
            </div>
          ) : qrCodeData ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center shadow-inner w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('readQr.qrData')}:</h2>
              <div className="flex flex-col gap-2">
                <div className="bg-white p-3 rounded border border-gray-200 break-words text-indigo-600">
                  {qrCodeData.startsWith('http') ? (
                    <Link href={qrCodeData} target="_blank" rel="noopener noreferrer" className='hover:underline'>
                      {qrCodeData}
                    </Link>
                  ) : (
                    <span className='text-gray-800'>{qrCodeData}</span>
                  )}
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`mt-2 flex items-center justify-center gap-2 transition-colors py-2 px-4 rounded ${isCopied ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}
                >
                  {isCopied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{isCopied ? t('readQr.copied') : t('readQr.copy')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center italic">
              {t('readQr.uploadPrompt')}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
