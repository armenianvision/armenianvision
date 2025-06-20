export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="text-gray-700 text-lg">
            <a 
              href="https://github.com/armenianvision/armenianvision" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full shadow-lg no-underline"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Add translations • Contribute • Թարգմանություններ ավելացնել • Մասնակցել
              </span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
} 