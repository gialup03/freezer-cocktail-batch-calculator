# Deployment Guide

## Quick Deploy to Netlify (2 minutes)

### Step 1: Push to GitHub

If not already done:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

Make sure your repository is **public** (required for free tier).

### Step 2: Deploy on Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Sign up or login (can use GitHub account)
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **GitHub** and authorize Netlify
5. Select your `freezer-cocktail-batch-calculator` repository
6. Netlify will auto-detect settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Click **"Deploy site"**

Your app will be live in ~2 minutes at a URL like: `https://random-name-123.netlify.app`

### Step 3: Custom Domain (Optional)

In Netlify dashboard:
- Go to **Site settings** → **Domain management**
- Click **"Add custom domain"**
- Free options:
  - Use a custom subdomain: `yourname.netlify.app`
  - Connect your own domain (if you have one)

## Rate Limits & Costs

### Netlify Free Tier
- ✅ **100GB bandwidth/month** (millions of visits)
- ✅ **300 build minutes/month** (plenty for updates)
- ✅ **Unlimited sites**
- ✅ **No credit card required**
- ✅ **Commercial use allowed**

For a calculator app, you'll never hit these limits unless it goes viral.

### When You Might Need to Upgrade

You won't need to upgrade unless:
- You exceed 100GB bandwidth (extremely unlikely)
- You need advanced features (team collaboration, password protection)

Even then, Netlify Pro is only $19/month with 1TB bandwidth.

## Alternative Free Hosts

### Vercel
Similar to Netlify:
- 100GB bandwidth
- Unlimited personal projects
- [vercel.com](https://vercel.com)

### Cloudflare Pages
Most generous free tier:
- **Unlimited bandwidth**
- **Unlimited requests**
- 500 builds/month
- [pages.cloudflare.com](https://pages.cloudflare.com)

### GitHub Pages
Basic but reliable:
- Unlimited bandwidth for public repos
- Custom domains
- [pages.github.com](https://pages.github.com)

## Continuous Deployment

Once connected, every push to your main branch automatically:
1. Triggers a new build
2. Runs tests (if configured)
3. Deploys to production
4. Updates your live site

No manual deployment needed!

## License Compliance

This project uses:
- ✅ React (MIT License)
- ✅ Vite (MIT License)
- ✅ Tailwind CSS (MIT License)
- ✅ Lucide React (ISC License)

All dependencies are open-source and free for commercial use. No licensing issues.

## Monitoring

Netlify provides:
- Analytics (pageviews, visitors)
- Build logs
- Deploy notifications
- Error tracking

All included in free tier.

## Support

For deployment issues:
- Netlify docs: [docs.netlify.com](https://docs.netlify.com)
- Netlify support: [answers.netlify.com](https://answers.netlify.com)
- Open an issue in this repository
