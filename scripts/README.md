# Meta Page Generator

This directory contains scripts for generating static HTML pages with proper Open Graph meta tags.

## generate-meta-pages.js

This script generates static HTML pages for `/newyear/:name` routes with personalized OG meta tags. This ensures that social media crawlers (like WhatsApp, Facebook, Twitter) can display proper previews even though the main app is a client-side React SPA.

### How it works

1. After the main Vite build completes, this script runs automatically
2. It reads the base `dist/index.html` file as a template
3. For each name in the `namesToGenerate` array, it:
   - Base64 encodes the name
   - Creates a directory at `dist/newyear/{encodedName}/`
   - Generates an `index.html` file with personalized OG meta tags
   - The HTML file includes the full React app but with pre-rendered meta tags

### Adding more names

To generate preview pages for additional names, edit `generate-meta-pages.js` and add names to the `namesToGenerate` array:

```javascript
const namesToGenerate = [
  'Josmi',
  'John',    // Add new names here
  'Sarah',
  // etc...
];
```

Then run:
```bash
npm run build
```

The script will generate pages for all names in the list.

### Generated URLs

For a name like "Josmi", the script will:
- Encode it to base64: `Sm9zbWk=`
- Create: `dist/newyear/Sm9zbWk=/index.html`
- Accessible at: `https://benjaminnechicattu.in/newyear/Sm9zbWk=`

### Why this approach?

Since the app is deployed on GitHub Pages (static hosting), we can't use server-side rendering. This pre-generation approach provides the best of both worlds:
- Social media crawlers see proper OG meta tags immediately
- Users still get the full interactive React experience
- No server-side infrastructure required
