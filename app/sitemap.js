export default function sitemap() {
    const baseUrl = 'https://edqrcode.vercel.app';
    const languages = ['en', 'fr', 'ar', 'es', 'de', 'ru'];
    const routes = ['', '/ScanQrCode', '/ReadQrCode'];

    const sitemapEntries = [];

    languages.forEach((lang) => {
        routes.forEach((route) => {
            sitemapEntries.push({
                url: `${baseUrl}/${lang}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8,
            });
        });
    });

    return sitemapEntries;
}
