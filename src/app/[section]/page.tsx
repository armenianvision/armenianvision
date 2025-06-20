import { redirect } from 'next/navigation';
import { getAllManifestoPaths, type ManifestoPath } from '../../lib/manifesto';

// Language priority order: Armenian, Russian, English, French, Arabic, Persian, then alphabetical
const LANGUAGE_PRIORITY = ['hy', 'ru', 'en', 'fr', 'ar', 'fa'];

function sortLanguages(languages: string[]): string[] {
  return languages.sort((a, b) => {
    const aIndex = LANGUAGE_PRIORITY.indexOf(a);
    const bIndex = LANGUAGE_PRIORITY.indexOf(b);
    
    // If both are in priority list, sort by priority
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one is in priority list, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // If neither is in priority list, sort alphabetically
    return a.localeCompare(b);
  });
}

type Props = {
  params: Promise<{
    section: string;
  }>;
};

export async function generateStaticParams() {
  const paths = getAllManifestoPaths();
  const sections = [...new Set(paths.map((path: ManifestoPath) => path.section))];
  
  return sections.map((section: string) => ({
    section,
  }));
}

export default async function SectionRedirect({ params }: Props) {
  const { section } = await params;
  
  const paths = getAllManifestoPaths();
  const sectionLanguages = paths
    .filter((path: ManifestoPath) => path.section === section)
    .map((path: ManifestoPath) => path.lang);
  
  if (sectionLanguages.length > 0) {
    const sortedLanguages = sortLanguages(sectionLanguages);
    const firstLanguage = sortedLanguages[0];
    redirect(`/${section}/${firstLanguage}`);
  } else {
    // Fallback to main section if requested section doesn't exist
    redirect('/main/hy');
  }
} 