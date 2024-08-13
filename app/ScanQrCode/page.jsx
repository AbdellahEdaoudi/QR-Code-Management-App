import React from 'react'
import ScanQrCode from '../Pages/ScanQrCode'
export const metadata = {
  title: "Scan QR Code | QR Code Scanning Tool",
  description: "Use our advanced tool to scan and interpret QR codes easily. Suitable for all types of QR codes, providing fast and reliable results.",
  keywords: "Scan QR Code, QR Code Scanning, QR Code Scanner, Scan and Decode QR Code",
  author: "Abdellah Edaoudi",
  robots: "index, follow",
};
function page() {
  return (
    <div>
      <ScanQrCode />
    </div>
  )
}

export default page