# Vercel Deployment Guide for SupplySight

## 🚀 Quick Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com)
2. **Connect GitHub**: Link your GitHub account
3. **Import Repository**: Import `innocentmayemuhavi/supplysight`
4. **Deploy**: Click "Deploy" - Vercel will automatically detect it's a React app

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

## 📁 Project Structure for Vercel

```
supplysight/
├── api/
│   └── graphql.js          # Serverless GraphQL API
├── src/
│   └── ...                 # React frontend
├── dist/                   # Built frontend (auto-generated)
├── vercel.json             # Vercel configuration
└── package.json
```

## ⚙️ Configuration

### Vercel Configuration (`vercel.json`)

- **Frontend**: Served as static files from `/dist`
- **Backend**: Serverless function at `/api/graphql`
- **Routing**: API routes go to serverless functions, everything else to React app

### Environment Variables

- **Development**: Uses `http://localhost:4000`
- **Production**: Uses `/api/graphql` (Vercel serverless function)

## 🔗 URLs After Deployment

- **Frontend**: `https://your-project-name.vercel.app`
- **GraphQL API**: `https://your-project-name.vercel.app/api/graphql`
- **GraphQL Playground**: Access via Apollo Studio or GraphQL clients

## 🛠️ Development

### Local Development

```bash
# Install dependencies
yarn install

# Run both frontend and backend
yarn dev
```

This runs:

- **Vite dev server** at `http://localhost:5173`
- **GraphQL server** at `http://localhost:4000`

### Production Preview

```bash
yarn build
yarn preview
```

## 📊 Features

✅ **Full-stack deployment** with one command  
✅ **Serverless GraphQL API** with Apollo Server  
✅ **React frontend** with Vite  
✅ **Automatic HTTPS** and CDN  
✅ **Environment-aware** GraphQL endpoints  
✅ **Development & production** configurations

## 🎨 Your App Includes

- **Real-time dashboard** with fade-in animations
- **Interactive KPI cards**
- **Dynamic charts** with Recharts
- **Product management** with GraphQL mutations
- **Responsive design** with Tailwind CSS
- **Hot reload** in development

## 🔧 Troubleshooting

### Build Issues

- Ensure all dependencies are in `package.json`
- Check TypeScript errors with `yarn build`
- Verify API routes work locally

### API Issues

- Check `/api/graphql` endpoint in production
- Verify CORS settings in serverless function
- Test GraphQL queries in Apollo Studio

### Need Help?

- Check Vercel deployment logs in dashboard
- Use `vercel logs` command for CLI logs
- Test locally first with `yarn dev`

---

## 🎉 Ready to Deploy!

Your SupplySight app is fully configured for Vercel. Just push to GitHub and deploy!

**Live URL**: Will be `https://supplysight-[random].vercel.app` or your custom domain.
