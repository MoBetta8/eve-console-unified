# Eve Console

Eve Console - AI-powered coding assistant

## Deployment

This application is designed to work on both Netlify and Vercel.

### Netlify Deployment

1. Connect your repository to Netlify
2. Set the environment variable `OPENROUTER_API_KEY` in your Netlify project settings
3. The build will automatically use the settings in `netlify.toml`
4. Deploy!

### Vercel Deployment

1. Connect your repository to Vercel
2. Set the environment variable `OPENROUTER_API_KEY` in your Vercel project settings
3. Deploy!

### Local Development

```bash
npm install
npm start
```

Note: API endpoints won't work locally without a backend server. The application will show as "Offline" but this is expected. When deployed to Netlify or Vercel, the serverless functions in the `/api` folder will be automatically available.

### Environment Variables

- `OPENROUTER_API_KEY` - Required for the chat functionality

 
