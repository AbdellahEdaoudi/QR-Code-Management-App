"use client";
import { useState, useRef } from 'react';
import QRCode from 'qrcode.react';




export default function LinkToQrcode() {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [logo, setLogo] = useState('');
  const [logoFile, setLogoFile] = useState(null); // New state for uploaded logo
  const qrCodeRef = useRef(null);
  const fileInputRef = useRef(null); // Ref for the file input

  const icons = [
    { src: '/Icons/fb.svg', alt: 'Facebook' },
    { src: '/Icons/github.svg', alt: 'GitHub' },
    { src: '/Icons/ins.svg', alt: 'Instagram' },
    { src: '/Icons/link.svg', alt: 'Link' },
    { src: '/Icons/messenger.svg', alt: 'Messenger' },
    { src: '/Icons/reddit.svg', alt: 'Reddit' },
    { src: '/Icons/snap.svg', alt: 'Snapchat' },
    { src: '/Icons/tele.svg', alt: 'Telegram' },
    { src: '/Icons/tik.svg', alt: 'TikTok' },
    { src: '/Icons/twit.svg', alt: 'Twitter' },
    { src: '/Icons/twitch.svg', alt: 'Twitch' },
    { src: '/Icons/wts.svg', alt: 'WhatsApp' },
    { src: '/Icons/yt.svg', alt: 'YouTube' },
  ];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(URL.createObjectURL(file));
      setLogo(URL.createObjectURL(file));
    }
  };

  const GenerateQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${filename}.png`;
        link.click();
      }
    }
  };

  const shareQRCode = () => {
    if (navigator.share && qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector('canvas');
      if (canvas) {
        canvas.toBlob((blob) => {
          const file = new File([blob], `${filename || 'qrcode'}.png`, { type: 'image/png' });
          navigator.share({
            files: [file],
            title: 'QR Code',
            text: 'Check out this QR Code!',
          }).catch((error) => console.error('Sharing failed', error));
        });
      }
    } else {
      alert("Your browser doesn't support the Web Share API.");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 py-4 px-6 md:px-16">
      <div className="flex md:flex-row flex-col bg-white p-4 rounded-lg border px-6 md:px-16 border-gray-200 shadow-md py-16">
        {/* nav Inputs and Logos */}
        <nav className="md:w-1/2">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Link To  QRCode</h1>
          <div className="mb-4">
            <input
              type="url"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Upload or Choose a Logo</h2>
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300"
            >
              Upload Logo
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              ref={fileInputRef}
            />
            <div className="flex flex-wrap gap-3 justify-center mb-6 mt-4">
              {icons.map((icon, i) => (
                <img
                  key={i}
                  src={icon.src}
                  alt={icon.alt}
                  className={`w-10 h-10 cursor-pointer transition-transform duration-300 ${logo === icon.src ? 'border-2 border-purple-500 rounded-lg transform scale-110' : ''}`}
                  onClick={() => setLogo(icon.src)}
                />
              ))}
              <button
                onClick={() => {
                  setLogo('');
                  setLogoFile(null); // Reset logo file when clicking 'X'
                }}
                className={`w-10 h-10 flex items-center justify-center border-2 rounded-full transition-colors duration-300 ${logo === '' && !logoFile ? 'border-purple-500 bg-purple-100' : 'border-gray-300'}`}
              >
                <span className="text-gray-600">X</span>
              </button>
            </div>
          </div>
        </nav>
        {/* QRcode and Download/Share Qrcode */}
        <nav className="md:w-1/2">
          <div className="flex flex-col items-center">
            <div className={`mb-6 hidden`} ref={qrCodeRef}>
              <QRCode
                value={url}
                size={500}
                bgColor="#ffffff"
                fgColor="#000000"
                renderAs="canvas"
                includeMargin={true}
                level="H"
                imageSettings={logo || logoFile ? {
                  src: logo || logoFile,
                  x: undefined,
                  y: undefined,
                  height: 80,
                  width: 80,
                  excavate: true,
                } : {}}
              />
            </div>
            <div className={`mb-6`}>
              <QRCode
                value={url}
                size={250}
                bgColor="#ffffff"
                fgColor="#000000"
                renderAs="canvas"
                includeMargin={true}
                level="H"
                imageSettings={logo || logoFile ? {
                  src: logo || logoFile,
                  x: undefined,
                  y: undefined,
                  height: 60,
                  width: 60,
                  excavate: true,
                } : {}}
              />
            </div>
            <button
              onClick={GenerateQRCode}
              className="w-72 py-3 px-6 mb-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors duration-300"
            >
              Download QR Code
            </button>
            <button
              onClick={shareQRCode}
              className="w-72 py-3 px-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Share QR Code
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
