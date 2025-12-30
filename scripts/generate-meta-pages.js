/**
 * Script to generate static HTML pages with proper OG meta tags for /newyear/:name routes
 * This ensures WhatsApp and other crawlers can see the meta tags without JavaScript execution
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base64 encode function
function base64Encode(str) {
  return Buffer.from(str).toString('base64');
}

// Base64 decode function
function base64Decode(str) {
  try {
    return Buffer.from(str, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

// List of names to pre-generate pages for
// You can add more names here as needed
const namesToGenerate = [
  'Josmi', // The specific name mentioned in the issue
  // Add more names here if needed
];

// Read the base index.html template
function readBaseTemplate() {
  const distDir = path.join(__dirname, '..', 'dist');
  const indexPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    throw new Error('dist/index.html not found. Please run build first.');
  }
  
  return fs.readFileSync(indexPath, 'utf8');
}

// Generate HTML content with OG meta tags by injecting them into the base template
function generateHTML(encodedName, decodedName, baseTemplate) {
  const capitalizedName = decodedName.charAt(0).toUpperCase() + decodedName.slice(1);
  const ogTitle = `Happy New Year ${capitalizedName}! 🎉`;
  const ogDescription = "Wishing you a year filled with joy, success, and endless possibilities! May this new year bring you happiness, health, and prosperity.";
  const ogImage = "https://benjaminnechicattu.in/img/b.png";
  const ogUrl = `https://benjaminnechicattu.in/newyear/${encodedName}`;

  // Create the new OG meta tags
  const newMetaTags = `
    <title>${ogTitle}</title>
    <meta name="description" content="${ogDescription}">
    
    <!-- Open Graph for social sharing -->
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${ogUrl}" />
    <meta property="og:site_name" content="Benjamin G Nechicattu" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:secure_url" content="${ogImage}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="2048" />
    <meta property="og:image:height" content="2048" />
    <meta property="og:image:alt" content="${ogTitle}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />
`;

  // Remove all existing OG and Twitter meta tags and title
  let html = baseTemplate
    .replace(/<title>.*?<\/title>/g, '')
    .replace(/<meta\s+name="description"[^>]*>/g, '')
    .replace(/<meta\s+name="keywords"[^>]*>/g, '')
    .replace(/<meta\s+name="author"[^>]*>/g, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/g, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/g, '')
    .replace(/<!--\s*Open Graph for social sharing\s*-->/g, '')
    .replace(/<!--\s*Twitter Card\s*-->/g, '')
    .replace(/<!--\s*JSON-LD Structured Data\s*-->[\s\S]*?<\/script>/g, '');
  
  // Inject the new meta tags right after the viewport meta tag
  html = html.replace(
    /<meta name="viewport"[^>]*>/,
    (match) => match + newMetaTags
  );
  
  return html;
}

// Main function
function main() {
  const distDir = path.join(__dirname, '..', 'dist');
  const newyearDir = path.join(distDir, 'newyear');

  // Read the base template
  let baseTemplate;
  try {
    baseTemplate = readBaseTemplate();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  // Ensure the newyear directory exists
  if (!fs.existsSync(newyearDir)) {
    fs.mkdirSync(newyearDir, { recursive: true });
  }

  console.log('Generating meta pages for /newyear/:name routes...');

  // Generate pages for each name
  namesToGenerate.forEach(name => {
    const encodedName = base64Encode(name);
    const nameDir = path.join(newyearDir, encodedName);
    
    // Create directory for this route
    if (!fs.existsSync(nameDir)) {
      fs.mkdirSync(nameDir, { recursive: true });
    }

    // Generate and write the HTML file
    const html = generateHTML(encodedName, name, baseTemplate);
    const filePath = path.join(nameDir, 'index.html');
    
    fs.writeFileSync(filePath, html);
    console.log(`✓ Generated: /newyear/${encodedName}/index.html for "${name}"`);
  });

  console.log(`\n✅ Successfully generated ${namesToGenerate.length} meta page(s)!`);
}

// Run the script
main();
