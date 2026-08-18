import Header from './Pages/Header';
import LinkToQrcode from './Pages/LinkToQrcode';
import Footer from './Pages/Footer';
import { getTranslation } from './translations/content/index';
import { ToastProvider } from './components/toast';

export default async function App() {
  const content = await getTranslation('en');
  
  return (
    <ToastProvider>
        <div className="z-50 sticky top-0">
          <Header lang="en" content={content.header} />
        </div>
        <main className="relative z-10 grow flex flex-col">
          <LinkToQrcode lang="en" content={content.generator} />
        </main>
        <div className="relative z-10">
          <Footer lang="en" content={content.footer} />
        </div>
    </ToastProvider>
  );
}