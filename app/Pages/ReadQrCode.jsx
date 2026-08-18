"use client";
import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import {
  FileSearch,
  UploadCloud,
  Copy,
  Check,
  ExternalLink,
  Wifi,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Clipboard,
} from 'lucide-react';
import { useToast } from '../components/toast'

export default function ReadQrCode({ lang, content }) {
  const currentLang = lang || 'en';
  const toast = useToast();

  const [selectedImage, setSelectedImage] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);



  // Global Clipboard Paste (Ctrl+V) listener
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            processFile(blob);
            toast.success(content?.pastedImage || 'Pasted image from clipboard!');
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [content]);

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setIsProcessing(true);
    const objectUrl = URL.createObjectURL(file);
    setSelectedImage(objectUrl);

    try {
      const img = await loadImage(objectUrl);
      const decoded = readQrCodeFromImage(img);
      if (decoded) {
        setQrCodeData(decoded);
        toast.success(content?.qrDecoded || 'QR Code decoded!');
      } else {
        setQrCodeData('NOT_FOUND');
        toast.warning(content?.noQrFound || 'No valid QR code was detected in this image.');
      }
    } catch (err) {
      console.error(err);
      setQrCodeData('NOT_FOUND');
      toast.error('Failed to process image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  };

  const readQrCodeFromImage = (image) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });

    return code ? code.data : null;
  };

  const copyToClipboard = async (textToCopy) => {
    const val = textToCopy || qrCodeData;
    if (val && val !== 'NOT_FOUND') {
      try {
        await navigator.clipboard.writeText(val);
        setIsCopied(true);
        toast.success(content?.copied || 'Copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        toast.error('Failed to copy text.');
      }
    }
  };

  const parseWifiString = (wifiString) => {
    const ssidMatch = wifiString.match(/S:([^;]+)/);
    const passwordMatch = wifiString.match(/P:([^;]+)/);
    const typeMatch = wifiString.match(/T:([^;]+)/);
    const hiddenMatch = wifiString.match(/H:([^;]+)/);

    return {
      ssid: ssidMatch ? ssidMatch[1] : 'Unknown SSID',
      password: passwordMatch ? passwordMatch[1] : '',
      type: typeMatch ? typeMatch[1] : 'WPA',
      hidden: hiddenMatch ? hiddenMatch[1] === 'true' : false,
    };
  };

  const loadSampleQr = () => {
    processFileFromUrl('/Qrcode/Qrcode.png');
  };

  const processFileFromUrl = async (url) => {
    setIsProcessing(true);
    setSelectedImage(url);
    try {
      const img = await loadImage(url);
      const decoded = readQrCodeFromImage(img);
      if (decoded) {
        setQrCodeData(decoded);
        toast.success('Sample QR decoded!');
      } else {
        setQrCodeData('NOT_FOUND');
      }
    } catch (e) {
      setQrCodeData('NOT_FOUND');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">


      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload / Drop Zone (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              {content?.uploadBoxTitle || 'Upload QR Image'}
            </h2>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-65 ${isDragging
                  ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                  : 'border-slate-700 bg-slate-900/50 hover:border-cyan-500/60 hover:bg-slate-900/80'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
                  <p className="text-sm font-semibold text-slate-200">Decoding QR pattern...</p>
                </div>
              ) : selectedImage ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-36 h-36 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-2 shadow-inner">
                    <img
                      src={selectedImage}
                      alt="Uploaded preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-cyan-400 font-medium">Click or drop another image to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">
                      {content?.dragDropPrompt || 'Drag & Drop your QR image here'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {content?.browsePrompt || 'or click to browse files (PNG, JPG, WEBP)'}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] text-slate-300 border border-slate-700 mt-2">
                    <Clipboard className="w-3.5 h-3.5 text-purple-400" />
                    <span>{content?.ctrlVPaste || 'Tip: Press Ctrl+V to paste screenshot directly'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-md shadow-cyan-600/20"
              >
                {content?.browseFiles || 'Browse Files'}
              </button>

              <button
                onClick={loadSampleQr}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{content?.sampleImage || 'Try Sample Image'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Decoded Result Card (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 min-h-95 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {content?.qrData || 'Decoded Content'}
              </h2>
              {qrCodeData && qrCodeData !== 'NOT_FOUND' && (
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Decoded
                </span>
              )}
            </div>

            {/* Content Display */}
            <div className="flex-1 flex flex-col justify-center">
              {!qrCodeData ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-500">
                    <FileSearch className="w-6 h-6" />
                  </div>
                  <p className="text-slate-400 text-sm">
                    {content?.uploadPrompt || 'Upload or paste an image to extract its data here.'}
                  </p>
                </div>
              ) : qrCodeData === 'NOT_FOUND' ? (
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-3">
                  <div className="flex items-center gap-2.5 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>{content?.noQrFound || 'No QR Code Detected'}</span>
                  </div>
                  <p className="text-xs text-rose-200/80 leading-relaxed">
                    {content?.noQrFoundTips || 'Make sure the QR code is clearly visible, well-lit, not overly blurred or cropped.'}
                  </p>
                </div>
              ) : qrCodeData.startsWith('WIFI:') ? (
                // WiFi detection card
                (() => {
                  const wifiInfo = parseWifiString(qrCodeData);
                  return (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm pb-2 border-b border-slate-800">
                          <Wifi className="w-4 h-4" />
                          <span>{content?.wifiFound || 'WiFi Network Found'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <span className="text-slate-400 font-medium">{content?.ssid || 'SSID'}:</span>
                          <span className="col-span-2 text-white font-mono font-bold">{wifiInfo.ssid}</span>

                          <span className="text-slate-400 font-medium">{content?.password || 'Password'}:</span>
                          <div className="col-span-2 flex items-center gap-2">
                            <span className="font-mono bg-slate-950 px-2 py-1 rounded text-purple-300 break-all border border-slate-800">
                              {wifiInfo.password || '(No Password)'}
                            </span>
                            {wifiInfo.password && (
                              <button
                                onClick={() => copyToClipboard(wifiInfo.password)}
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                                title="Copy Password"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <span className="text-slate-400 font-medium">{content?.security || 'Security'}:</span>
                          <span className="col-span-2 text-slate-300">{wifiInfo.type}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(qrCodeData)}
                          className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white transition flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20"
                        >
                          <Copy className="w-4 h-4" />
                          <span>{content?.copyRawWifi || 'Copy Raw WiFi Code'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                // Standard URL or Text card
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                      <span>{content?.qrData || 'Decoded Content'}</span>
                      <span>{qrCodeData.length} chars</span>
                    </div>
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 break-all text-sm font-mono text-cyan-300 max-h-56 overflow-y-auto">
                      {qrCodeData}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {qrCodeData.startsWith('http') && (
                      <a
                        href={qrCodeData}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{content?.openLink || 'Open Link'}</span>
                      </a>
                    )}

                    <button
                      onClick={() => copyToClipboard(qrCodeData)}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-2 ${isCopied
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                        }`}
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{isCopied ? (content?.copied || 'Copied!') : (content?.copy || 'Copy to Clipboard')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
