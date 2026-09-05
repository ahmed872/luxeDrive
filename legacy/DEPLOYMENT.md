# Deployment Guide for LuxeDrive

This guide provides step-by-step instructions for deploying the LuxeDrive car dealership website to various platforms.

## Prerequisites

Before deploying, ensure you have:
- Completed the build process locally
- Tested the application thoroughly
- All environment variables configured (if any)

## Option 1: Vercel (Recommended)

Vercel offers the easiest deployment process for React applications.

### Steps:

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Deploy via CLI**:
```bash
cd car-dealership
vercel
```

3. **Or Deploy via GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

### Configuration:

Vercel will automatically detect the following:
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### Custom Domain:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Option 2: Netlify

Netlify is another excellent platform for static site hosting.

### Steps:

1. **Build the project**:
```bash
pnpm run build
```

2. **Deploy via Drag & Drop**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder to the deploy zone

3. **Or Deploy via CLI**:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

4. **Or Deploy via GitHub**:
   - Connect your GitHub repository
   - Set build settings:
     - **Build command**: `pnpm run build`
     - **Publish directory**: `dist`

### Configuration File:

Create `netlify.toml` in the project root:

```toml
[build]
  command = "pnpm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The redirect rule ensures proper SPA routing.

## Option 3: GitHub Pages

Deploy directly from your GitHub repository.

### Steps:

1. **Install gh-pages**:
```bash
pnpm add -D gh-pages
```

2. **Update package.json**:
```json
{
  "scripts": {
    "predeploy": "pnpm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/car-dealership"
}
```

3. **Update vite.config.js**:
```javascript
export default defineConfig({
  base: '/car-dealership/',
  // ... rest of config
})
```

4. **Deploy**:
```bash
pnpm run deploy
```

5. **Enable GitHub Pages**:
   - Go to repository settings
   - Navigate to "Pages"
   - Select `gh-pages` branch
   - Save

## Option 4: AWS S3 + CloudFront

For enterprise-grade hosting with AWS.

### Steps:

1. **Build the project**:
```bash
pnpm run build
```

2. **Create S3 Bucket**:
   - Go to AWS S3 Console
   - Create a new bucket
   - Enable static website hosting
   - Set index document to `index.html`
   - Set error document to `index.html` (for SPA routing)

3. **Upload Files**:
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

4. **Set Bucket Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

5. **Create CloudFront Distribution** (Optional but recommended):
   - Go to CloudFront Console
   - Create distribution
   - Set origin to your S3 bucket
   - Configure custom error responses (404 → /index.html)
   - Set up SSL certificate

## Option 5: Docker

Containerize the application for deployment anywhere.

### Create Dockerfile:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Build and Run:

```bash
# Build image
docker build -t luxedrive .

# Run container
docker run -p 80:80 luxedrive
```

## Option 6: Traditional Web Server

Deploy to Apache or Nginx on your own server.

### For Nginx:

1. **Build the project**:
```bash
pnpm run build
```

2. **Copy files to server**:
```bash
scp -r dist/* user@your-server:/var/www/luxedrive
```

3. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/luxedrive;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. **Restart Nginx**:
```bash
sudo systemctl restart nginx
```

### For Apache:

1. **Copy files**:
```bash
scp -r dist/* user@your-server:/var/www/html/luxedrive
```

2. **Create .htaccess**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

3. **Enable mod_rewrite**:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

## Post-Deployment Checklist

After deploying, verify:

- ✅ All pages load correctly
- ✅ Navigation works properly
- ✅ Images are displayed
- ✅ Forms submit successfully
- ✅ Responsive design works on mobile
- ✅ SEO meta tags are present
- ✅ SSL certificate is active (HTTPS)
- ✅ Custom domain is configured (if applicable)
- ✅ Analytics are tracking (if implemented)
- ✅ Performance is optimized

## Performance Optimization

### Before Deployment:

1. **Optimize Images**:
   - Use WebP format where possible
   - Compress images
   - Use appropriate sizes

2. **Enable Compression**:
   - Gzip or Brotli compression
   - Minify CSS/JS (automatic with Vite)

3. **Configure Caching**:
   - Set appropriate cache headers
   - Use CDN for static assets

4. **Analyze Bundle Size**:
```bash
pnpm run build
npx vite-bundle-visualizer
```

## Environment Variables

If you need environment-specific configuration:

1. **Create `.env.production`**:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_WHATSAPP_NUMBER=1234567890
```

2. **Use in code**:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Continuous Deployment

### GitHub Actions (for Vercel/Netlify):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Troubleshooting

### Issue: 404 on page refresh
**Solution**: Configure server to redirect all routes to index.html

### Issue: Images not loading
**Solution**: Check base URL in vite.config.js and image paths

### Issue: Slow initial load
**Solution**: Enable code splitting and lazy loading (already implemented)

### Issue: CORS errors
**Solution**: Configure CORS headers on your backend API

## Support

For deployment issues, consult:
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deployment)
- Platform-specific documentation

---

**Happy Deploying! 🚀**

