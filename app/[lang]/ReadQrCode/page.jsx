import React from 'react';
import ReadQrCodeComponent from '../../Pages/ReadQrCode';

import { metaData } from '../../i18n/meta-data';

// Dynamic Metadata
export async function generateMetadata({ params }) {
    const lang = params.lang || 'en';
    const meta = metaData[lang] || metaData['en'];

    return {
        title: meta.read?.title || "Read QR Code",
        description: meta.read?.description || "Upload and read QR codes instantly.",
        keywords: meta.read?.keywords,
        openGraph: {
            title: meta.read?.title,
            description: meta.read?.description,
            url: `/${lang}/ReadQrCode`,
            siteName: 'Edqrcode',
            locale: lang,
            type: 'website',
        },
        alternates: {
            canonical: `/${lang}/ReadQrCode`,
            languages: {
                'en': '/en/ReadQrCode',
                'fr': '/fr/ReadQrCode',
                'es': '/es/ReadQrCode',
                'de': '/de/ReadQrCode',
                'ru': '/ru/ReadQrCode',
                'pt': '/pt/ReadQrCode',
                'ja': '/ja/ReadQrCode',
                'hi': '/hi/ReadQrCode',
                'zh': '/zh/ReadQrCode',
                'ar': '/ar/ReadQrCode',
            },
        },
    };
}

export default function Page({ params }) {
    return (
        <div>
            <ReadQrCodeComponent locale={params.lang} />
        </div>
    );
}
