import { Inter } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

// Inline script to prevent FOUC (flash of unstyled content) on theme load
const themeInitScript = `
  (function() {
    try {
      var theme = localStorage.getItem('edqr-theme');
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.classList.add(theme);
    } catch(e) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export const metadata = {
  metadataBase: new URL('https://edqrcode.vercel.app'),
  title: {
    default: "EdQrCode | Modern QR Code Studio & Scanner",
    template: "%s | EdQrCode",
  },
  description: "Create, customize, read, and scan high-resolution QR codes effortlessly. Free, lightning fast, with logo embedding and vector export.",
  keywords: [
    "QR Code Generator",
    "QR Code Scanner",
    "Free QR Code",
    "Custom QR Code",
    "QR Code with Logo",
    "Read QR from Image",
    "Decode QR Code",
    "High Resolution QR"
  ],
  authors: [{ name: "EdQrCode Studio" }],
  creator: "EdQrCode Studio",
  publisher: "EdQrCode Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/Qrcode/favicon.png',
    apple: '/Qrcode/favicon.png',
  },
  openGraph: {
    title: "EdQrCode | Modern QR Code Studio & Scanner",
    description: "Create, customize, read, and scan high-resolution QR codes effortlessly. Free, lightning fast, with logo embedding and vector export.",
    url: 'https://edqrcode.vercel.app',
    siteName: 'EdQrCode',
    images: [
      {
        url: '/Qrcode/favicon.png',
        width: 800,
        height: 600,
        alt: 'EdQrCode Studio - Create and Scan QR Codes',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EdQrCode | Modern QR Code Studio & Scanner',
    description: 'Create, customize, read, and scan high-resolution QR codes effortlessly. Free, lightning fast, with logo embedding.',
    images: ['/Qrcode/favicon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased relative`}>
        <ThemeProvider>
          {/* Background Ambient Glows */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 ambient-glow">
            <div className="absolute -top-40 left-1/4 w-150 h-150 bg-purple-600/15 rounded-full blur-[140px] animate-pulse-glow" />
            <div className="absolute top-1/3 -right-20 w-125 h-125 bg-indigo-600/15 rounded-full blur-[130px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
            <div className="absolute -bottom-20 left-1/3 w-137.5 h-137.5 bg-cyan-600/10 rounded-full blur-[150px]" />
          </div>

          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
