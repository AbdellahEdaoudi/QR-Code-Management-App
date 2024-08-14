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
  title: "Edqrcode | Generate and Customize QR Codes",
  description: "Edqrcode lets you create high-quality, customizable QR codes effortlessly. Upload logos, choose filenames, and download your QR codes in various sizes. Perfect for businesses and personal use.",
  keywords: "QR Code Generator, Custom QR Code, Upload Logo, Download QR Code, Edqrcode, Create QR Code Online",
  author: "Abdellah Edaoudi",
  robots: "index, follow",
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
