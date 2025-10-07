# Deployment Guide

This guide will help you deploy Eve Console to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:
- An OpenRouter API key (get one from [OpenRouter](https://openrouter.ai/keys))
- A GitHub account (for connecting to deployment platforms)
- Your repository cloned and tested locally

## Environment Variables

All deployment platforms require the following environment variable:

```
OPENROUTER_API_KEY=your_actual_api_key_here
```

## Platform-Specific Guides

### Netlify Deployment

#### Option 1: Via Netlify UI

1. **Sign in to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in or create an account

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize Netlify
   - Select your `eve-console-unified` repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `build`
   - These should be auto-detected from `netlify.toml`

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add `OPENROUTER_API_KEY` with your API key

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at `your-site-name.netlify.app`

#### Option 2: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and link your site
netlify init

# Set environment variable
netlify env:set OPENROUTER_API_KEY "your_api_key_here"

# Deploy
netlify deploy --prod
```

### Vercel Deployment

#### Option 1: Via Vercel UI

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your `eve-console-unified` repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Create React App (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Set Environment Variables**
   - Add `OPENROUTER_API_KEY` with your API key
   - Apply to Production, Preview, and Development

5. **Deploy**
   - Click "Deploy"
   - Your site will be live at `your-project.vercel.app`

#### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts to set up your project

# Set environment variable
vercel env add OPENROUTER_API_KEY

# Deploy to production
vercel --prod
```

### GitHub Pages Deployment

**Note**: GitHub Pages doesn't support serverless functions, so the API endpoints won't work. This is only suitable for the frontend demo.

1. **Update package.json**
   ```json
   {
     "homepage": "https://your-username.github.io/eve-console-unified"
   }
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Custom VPS/Server Deployment

#### Using Docker (Recommended)

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npx", "serve", "-s", "build", "-l", "3000"]
   ```

2. **Build and Run**
   ```bash
   docker build -t eve-console .
   docker run -p 3000:3000 -e OPENROUTER_API_KEY=your_key eve-console
   ```

#### Direct Installation

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and Build**
   ```bash
   git clone https://github.com/your-username/eve-console-unified.git
   cd eve-console-unified
   npm install
   npm run build
   ```

3. **Set up Environment**
   ```bash
   cp .env.example .env
   nano .env  # Add your API key
   ```

4. **Serve with PM2**
   ```bash
   npm install -g pm2 serve
   pm2 serve build 3000 --spa
   pm2 save
   pm2 startup
   ```

## Post-Deployment

### Testing Your Deployment

1. **Check the status endpoint**
   - Visit: `https://your-site.com/api/env-check`
   - Should return: `{"ok": true, "routerKeySet": true}`

2. **Test the chat interface**
   - Visit your site
   - Should show "✅ Online" status
   - Try sending a message

3. **Check logs**
   - Netlify: Site settings → Functions → Function log
   - Vercel: Deployments → Click deployment → Functions

### Troubleshooting

#### "❌ Offline" Status

- **Cause**: Missing or invalid API key
- **Fix**: Check environment variables in platform settings
- **Verify**: Visit `/api/env-check` endpoint

#### "Request failed" Errors

- **Cause**: API endpoint issues or network problems
- **Fix**: Check function logs on your platform
- **Verify**: Test API key with curl:
  ```bash
  curl -H "Authorization: Bearer YOUR_KEY" \
       https://openrouter.ai/api/v1/models
  ```

#### Build Failures

- **Cause**: Missing dependencies or build errors
- **Fix**: 
  - Run `npm run build` locally first
  - Check build logs on platform
  - Ensure all dependencies are in `package.json`

## Security Best Practices

1. **Never commit `.env` files**
   - Already in `.gitignore`
   - Set environment variables through platform UI

2. **Rotate API keys regularly**
   - Update in platform settings
   - Redeploy if necessary

3. **Monitor usage**
   - Check OpenRouter dashboard for API usage
   - Set up alerts if available

## Custom Domain Setup

### Netlify

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions

### Vercel

1. Go to Project settings → Domains
2. Add your domain
3. Configure DNS as instructed

## Monitoring and Analytics

### Add Analytics

Update `public/index.html` to add:
- Google Analytics
- Plausible Analytics
- Umami Analytics

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay

## CI/CD Setup

Both Netlify and Vercel automatically deploy when you push to your repository. To customize:

### Netlify: `netlify.toml`

Already configured in the repository.

### Vercel: `vercel.json`

Create if needed for advanced configuration.

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Open an issue on GitHub

---

**Happy Deploying! 🚀**
