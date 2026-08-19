"use client";
import Link from 'next/link';
import { 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  FileSearch, 
  Scan,
} from '../components/Icons';

function Footer({ content, lang }) {
  const currentLang = lang || 'en';

  const socialLinks = [
    { name: "LinkedIn", link: "https://www.linkedin.com/in/abdellah-edaoudi", icon: "/Icons/link.svg" },
    { name: "GitHub", link: "https://github.com/AbdellahEdaoudi", icon: "/Icons/github.svg" },
    { name: "Instagram", link: "https://www.instagram.com/edaoudi_abdellah", icon: "/Icons/ins.svg" },
    { name: "YouTube", link: "https://youtube.com", icon: "/Icons/yt.svg" },
    { name: "Twitter / X", link: "https://twitter.com", icon: "/Icons/twit.svg" },
    { name: "WhatsApp", link: "https://whatsapp.com", icon: "/Icons/wts.svg" },
    { name: "Telegram", link: "https://telegram.org", icon: "/Icons/tele.svg" },
    { name: "PayPal", link: "https://paypal.me/edaoudiabdellah", icon: "/Icons/paypal.png" },
  ];

  return (
    <footer className="w-full bg-slate-900/90 border-t border-slate-800 text-slate-400 mt-20 relative overflow-hidden">
      {/* Subtle Top Gradient Line */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-purple-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href={`/${currentLang}`} className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                EdQr<span className="text-purple-400">Code</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              {content?.desc || 'Professional, secure, and customizable QR code suite. Generate high-resolution vector QR codes with custom colors and logos, scan via live camera, or decode from uploaded images.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{content?.privacy || '100% Client-Side Privacy Guarantee'}</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">{content?.tools || 'Tools'}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${currentLang}`} className="hover:text-purple-400 flex items-center gap-2 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{content?.generate || 'Generate QR Code'}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/ReadQrCode`} className="hover:text-cyan-400 flex items-center gap-2 transition-colors">
                  <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{content?.read || 'Read QR from Image'}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/ScanQrCode`} className="hover:text-emerald-400 flex items-center gap-2 transition-colors">
                  <Scan className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{content?.scan || 'Scan with Camera'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Connect Column */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">{content?.connect || 'Connect'}</h3>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {socialLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-purple-600/20 border border-slate-700 hover:border-purple-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                >
                  <img src={item.icon} alt={item.name} className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EdQrCode. {content?.rights || 'All rights reserved.'}</p>
          <div className="flex items-center gap-1.5">
            <span>{content?.crafted || 'Crafted by'} <a href="https://abdellah-edaoudi.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors font-medium text-slate-400">Abdellah Edaoudi</a> {content?.forUsers || 'for users worldwide'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
