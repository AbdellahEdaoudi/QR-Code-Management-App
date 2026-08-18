// This file can be used in both Server and Client Components

const metadata = {
    en: () => import('./en.json').then((module) => module.default),
    fr: () => import('./fr.json').then((module) => module.default),
    es: () => import('./es.json').then((module) => module.default),
    ar: () => import('./ar.json').then((module) => module.default),
    de: () => import('./de.json').then((module) => module.default),
    ru: () => import('./ru.json').then((module) => module.default),
}

export const getMetaData = async (locale) => {
    try {
        if (metadata[locale]) {
            return await metadata[locale]();
        }
        return await metadata['en']();
    } catch (error) {
        return await metadata['en']();
    }
}
