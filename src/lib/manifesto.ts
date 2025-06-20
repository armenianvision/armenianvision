import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import remarkBreaks from 'remark-breaks';

export type ManifestoPath = {
  section: string;
  lang: string;
};

export type ManifestoContent = {
  title: string;
  content: string;
  translations?: { [key: string]: string };
};



const manifestoDirectory = path.join(process.cwd(), 'manifesto');

export function getAllManifestoPaths(): ManifestoPath[] {
  const paths: ManifestoPath[] = [];
  
  // Get all sections (subdirectories in manifesto folder)
  const sections = fs.readdirSync(manifestoDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // For each section, get all markdown files
  sections.forEach(section => {
    const sectionPath = path.join(manifestoDirectory, section);
    try {
      const files = fs.readdirSync(sectionPath)
        .filter(file => file.endsWith('.md'));
      
      files.forEach(file => {
        const lang = file.replace('.md', '');
        paths.push({ section, lang });
      });
    } catch (error) {
      console.error(`Error reading section ${section}:`, error);
    }
  });
  
  return paths;
}

export async function getManifestoContent(lang: string, section: string): Promise<ManifestoContent> {
  const filePath = path.join(manifestoDirectory, section, `${lang}.md`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Manifesto not found: ${section}/${lang}`);
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Process markdown content
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  
  // Get available translations for this section
  const sectionPath = path.join(manifestoDirectory, section);
  const translations: { [key: string]: string } = {};
  
  try {
    const files = fs.readdirSync(sectionPath)
      .filter(file => file.endsWith('.md'));
    
    files.forEach(file => {
      const fileLang = file.replace('.md', '');
      if (fileLang !== lang) {
        translations[fileLang] = `/${section}/${fileLang}`;
      }
    });
  } catch (error) {
    console.error(`Error reading translations for ${section}:`, error);
  }
  
  return {
    title: data.title || `${section} - ${lang}`,
    content: processedContent.toString(),
    translations,
  };
}

 