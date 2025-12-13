import React from 'react';
import ScanQrCodeComponent from '../../Pages/ScanQrCode';

import { metaData } from '../../i18n/meta-data';

// Dynamic Metadata
export async function generateMetadata({ params }) {
    const lang = params.lang || 'en';
    const meta = metaData[lang] || metaData['en'];

    return {
        title: meta.scan?.title || "Scan QR Code",
        description: meta.scan?.description || "Scan and decode QR codes instantly in multiple languages.",
        keywords: meta.scan?.keywords,
        openGraph: {
            title: meta.scan?.title,
            description: meta.scan?.description,
            url: `/${lang}/ScanQrCode`,
            siteName: 'Edqrcode',
            locale: lang,
            type: 'website',
        },
        alternates: {
            canonical: `/${lang}/ScanQrCode`,
            languages: {
                'en': '/en/ScanQrCode',
                'fr': '/fr/ScanQrCode',
                'es': '/es/ScanQrCode',
                'de': '/de/ScanQrCode',
                'ru': '/ru/ScanQrCode',
                'pt': '/pt/ScanQrCode',
                'ja': '/ja/ScanQrCode',
                'hi': '/hi/ScanQrCode',
                'zh': '/zh/ScanQrCode',
                'ar': '/ar/ScanQrCode',
            },
        },
    };
}

export default function Page({ params }) {
    return (
        <div>
            <ScanQrCodeComponent locale={params.lang} />
        </div>
    );
}
