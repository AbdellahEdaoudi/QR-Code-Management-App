"use client";
import React, { useState } from 'react';
import jsQR from 'jsqr';
import { Copy } from 'lucide-react';
import { toast } from 'react-toastify';
export default function ReadQrCode() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrCodeData, setQrCodeData] = useState('');

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
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

    return code ? code.data : 'No QR code found';
  };


const copyToClipboard = async () => {
  if (qrCodeData) {
    try {
      await navigator.clipboard.writeText(qrCodeData);
      toast.success('Copied successfully!');
    } catch (err) {
      toast.error('Failed to copy text!');
      console.error('Failed to copy text: ', err);
    }
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 py-4 px-6 md:px-16">
      <div className="flex md:flex-row flex-col bg-white p-6 rounded-lg border border-gray-200 shadow-md">
        {/* Section for Upload and Image Preview */}
        <nav className="md:w-1/2 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Read QR Code</h1>
          <div className='flex justify-center'>
            <label htmlFor="file-upload" className=" w-72 text-center bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg cursor-pointer hover:bg-purple-700 transition-colors duration-300">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span>Choose Image</span>
            </label>
          </div>
          <div className="flex flex-col items-center mt-6">
            <p className="text-gray-700 mb-2">Selected Image:</p>
            <img
              src={selectedImage || '/Qrcode/Qrcode.png'}
              alt="Selected"
              className="w-48 h-48 object-cover rounded-md shadow-lg"
            />
          </div>
        </nav>
        {/* Section for Displaying QR Code Data */}
        <nav className="md:w-1/2 flex flex-col items-center justify-center">
          {qrCodeData && (
            <div className="bg-gray-200 p-6 rounded-lg text-center shadow-md w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Code Data:</h2>
              <p className="text-indigo-600 break-words flex items-center justify-between">
                {qrCodeData}
                <span
                  className='text-gray-600 cursor-pointer hover'
                  onClick={copyToClipboard}
                >
                  <Copy />
                </span>
              </p>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
