import React from 'react';
import ReadQrCodeComponent from '../../Pages/ReadQrCode';
import { getMetaData } from '../../translations/metadata/index';

// Dynamic Metadata
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const lang = resolvedParams?.lang || 'en';
    const meta = await getMetaData(lang);

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
                'ar': '/ar/ReadQrCode',
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
            <ReadQrCodeComponent lang={lang} content={content.readQr} />
        </div>
    );
}
