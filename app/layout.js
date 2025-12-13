import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Pages/Header";
import { MyProvider } from "./Context/Mycontext";
import Footer from "./Pages/Footer";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://edqrcode.vercel.app'), // Replace with your actual domain
  title: {
    default: "Edqrcode | Generate and Customize QR Codes",
    template: "%s | Edqrcode",
  },
  description: "Edqrcode lets you create high-quality, customizable QR codes effortlessly. Upload logos, choose filenames, and download your QR codes in various sizes. Perfect for businesses and personal use.",
  keywords: ["QR Code Generator", "Custom QR Code", "Upload Logo", "Download QR Code", "Edqrcode", "Create QR Code Online", "QR Code Scanner"],
  authors: [{ name: "Abdellah Edaoudi" }],
  creator: "Abdellah Edaoudi",
  publisher: "Abdellah Edaoudi",
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://edqrcode.vercel.app',
    title: "Edqrcode | Generate and Customize QR Codes",
    description: "Edqrcode lets you create high-quality, customizable QR codes effortlessly. Upload logos, choose filenames, and download your QR codes in various sizes.",
    siteName: 'Edqrcode',
    images: [
      {
        url: '/Qrcode/Qrcode.png',
        alt: 'Edqrcode Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Edqrcode | Generate and Customize QR Codes",
    description: "Edqrcode lets you create high-quality, customizable QR codes effortlessly.",
    creator: "@AbdellahEdaoudi", // Replace with actual handle if available
    images: ['/Qrcode/Qrcode.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png', // Add apple-icon.png if you have one
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MyProvider>
          <div className='sticky top-0 z-50 bg-white  shadow-md'>
            <Header />
          </div>
          {children}
          <Footer />
          <ToastContainer />
          <Analytics />
        </MyProvider>
      </body>
    </html>
  );
}
