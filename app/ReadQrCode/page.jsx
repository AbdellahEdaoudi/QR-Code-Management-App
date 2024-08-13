import ScanQrCode from '../Pages/ReadQrCode'

export const metadata = {
  title: "Read QR Code | QR Code Scanner",
  description: "Effortlessly read and decode QR codes with our efficient scanner. Quick and accurate, ideal for decoding various types of QR codes.",
  keywords: "Read QR Code, QR Code Scanner, Decode QR Code, QR Code Reader",
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