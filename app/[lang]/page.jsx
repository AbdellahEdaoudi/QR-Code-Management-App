import React from 'react';
import LinkToQrcode from '../Pages/LinkToQrcode';

import { metaData } from '../i18n/meta-data';

// Dynamic Metadata
export async function generateMetadata({ params }) {
    const lang = params.lang || 'en';
    const meta = metaData[lang] || metaData['en'];

    return {
        title: meta.home?.title || "Generate and Customize QR Codes",
        description: meta.home?.description || "Create high-quality, customizable QR codes...",
        keywords: meta.home?.keywords,
        openGraph: {
            title: meta.home?.title,
            description: meta.home?.description,
            url: `/${lang}`,
            siteName: 'Edqrcode',
            locale: lang,
            type: 'website',
        },
        alternates: {
            canonical: `/${lang}`,
            languages: {
                'en': '/en',
                'fr': '/fr',
                'es': '/es',
                'de': '/de',
                'ru': '/ru',
                'pt': '/pt',
                'ja': '/ja',
                'hi': '/hi',
                'zh': '/zh',
                'ar': '/ar',
            },
        },
    };
}

export default function Page({ params }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'EdQrCode',
        'url': `https://edqrcode.vercel.app/${params.lang}`,
        'description': 'Generate high-quality, fully customizable QR codes for free with EdQrCode.',
        'applicationCategory': 'UtilityApplication',
        'operatingSystem': 'Any',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        },
        'featureList': 'Custom Colors, Add Logo, High Resolution Download, No Sign-up'
    };

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LinkToQrcode locale={params.lang} />
        </div>
    );
}
