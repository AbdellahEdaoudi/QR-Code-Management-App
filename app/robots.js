export default function robots() {
    const baseUrl = 'https://edqrcode.vercel.app'; // Replace with your actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Example of disallowed route
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
