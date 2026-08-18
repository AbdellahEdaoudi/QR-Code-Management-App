import React from 'react';
import LinkToQrcode from '../Pages/LinkToQrcode';
import { getMetaData } from '../translations/metadata/index';

// Dynamic Metadata
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const lang = resolvedParams?.lang || 'en';
    const meta = await getMetaData(lang);

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
                'ar': '/ar',
            },
        },
    };
}

import { getTranslation } from '../translations/content/index';

export default async function Page({ params }) {
    const resolvedParams = await params;
    const lang = resolvedParams?.lang || 'en';
    const content = await getTranslation(lang);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'EdQrCode',
        'url': `https://edqrcode.vercel.app/${lang}`,
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
            <LinkToQrcode lang={lang} content={content.generator} home={content.home} />
        </div>
    );
}
