import Link from 'next/link';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import languages from '../languages.json';

type LanguageSwitcherProps = {
  currentLang: string;
  translations: { [key: string]: string };
  currentUrl?: string;
};

// Create a map of language codes to native names from the languages.json file
const languageNames: { [key: string]: string } = languages.reduce((acc, lang) => {
  acc[lang.code] = lang.native;
  return acc;
}, {} as { [key: string]: string });

// Define the preferred order of languages
const languageOrder = ['hy', 'ru', 'en', 'fr', 'ar', 'fa'];

// Function to sort languages according to the preferred order
function sortLanguages(languages: [string, string][]): [string, string][] {
  return languages.sort(([langA], [langB]) => {
    const indexA = languageOrder.indexOf(langA);
    const indexB = languageOrder.indexOf(langB);
    
    // If both languages are in the preferred order, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only langA is in the preferred order, it comes first
    if (indexA !== -1) {
      return -1;
    }
    
    // If only langB is in the preferred order, it comes first
    if (indexB !== -1) {
      return 1;
    }
    
    // If neither is in the preferred order, sort alphabetically
    return langA.localeCompare(langB);
  });
}

export default function LanguageSwitcher({ currentLang, translations, currentUrl }: LanguageSwitcherProps) {
  // Include current language in the list
  const allLanguages = Object.entries(translations);
  allLanguages.push([currentLang, currentUrl || '#']);

  if (allLanguages.length === 0) {
    return null;
  }

  // Sort all languages according to the preferred order
  const sortedLanguages = sortLanguages(allLanguages);

  return (
    <div className="flex items-center gap-3">
      <GlobeAltIcon className="h-5 w-5 text-gray-500" />
      <div className="flex gap-2 flex-wrap">
        {sortedLanguages.map(([lang, url]) => {
          const isSelected = lang === currentLang;
          
          if (isSelected) {
            // Show current language as highlighted button (not clickable) - more subtle color
            return (
              <span
                key={lang}
                className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-full cursor-default"
              >
                {languageNames[lang] || lang}
              </span>
            );
          }
          
          // Show other languages as white clickable buttons
          return (
            <Link
              key={lang}
              href={url}
              className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-bold py-2 px-4 rounded-full border border-gray-300 hover:border-gray-400 transition-colors duration-200"
            >
              {languageNames[lang] || lang}
            </Link>
          );
        })}
      </div>
    </div>
  );
} 