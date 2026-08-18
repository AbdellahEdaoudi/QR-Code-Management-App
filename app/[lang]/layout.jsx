import Header from '../Pages/Header';
import Footer from '../Pages/Footer';
import { ToastProvider } from '../components/toast';
import { getTranslation } from '../translations/content/index';

export default async function LangLayout({ children, params }) {
    const resolvedParams = await params;
    const lang = resolvedParams?.lang || 'en';
    const content = await getTranslation(lang);
    
    return (
        <ToastProvider>
            <div dir={lang === "ar" ? "rtl" : "ltr"} className="z-50 sticky top-0">
              <Header content={content.header} lang={lang} />
            </div>
            <main dir={lang === "ar" ? "rtl" : "ltr"} className="relative z-10 grow flex flex-col">
              {children}
            </main>
            <div dir={lang === "ar" ? "rtl" : "ltr"} className="relative z-10">
              <Footer lang={lang} content={content.footer} />
            </div>
        </ToastProvider>
    );
}
