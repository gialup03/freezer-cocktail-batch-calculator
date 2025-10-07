# Freezer Cocktail Calculator

A static web calculator for batched "freezer door" cocktails. Converts between ingredient volume ratios, absolute volumes (per batch/per serving), and weights (per batch). Calculates the final ABV and suggests dilution to reach optimal freezer range (30-33% ABV).

## Features

- **Ratio-based input**: Define cocktail recipes using simple ratios (e.g., 3:1 for a martini)
- **Volume calculations**: Get precise volumes in mL and oz for each ingredient
- **Weight measurements**: Calculate ingredient weights for accurate batch production
- **ABV calculation**: Automatic calculation of final alcohol by volume
- **Dilution guidance**: Recommendations to reach optimal freezer ABV range
- **Responsive design**: Works on desktop, tablet, and mobile devices

## Use Cases

- Determine dilution for recipes like a 3:1 martini to hit 30-33% ABV target
- Measure batches by weight instead of volume for precision
- Scale cocktail recipes to any batch size
- Pre-batch cocktails for freezer storage

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to use the calculator.

### Build

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Example: 3:1 Martini

**Inputs:**
- Gin: ratio=3, ABV=40%, density=0.94 g/mL
- Dry Vermouth: ratio=1, ABV=18%, density=0.98 g/mL
- Batch size: 750 mL

**Outputs:**
- Gin: 562.5 mL (18.99 oz), 528.8 g
- Vermouth: 187.5 mL (6.33 oz), 183.8 g
- Final ABV: 34.5%
- Recommendation: Add ~71 mL water to reach 31.5% ABV

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 3.4
- Lucide React (icons)

## Deployment

This app is a static site ready for free deployment on multiple platforms:

### Netlify (Recommended - Already Configured)

1. Push your code to GitHub
2. Visit [netlify.com](https://netlify.com) and sign up/login
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Netlify auto-detects the configuration from `netlify.toml`
6. Click "Deploy" - done!

**Free tier includes:**
- 100GB bandwidth/month
- Unlimited personal/commercial projects
- Continuous deployment
- Free SSL certificates
- Custom domains

### Alternative Platforms

**Vercel**
```bash
npm install -g vercel
vercel --prod
```

**Cloudflare Pages**
- Connect via GitHub
- Build command: `npm run build`
- Output directory: `dist`

**GitHub Pages**
```bash
npm run build
# Push the dist/ folder to gh-pages branch
```

## Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

## License

MIT License - see [LICENSE](LICENSE) file for details.

This means you can freely use, modify, and distribute this software for any purpose, including commercial use.
