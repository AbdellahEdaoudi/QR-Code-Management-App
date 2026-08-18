"use client";
import React, { useState, useEffect, useRef, useContext } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import {
  Scan,
  SwitchCamera,
  Copy,
  Check,
  ExternalLink,
  Wifi,
  Camera,
  CameraOff,
  RefreshCw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { getTranslation } from '../translations/content/index';
import { useToast } from '../components/toast';

export default function ScanQrCode({ lang, content }) {
  const currentLang = lang || 'en';
  const toast = useToast();
  const [scanResult, setScanResult] = useState('');
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);



  // Audio feedback synthesizer
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // restricted AudioContext
    }
  };

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    const getDevices = async () => {
      try {
        const devices = await codeReaderRef.current.listVideoInputDevices();
        setVideoDevices(devices);
        if (devices.length > 0) {
          const backCamera = devices.find((device) =>
            /back|rear|environment/i.test(device.label)
          );
          setSelectedDeviceId(backCamera ? backCamera.deviceId : devices[0].deviceId);
          setHasCameraPermission(true);
        }
      } catch (error) {
        console.error('Error listing video input devices:', error);
        setHasCameraPermission(false);
        toast.error(content?.cameraDenied || 'Camera access denied or no camera device found.');
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
    if (!videoRef.current || !codeReaderRef.current) return;

    setIsVideoLoading(true);
    const codeReader = codeReaderRef.current;
    const deviceIdToUse = selectedDeviceId || undefined;

    codeReader.decodeFromVideoDevice(deviceIdToUse, videoRef.current, (result, error) => {
      if (result && result.text) {
        setScanResult((prev) => {
          if (prev !== result.text) {
            playBeep();
            toast.success(content?.copied ? 'QR Code scanned!' : 'QR Code scanned!');
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
    if (videoDevices.length > 1) {
      const currentIndex = videoDevices.findIndex((device) => device.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % videoDevices.length;
      setSelectedDeviceId(videoDevices[nextIndex].deviceId);
      toast.info(`Switched to: ${videoDevices[nextIndex].label || `Camera ${nextIndex + 1}`}`);
    }
  };

  const copyToClipboard = async (textToCopy) => {
    const val = textToCopy || scanResult;
    if (val) {
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

  const resetScan = () => {
    setScanResult('');
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">


      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Camera Viewfinder (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                {content?.viewfinderTitle || 'Camera Viewfinder'}
              </h2>

              <div className="flex items-center gap-2">
                {/* Audio Toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Mute Beep' : 'Unmute Beep'}
                  className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Switch Camera */}
                {videoDevices.length > 1 && (
                  <button
                    onClick={switchCamera}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
                  >
                    <SwitchCamera className="w-4 h-4 text-emerald-400" />
                    <span>{content?.switchCamera || 'Flip Camera'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Viewfinder Video Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square sm:aspect-4/3 flex items-center justify-center shadow-inner group">
              {!hasCameraPermission ? (
                <div className="text-center p-8 space-y-3">
                  <CameraOff className="w-12 h-12 text-rose-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-200">
                    {content?.cameraDenied || 'Camera Access Denied'}
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    {content?.cameraDeniedHelp || 'Please allow camera permissions in your browser address bar to use live scanning.'}
                  </p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'
                      }`}
                    onCanPlay={() => setIsVideoLoading(false)}
                    playsInline
                    muted
                  />

                  {/* Loading Spinner */}
                  {isVideoLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 gap-3">
                      <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                      <span className="text-xs font-semibold text-slate-300">{content?.loading || 'Starting camera stream...'}</span>
                    </div>
                  )}

                  {/* Scanner Overlay UI */}
                  {!isVideoLoading && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      {/* Aiming Reticle Box */}
                      <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                        {/* Corner markers */}
                        <div className="scanner-corner scanner-corner-tl border-emerald-400" />
                        <div className="scanner-corner scanner-corner-tr border-emerald-400" />
                        <div className="scanner-corner scanner-corner-bl border-emerald-400" />
                        <div className="scanner-corner scanner-corner-br border-emerald-400" />

                        {/* Animated Laser Line */}
                        <div className="absolute left-2 right-2 h-0.5 bg-linear-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-laser" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Camera Selector Dropdown (if multiple) */}
            {videoDevices.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                  {content?.switchCamera || 'Camera'}:
                </label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="w-full p-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-200 text-xs focus:outline-none cursor-pointer truncate"
                >
                  {videoDevices.map((device, idx) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Detection Results (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 min-h-95 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {content?.scanResult || 'Scan Result'}
              </h2>
              {scanResult && (
                <button
                  onClick={resetScan}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{content?.scanNext || 'Scan Next'}</span>
                </button>
              )}
            </div>

            {/* Results Body */}
            <div className="flex-1 flex flex-col justify-center">
              {!scanResult ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
                    <Scan className="w-6 h-6 animate-pulse" />
                  </div>
                  <p className="text-slate-400 text-sm">
                    {content?.scanning || 'Align a QR code inside the camera viewfinder to scan automatically.'}
                  </p>
                </div>
              ) : scanResult.startsWith('WIFI:') ? (
                // WiFi Result
                (() => {
                  const wifiInfo = parseWifiString(scanResult);
                  return (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm pb-2 border-b border-slate-800">
                          <Wifi className="w-4 h-4" />
                          <span>{content?.wifiDetected || 'WiFi Network Detected'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <span className="text-slate-400 font-medium">{content?.ssid || 'SSID'}:</span>
                          <span className="col-span-2 text-white font-mono font-bold">{wifiInfo.ssid}</span>

                          <span className="text-slate-400 font-medium">{content?.password || 'Password'}:</span>
                          <div className="col-span-2 flex items-center gap-2">
                            <span className="font-mono bg-slate-950 px-2 py-1 rounded text-purple-300 break-all border border-slate-800">
                              {wifiInfo.password || '(None)'}
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

                      <button
                        onClick={() => copyToClipboard(scanResult)}
                        className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{content?.copy || 'Copy Full WiFi String'}</span>
                      </button>
                    </div>
                  );
                })()
              ) : (
                // URL or Text Result
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                      <span>{content?.scanResult || 'Scanned Content'}</span>
                      <span>{scanResult.length} chars</span>
                    </div>
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 break-all text-sm font-mono text-emerald-300 max-h-56 overflow-y-auto">
                      {scanResult}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {scanResult.startsWith('http') && (
                      <a
                        href={scanResult}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{content?.openLink || 'Open Link'}</span>
                      </a>
                    )}

                    <button
                      onClick={() => copyToClipboard(scanResult)}
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
