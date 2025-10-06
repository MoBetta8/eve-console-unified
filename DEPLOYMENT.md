# Deployment Detection Guide

## How to Identify Your Netlify Deployment

This repository has been updated to automatically display deployment information when the app is running.

### What You'll See

When you visit your deployed app, you'll see a **Deployment Information** box at the top that shows:

1. **Platform** - Automatically detected based on the URL:
   - **Netlify** - Shows with a teal/cyan border (#00C7B7)
   - **Vercel** - Shows with a black border
   - **Local Development** - Shows with a gray border when running locally

2. **Repository** - Shows `MoBetta8/eve-console-unified`

3. **URL** - Shows the current URL of the deployment

### How It Works

The app uses JavaScript to check `window.location.hostname` and detects the platform:
- If the hostname contains "netlify" → displays as Netlify
- If the hostname contains "vercel" → displays as Vercel
- If it's localhost → displays as Local Development

### Finding Your Netlify Deployment

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Look for the site connected to `MoBetta8/eve-console-unified`
3. Click on the site to see its URL
4. Visit the URL - you'll see the deployment info box showing "Platform: Netlify"

### Setting Up a New Netlify Deployment

If you haven't deployed yet:

1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select this repository: `MoBetta8/eve-console-unified`
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Add environment variables if needed:
   - `OPENROUTER_API_KEY` (if using the chat API)
6. Deploy!

Once deployed, visit your Netlify URL and the app will automatically show it's on Netlify.

## Multiple Deployments

You can have multiple deployments:
- One on Netlify
- One on Vercel
- Running locally for development

Each will automatically display its platform, making it easy to identify which is which!
