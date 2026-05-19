import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Pages/Header";
import { MyProvider } from "./Context/Mycontext";
import Footer from "./Pages/Footer";
import { ToastProvider } from './components/toast';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://edqrcode.vercel.app'),
  title: {
    default: "Edqrcode | Generate and Customize QR Codes",
    template: "%s | Edqrcode",
  },
  description: "Edqrcode lets you create high-quality, customizable QR codes effortlessly. Download QR codes in various sizes.",
  icons: {
    icon: '/Qrcode/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <MyProvider>
            <div className='sticky top-0 z-50 bg-white  shadow-md'>
              <Header />
            </div>
            {children}
            <Footer />
            <Analytics />
          </MyProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
