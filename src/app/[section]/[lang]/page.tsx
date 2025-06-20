import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllManifestoPaths, getManifestoContent, type ManifestoPath } from '../../../lib/manifesto';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';

type Props = {
  params: Promise<{
    section: string;
    lang: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { section, lang } = await params;
    const manifesto = await getManifestoContent(lang, section);
    return {
      title: manifesto.title,
    };
  } catch {
    return {
      title: 'Not Found',
    };
  }
}

export async function generateStaticParams() {
  const paths = getAllManifestoPaths();
  // Generate params for all section-language combinations
  return paths.map((path: ManifestoPath) => ({
    section: path.section,
    lang: path.lang,
  }));
}

export default async function SectionLanguagePage({ params }: Props) {
  try {
    const { section, lang } = await params;
    const manifesto = await getManifestoContent(lang, section);

    // Update translations to use the new URL format
    const updatedTranslations: { [key: string]: string } = {};
    Object.entries(manifesto.translations || {}).forEach(([language]) => {
      updatedTranslations[language] = `/${section}/${language}`;
    });

    return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* Navigation */}
        <Navigation currentLang={lang} currentSection={section} />
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl px-6 py-8">
            <div className="mb-8">
              <LanguageSwitcher
                currentLang={lang}
                translations={updatedTranslations}
                currentUrl={`/${section}/${lang}`}
              />
            </div>

            <h1 className="text-2xl md:text-4xl font-bold mb-8 text-gray-900 text-bold">{manifesto.title}</h1>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: manifesto.content }}
            />
          </div>
        </main>
        
        <Footer />
      </div>
    );
  } catch {
    notFound();
  }
} 