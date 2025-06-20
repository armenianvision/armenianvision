# Armenian Vision

A multilingual manifesto platform for Armenian civilization and vision.

## How to Contribute

### Add a New Manifesto

1. Create a new markdown file in `manifesto/main/` or `manifesto/secondary/`
2. Use language code as filename (e.g., `en.md`, `hy.md`, `ru.md`)
3. Start with a title using `# Your Title`
4. Write your manifesto content in markdown

### Add a Translation

1. Find the manifesto you want to translate in `manifesto/main/` or `manifesto/secondary/`
2. Create a new file with your language code (see `src/languages.json` for codes)
3. Translate the content while keeping the same structure
4. Ensure the title is properly translated

### Test Your Changes

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see your changes.

### File Structure

```
manifesto/
├── main/           # Primary manifestos
│   ├── hy.md      # Armenian
│   ├── en.md      # English
│   └── ru.md      # Russian
└── secondary/      # Additional manifestos
    ├── hy.md
    └── en.md
```

## Supported Languages

Check `src/languages.json` for all supported language codes.

## Questions?

Open an issue or submit a pull request! 