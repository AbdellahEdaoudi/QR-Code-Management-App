import React from 'react'
import LinkToQrcode from './Pages/LinkToQrcode'

export const metadata = {
  title: "Generate and Customize QR Codes | Link to QR Code Generator",
  description: "Create high-quality, customizable QR codes with our user-friendly tool. Upload logos, choose filenames, and download your QR codes in various sizes. Ideal for businesses and personal use.",
  keywords: "QR Code Generator, Custom QR Code, Upload Logo, Download QR Code, QR Code Tool, Create QR Code Online",
  author: "Abdellah Edaoudi",
  robots: "index, follow",
};
function page() {
  
  return (
    <div>
      <LinkToQrcode />
    </div>
  )
}

export default page