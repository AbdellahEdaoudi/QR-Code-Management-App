"use client";
import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useToast } from '../components/toast';
import {
  Link2,
  Type,
  Wifi,
  MessageCircle,
  Mail,
  Phone,
  UserCheck,
  Download,
  Share2,
  Copy,
  Upload,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Check,
  Zap,
  ShieldCheck,
  Layers
} from 'lucide-react';

export default function LinkToQrcode({ lang, content, home }) {
  const toast = useToast();

  // Active Type Tab
  const [activeTab, setActiveTab] = useState('url');

  // Input states per type
  const [url, setUrl] = useState('https://edqrcode.vercel.app');
  const [text, setText] = useState('');
  const [filename, setFilename] = useState('my-qrcode');

  // WiFi
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // WhatsApp
  const [waNumber, setWaNumber] = useState('');
  const [waMessage, setWaMessage] = useState('');

  // Email
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Phone / SMS
  const [phoneNumber, setPhoneNumber] = useState('');

  // vCard
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');

  // Customization States
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState('H');
  const [includeMargin, setIncludeMargin] = useState(false);
  const [logo, setLogo] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoSize, setLogoSize] = useState(50);
  const [downloadResolution, setDownloadResolution] = useState(1024);
  const [isCopied, setIsCopied] = useState(false);

  const qrCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = `${home?.title || 'QR Code Generator'} | EdQrCode`;
  }, [lang]);

  // Compute raw QR value based on active tab
  const getQrValue = () => {
    switch (activeTab) {
      case 'url':
        return url || 'https://edqrcode.vercel.app';
      case 'text':
        return text || 'Hello World';
      case 'wifi':
        return `WIFI:S:${wifiSsid || 'MyWiFi'};T:${wifiEncryption};P:${wifiPassword};H:${wifiHidden};;`;
      case 'whatsapp':
        const cleanNumber = waNumber.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanNumber}${waMessage ? `?text=${encodeURIComponent(waMessage)}` : ''}`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNumber || '0000000000'}`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      default:
        return url || 'https://edqrcode.vercel.app';
    }
  };

  const currentQrValue = getQrValue();

  const socialIcons = [
    { src: '/Icons/fb.svg', alt: 'Facebook', name: 'Facebook' },
    { src: '/Icons/ins.svg', alt: 'Instagram', name: 'Instagram' },
    { src: '/Icons/wts.svg', alt: 'WhatsApp', name: 'WhatsApp' },
    { src: '/Icons/yt.svg', alt: 'YouTube', name: 'YouTube' },
    { src: '/Icons/github.svg', alt: 'GitHub', name: 'GitHub' },
    { src: '/Icons/twit.svg', alt: 'Twitter', name: 'Twitter' },
    { src: '/Icons/tik.svg', alt: 'TikTok', name: 'TikTok' },
    { src: '/Icons/tele.svg', alt: 'Telegram', name: 'Telegram' },
    { src: '/Icons/snap.svg', alt: 'Snapchat', name: 'Snapchat' },
    { src: '/Icons/link.svg', alt: 'Link', name: 'Link' },
  ];

  const presetFgColors = [
    { label: 'Black', color: '#000000' },
    { label: 'Indigo', color: '#4f46e5' },
    { label: 'Purple', color: '#9333ea' },
    { label: 'Emerald', color: '#059669' },
    { label: 'Rose', color: '#e11d48' },
    { label: 'Blue', color: '#2563eb' },
    { label: 'Amber', color: '#d97706' },
    { label: 'Slate', color: '#1e293b' },
  ];

  const presetBgColors = [
    { label: 'White', color: '#ffffff' },
    { label: 'Slate 50', color: '#f8fafc' },
    { label: 'Amber 50', color: '#fffbeb' },
    { label: 'Sky 50', color: '#f0f9ff' },
    { label: 'Zinc 900', color: '#18181b' },
  ];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objUrl = URL.createObjectURL(file);
      setLogoFile(objUrl);
      setLogo(objUrl);
      toast.success('Logo uploaded!');
    }
  };

  const handleClearLogo = () => {
    setLogo('');
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadQRCode = () => {
    try {
      const canvas = qrCanvasRef.current?.querySelector('canvas');
      if (!canvas) {
        toast.error('Could not render canvas.');
        return;
      }

      // Create a high-resolution export canvas
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = downloadResolution;
      exportCanvas.height = downloadResolution;
      const ctx = exportCanvas.getContext('2d');

      // Draw with smoothing enabled
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(canvas, 0, 0, downloadResolution, downloadResolution);

      const link = document.createElement('a');
      link.href = exportCanvas.toDataURL('image/png');
      link.download = `${filename || 'edqrcode'}-${downloadResolution}x${downloadResolution}.png`;
      link.click();
      toast.success(`QR Code downloaded in ${downloadResolution}x${downloadResolution}px!`);
    } catch (err) {
      console.error(err);
      toast.error('Download failed.');
    }
  };

  const copyQrImage = async () => {
    try {
      const canvas = qrCanvasRef.current?.querySelector('canvas');
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setIsCopied(true);
          toast.success(content?.copied || 'QR Code image copied!');
          setTimeout(() => setIsCopied(false), 2500);
        } catch (e) {
          // Fallback copy text
          await navigator.clipboard.writeText(currentQrValue);
          toast.info('QR text copied to clipboard!');
        }
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy.');
    }
  };

  const shareQRCode = () => {
    if (navigator.share && qrCanvasRef.current) {
      const canvas = qrCanvasRef.current.querySelector('canvas');
      if (canvas) {
        canvas.toBlob((blob) => {
          if (!blob) return;
          const file = new File([blob], `${filename || 'qrcode'}.png`, { type: 'image/png' });
          navigator.share({
            files: [file],
            title: content?.qrCodeTitle || 'EdQrCode Studio',
            text: content?.qrCodeShareText || 'Scan this QR code generated with EdQrCode Studio',
          }).catch((error) => console.log('Share dismissed', error));
        });
      }
    } else {
      toast.info(content?.shareApiNotSupported || 'Sharing not supported on this browser.');
    }
  };

  const tabList = [
    { id: 'url', label: content?.tabUrl || 'Website URL', icon: Link2 },
    { id: 'text', label: content?.tabText || 'Plain Text', icon: Type },
    { id: 'wifi', label: content?.tabWifi || 'WiFi Network', icon: Wifi },
    { id: 'whatsapp', label: content?.tabWhatsapp || 'WhatsApp', icon: MessageCircle },
    { id: 'email', label: content?.tabEmail || 'Email', icon: Mail },
    { id: 'phone', label: content?.tabPhone || 'Phone', icon: Phone },
    { id: 'vcard', label: content?.tabVcard || 'Contact (vCard)', icon: UserCheck },
  ];

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Customization Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Data Type Tabs */}
          <div className="glass-panel p-2 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex flex-wrap items-center gap-1.5">
              {tabList.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${isActive
                        ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Input Fields Container */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {content?.enterContent || 'Enter Content'}
            </h2>

            {/* TAB: URL */}
            {activeTab === 'url' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {content?.enterUrl || 'Target Website URL'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder={content?.phUrl || 'https://yourwebsite.com'}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent text-sm transition"
                  />
                </div>
              </div>
            )}

            {/* TAB: Plain Text */}
            {activeTab === 'text' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {content?.tabText || 'Text or Notes'}
                </label>
                <textarea
                  rows={4}
                  placeholder={content?.phText || 'Type any message, note, code snippet or plain text here...'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent text-sm transition resize-y"
                />
                <div className="text-right text-xs text-slate-500">
                  {text.length} {content?.characters || 'characters'}
                </div>
              </div>
            )}

            {/* TAB: WiFi */}
            {activeTab === 'wifi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    {content?.wifiSsid || 'Network Name (SSID)'}
                  </label>
                  <input
                    type="text"
                    placeholder={content?.phWifiSsid || 'e.g. Home_WiFi_5G'}
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      {content?.wifiPassword || 'Password'}
                    </label>
                    <input
                      type="text"
                      placeholder={content?.phWifiPassword || 'Network Password'}
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      {content?.wifiSecurity || 'Security Type'}
                    </label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value)}
                      className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/60 text-sm cursor-pointer"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">{content?.wifiNone || 'None (Open)'}</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                  />
                  <span>{content?.wifiHidden || 'Hidden Network'}</span>
                </label>
              </div>
            )}

            {/* TAB: WhatsApp */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    {content?.waPhone || 'Phone Number (With Country Code)'}
                  </label>
                  <input
                    type="text"
                    placeholder={content?.phWaPhone || 'e.g. +1234567890'}
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    {content?.waMessage || 'Pre-filled Message (Optional)'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={content?.phWaMessage || 'Hi! I am reaching out from your QR code...'}
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 text-sm"
                  />
                </div>
              </div>
            )}

            {/* TAB: Email */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    {content?.emailRecipient || 'Recipient Email'}
                  </label>
                  <input
                    type="email"
                    placeholder={content?.phEmailTo || 'contact@example.com'}
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      {content?.emailSubject || 'Subject'}
                    </label>
                    <input
                      type="text"
                      placeholder={content?.phEmailSubject || 'Inquiry about...'}
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      {content?.emailBody || 'Body Message'}
                    </label>
                    <input
                      type="text"
                      placeholder={content?.phEmailBody || "Hello, I'd like to..."}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Phone */}
            {activeTab === 'phone' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {content?.phoneNumber || 'Phone Number'}
                </label>
                <input
                  type="tel"
                  placeholder={content?.phPhone || '+1 (555) 000-0000'}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 text-sm"
                />
              </div>
            )}

            {/* TAB: vCard */}
            {activeTab === 'vcard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    {content?.vcardName || 'Full Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={content?.phVcardName || 'John Doe'}
                    value={vcardName}
                    onChange={(e) => setVcardName(e.target.value)}
                    className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    {content?.vcardOrg || 'Organization / Company'}
                  </label>
                  <input
                    type="text"
                    placeholder={content?.phVcardOrg || 'Acme Corp'}
                    value={vcardOrg}
                    onChange={(e) => setVcardOrg(e.target.value)}
                    className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    {content?.vcardPhone || 'Phone'}
                  </label>
                  <input
                    type="tel"
                    placeholder={content?.phVcardPhone || '+1 234 567 8900'}
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                    className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    {content?.vcardEmail || 'Email'}
                  </label>
                  <input
                    type="email"
                    placeholder={content?.phVcardEmail || 'john@example.com'}
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Filename Field */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                {content?.filename || 'Download Filename'}
              </label>
              <input
                type="text"
                placeholder={content?.filename || 'my-custom-qr'}
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 text-sm"
              />
            </div>
          </div>

          {/* Customization Options Accordion / Box */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              {content?.designColors || 'Design & Colors'}
            </h2>

            {/* Colors Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Foreground Color */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {content?.patternColor || 'QR Pattern Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-28 p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 uppercase"
                  />
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {presetFgColors.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setFgColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                      className={`w-6 h-6 rounded-full border transition-transform ${fgColor === c.color ? 'scale-125 border-white ring-2 ring-purple-500' : 'border-slate-700 hover:scale-110'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {content?.bgColor || 'Background Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-28 p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 uppercase"
                  />
                </div>
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {presetBgColors.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setBgColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                      className={`w-6 h-6 rounded-full border transition-transform ${bgColor === c.color ? 'scale-125 border-white ring-2 ring-purple-500' : 'border-slate-700 hover:scale-110'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Logo Section */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  {content?.uploadOrChoose || 'Logo & Branding'}
                </label>
                {(logo || logoFile) && (
                  <button
                    onClick={handleClearLogo}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium transition"
                  >
                    {content?.removeLogo || 'Remove Logo'}
                  </button>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs font-semibold transition hover:border-purple-500/50 shadow-sm"
                >
                  <Upload className="w-4 h-4 text-purple-400" />
                  <span>{content?.uploadLogo || 'Upload Custom Logo'}</span>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>

              {/* Social Logo Presets */}
              <div>
                <p className="text-[11px] text-slate-400 mb-2">
                  {content?.uploadPrompt || 'Or select from popular presets:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {socialIcons.map((item, idx) => {
                    const isSelected = logo === item.src;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setLogo(item.src);
                          setLogoFile(null);
                        }}
                        title={item.name}
                        className={`w-10 h-10 rounded-xl bg-slate-900/90 border flex items-center justify-center p-2 transition-all ${isSelected
                            ? 'border-purple-500 ring-2 ring-purple-500/40 bg-purple-500/10 scale-110'
                            : 'border-slate-800 hover:border-slate-700 hover:scale-105'
                          }`}
                      >
                        <img src={item.src} alt={item.alt} className="w-full h-full object-contain" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logo Size Adjustment */}
              {(logo || logoFile) && (
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{content?.logoSize || 'Logo Center Size'}</span>
                    <span>{logoSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="75"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Error Correction & Margins */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  {content?.margin || 'Quiet Zone (Margin)'}
                </label>
                <button
                  type="button"
                  onClick={() => setIncludeMargin(!includeMargin)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-2 ${includeMargin
                      ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                >
                  {includeMargin ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{includeMargin ? (content?.marginIncluded || 'Margin Included') : (content?.noMargin || 'No Margin')}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  {content?.eccLevel || 'Error Correction Level'}
                </label>
                <select
                  value={errorLevel}
                  onChange={(e) => setErrorLevel(e.target.value)}
                  className="w-full p-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-200 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="L">{content?.eccL || 'L - 7% (Smallest data)'}</option>
                  <option value="M">{content?.eccM || 'M - 15% (Standard)'}</option>
                  <option value="Q">{content?.eccQ || 'Q - 25% (Enhanced)'}</option>
                  <option value="H">{content?.eccH || 'H - 30% (Best for logos)'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Preview & Export Card (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Ambient Top Light */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {content?.livePreview || 'Live Preview'}
                </span>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                ECC: {errorLevel}
              </span>
            </div>

            {/* QR Canvas Display */}
            <div className="flex flex-col items-center justify-center py-4">
              <div
                ref={qrCanvasRef}
                className="p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-700/50 relative group"
                style={{ backgroundColor: bgColor }}
              >
                <QRCode
                  value={currentQrValue || 'https://edqrcode.vercel.app'}
                  size={240}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  renderAs="canvas"
                  includeMargin={includeMargin}
                  level={errorLevel}
                  imageSettings={
                    logo || logoFile
                      ? {
                        src: logo || logoFile,
                        x: undefined,
                        y: undefined,
                        height: logoSize,
                        width: logoSize,
                        excavate: true,
                      }
                      : undefined
                  }
                />
              </div>

              <p className="text-slate-400 text-xs mt-4 text-center truncate max-w-70">
                {currentQrValue}
              </p>
            </div>

            {/* Export Resolution Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                {content?.exportQuality || 'Export Quality'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '512px', val: 512 },
                  { label: '1024px (HD)', val: 1024 },
                  { label: '2048px (4K)', val: 2048 },
                ].map((res) => (
                  <button
                    key={res.val}
                    onClick={() => setDownloadResolution(res.val)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${downloadResolution === res.val
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    {res.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={downloadQRCode}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-white bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                <span>{content?.download || 'Download PNG'} ({downloadResolution}px)</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={copyQrImage}
                  className={`py-3 px-4 rounded-xl font-semibold text-xs border transition-all duration-200 flex items-center justify-center gap-2 ${isCopied
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700/80'
                    }`}
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                  <span>{isCopied ? (content?.copied || 'Copied!') : (content?.copyImage || 'Copy Image')}</span>
                </button>

                <button
                  onClick={shareQRCode}
                  className="py-3 px-4 rounded-xl font-semibold text-xs border bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700/80 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{content?.share || 'Share QR'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
