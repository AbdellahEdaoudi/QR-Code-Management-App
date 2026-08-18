import React from 'react';
import ScanQrCodeComponent from '../../Pages/ScanQrCode';
import { getMetaData } from '../../translations/metadata/index';

// Dynamic Metadata
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const lang = resolvedParams?.lang || 'en';
    const meta = await getMetaData(lang);

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
                'ar': '/ar/ScanQrCode',
            },
        },
    };
}

import { getTranslation } from '../../translations/content/index';

export default async function Page({ params }) {
    const resolvedParams = await params;
    const lang = resolvedParams?.lang || 'en';
    const content = await getTranslation(lang);

    return (
        <div>
            <ScanQrCodeComponent lang={lang} content={content.scanQr} />
        </div>
    );
}
