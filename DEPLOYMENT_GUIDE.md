# WhatsApp Preview Fix - Deployment Guide

## Overview
This guide explains the changes made to fix WhatsApp preview generation for `/newyear/:name` routes.

## The Problem
- The portfolio is a client-side React SPA (Single Page Application)
- All meta tags are injected via JavaScript after page load
- WhatsApp's crawler doesn't execute JavaScript
- Result: WhatsApp only sees generic meta tags from index.html, not personalized ones

## The Solution
Created a build-time script that pre-generates static HTML files with proper OG meta tags for specific routes.

## How It Works

### 1. Build Process
```bash
npm run build
```

This now runs two steps:
1. `vite build` - Builds the React app
2. `node scripts/generate-meta-pages.js` - Generates meta pages

### 2. Generated Files
For each name in the `namesToGenerate` array, the script creates:
- Directory: `dist/newyear/{base64EncodedName}/`
- File: `dist/newyear/{base64EncodedName}/index.html`

Example for "Josmi":
- Encoded: `Sm9zbWk=`
- Path: `dist/newyear/Sm9zbWk=/index.html`
- URL: `https://benjaminnechicattu.in/newyear/Sm9zbWk=`

### 3. What's in Each File
Each generated HTML file contains:
- ✅ Personalized `<title>` tag
- ✅ Personalized OG meta tags (title, description, URL, image)
- ✅ Twitter Card meta tags
- ✅ The full React application (all scripts and styles)
- ✅ Properly escaped content for security

## Deployment Steps

### 1. Build the Project
```bash
npm run build
```

### 2. Verify Generated Files
```bash
# Check if the file exists
ls -la dist/newyear/Sm9zbWk=/index.html

# Verify meta tags
cat dist/newyear/Sm9zbWk=/index.html | grep "og:" | head -10
```

### 3. Deploy to GitHub Pages
The deployment process remains the same. The `dist` folder contains all necessary files.

```bash
# If using gh-pages
npm run deploy

# Or commit and push (if using GitHub Actions)
git add dist
git commit -m "Deploy"
git push
```

### 4. Test the Preview

#### Method 1: WhatsApp Web
1. Go to web.whatsapp.com
2. Send the link to yourself: `https://benjaminnechicattu.in/newyear/Sm9zbWk=`
3. The preview should show: "Happy New Year Josmi! 🎉"

#### Method 2: Facebook Sharing Debugger
1. Visit: https://developers.facebook.com/tools/debug/
2. Enter URL: `https://benjaminnechicattu.in/newyear/Sm9zbWk=`
3. Click "Debug"
4. Should show personalized OG tags

#### Method 3: Twitter Card Validator
1. Visit: https://cards-dev.twitter.com/validator
2. Enter URL: `https://benjaminnechicattu.in/newyear/Sm9zbWk=`
3. Should show personalized preview

## Adding More Names

### Step 1: Edit the Script
Open `scripts/generate-meta-pages.js` and add names to the array:

```javascript
const namesToGenerate = [
  'Josmi',
  'John',
  'Sarah',
  'Michael',
  // Add more names...
];
```

### Step 2: Rebuild
```bash
npm run build
```

### Step 3: Deploy
Deploy the updated `dist` folder to GitHub Pages.

## Technical Details

### Security Features
- ✅ HTML escaping for text content
- ✅ Attribute escaping for URLs and meta values
- ✅ Error handling with logging
- ✅ No XSS vulnerabilities (verified with CodeQL)

### Compatibility
- ✅ Works with GitHub Pages static hosting
- ✅ Compatible with all social media crawlers
- ✅ Maintains full React app functionality
- ✅ No server-side rendering required

### File Structure
```
dist/
├── index.html              (Main app with generic OG tags)
├── assets/                 (JS, CSS bundles)
├── img/                    (Images)
└── newyear/
    └── Sm9zbWk=/          (Base64 encoded "Josmi")
        └── index.html      (Personalized OG tags + React app)
```

## Troubleshooting

### Issue: Preview not showing
**Possible causes:**
1. File not generated - Check if the name is in `namesToGenerate` array
2. Deployment issue - Verify the file exists in the deployed version
3. Cache issue - Use Facebook Debug Tool to refresh cache

**Solution:**
```bash
# Rebuild
npm run build

# Verify file
ls -la dist/newyear/*/index.html

# Redeploy
npm run deploy
```

### Issue: Wrong preview content
**Cause:** Old cache on social media platforms

**Solution:**
1. Visit Facebook Sharing Debugger
2. Click "Scrape Again"
3. Test the link again

### Issue: 404 Error
**Cause:** GitHub Pages not serving the subdirectory correctly

**Solution:**
Verify GitHub Pages is configured correctly:
1. Go to repository Settings → Pages
2. Ensure source is set to deploy from `main` branch (or whichever branch has the `dist` folder)
3. Wait a few minutes for deployment

## Success Criteria

✅ Build completes without errors
✅ Generated HTML files exist in `dist/newyear/*/`
✅ OG tags are present and personalized in generated files
✅ Page loads correctly in browser
✅ WhatsApp shows personalized preview
✅ No security vulnerabilities (CodeQL passes)

## Support

For issues or questions:
1. Check the `scripts/README.md` file
2. Review this deployment guide
3. Verify all steps were followed correctly
