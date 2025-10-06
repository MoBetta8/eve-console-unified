# Eve Console

Eve Console Prototype - AI-powered interface for EVE Council interactions.

## Deployment Information

This repository is configured for deployment on both Vercel and Netlify.

### Current Deployments

- **Vercel**: https://eve-console-unified-pftz.vercel.app
- **Netlify**: Configure by connecting this repository to your Netlify account

### Identifying Your Deployment

When you open the deployed app, the UI will display:
- Repository name and URL
- Deployment platform (detected automatically)
- Build information

This helps you identify which repository is live on Netlify.

### Deployment Setup

#### Netlify Setup
1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select this repository: `MoBetta8/eve-console-unified`
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Add environment variable: `OPENROUTER_API_KEY`

#### Vercel Setup
1. Go to [Vercel](https://vercel.com)
2. Import this repository: `MoBetta8/eve-console-unified`
3. Add environment variable: `OPENROUTER_API_KEY`

## Development

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

