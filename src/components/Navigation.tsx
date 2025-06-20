import Link from 'next/link';
import { getAllManifestoPaths, getManifestoContent } from '../lib/manifesto';

type NavigationProps = {
  currentLang: string;
  currentSection: string;
};

export default async function Navigation({ currentLang, currentSection }: NavigationProps) {
  const paths = getAllManifestoPaths();
  
  // Get main section title
  let mainTitle = 'Main';
  try {
    const mainContent = await getManifestoContent(currentLang, 'main');
    mainTitle = mainContent.title;
  } catch (error) {
    console.error('Error getting main title:', error);
  }
  
  // Get secondary manifestos with their titles
  const secondaryManifestos: Array<{ section: string; title: string; href: string }> = [];
  
  const secondarySections = [...new Set(
    paths
      .filter(({ section }) => section !== 'main')
      .map(({ section }) => section)
  )];

  for (const section of secondarySections) {
    try {
      // Try to get content in current language, fallback to first available language
      const sectionLanguages = paths
        .filter(({ section: s }) => s === section)
        .map(({ lang }) => lang);
      
      const langToUse = sectionLanguages.includes(currentLang) 
        ? currentLang 
        : sectionLanguages[0];
      
      const content = await getManifestoContent(langToUse, section);
      secondaryManifestos.push({
        section,
        title: content.title,
        href: `/${section}/${langToUse}`
      });
    } catch (error) {
      console.error(`Error getting ${section} title:`, error);
      // Fallback to capitalized section name
      secondaryManifestos.push({
        section,
        title: section.charAt(0).toUpperCase() + section.slice(1),
        href: `/${section}`
      });
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        {/* Mobile and Desktop Navigation - Always Visible */}
        <div className="w-full flex justify-end">
          {/* Mobile: Wrapping navigation */}
          <div className="md:hidden w-full">
            <div className="flex flex-wrap gap-2 justify-start">
              <Link 
                href={`/main/${currentLang}`}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  currentSection === 'main'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-current={currentSection === 'main' ? 'page' : undefined}
              >
                {mainTitle}
              </Link>
              {secondaryManifestos.map(({ section, title, href }) => (
                <Link 
                  key={section}
                  href={href}
                  className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    currentSection === section
                      ? 'bg-blue-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-current={currentSection === section ? 'page' : undefined}
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop: Traditional horizontal navigation aligned right */}
          <div className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link 
                  href={`/main/${currentLang}`}
                  className={`block py-2 px-3 rounded-sm font-medium transition-colors ${
                    currentSection === 'main'
                      ? 'text-blue-700 font-semibold'
                      : 'text-gray-900 hover:text-blue-700'
                  }`}
                  aria-current={currentSection === 'main' ? 'page' : undefined}
                >
                  {mainTitle}
                </Link>
              </li>
              {secondaryManifestos.map(({ section, title, href }) => (
                <li key={section}>
                  <Link 
                    href={href}
                    className={`block py-2 px-3 rounded-sm font-medium transition-colors ${
                      currentSection === section
                        ? 'text-blue-700 font-semibold'
                        : 'text-gray-900 hover:text-blue-700'
                    }`}
                    aria-current={currentSection === section ? 'page' : undefined}
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
} 