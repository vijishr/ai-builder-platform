# Deployment Guide

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Tests passing (npm test)
- [ ] Security audit passed (npm audit)
- [ ] Build successful (npm run build)
- [ ] Dependencies updated
- [ ] Environment setup verified
- [ ] SSL certificates ready
- [ ] Domain configured
- [ ] CDN configured
- [ ] Monitoring setup complete

---

## Frontend Deployment

### Vercel (Recommended)

#### Step 1: Setup
```bash
npm i -g vercel
vercel login
cd frontend
```

#### Step 2: Deploy
```bash
vercel --prod
```

#### Step 3: Environment Variables
Set in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`: Production API URL

#### Step 4: Custom Domain
```bash
vercel domains add yourdomain.com
```

### Netlify Alternative

```bash
npm run build
# Deploy dist or out folder to Netlify
```

### AWS S3 + CloudFront

```bash
# Build
npm run build

# Deploy to S3
aws s3 sync out/ s3://your-bucket/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

---

## Backend Deployment

### Heroku

#### Step 1: Setup
```bash
npm i -g heroku
heroku login
cd backend
heroku create your-app-name
```

#### Step 2: Add Buildpack
```bash
heroku buildpacks:add heroku/nodejs
```

#### Step 3: Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_db_uri
# Add all .env variables
```

#### Step 4: Deploy
```bash
git push heroku main
```

#### Step 5: View Logs
```bash
heroku logs --tail
```

### AWS EC2

#### Step 1: Setup Instance
```bash
# Launch EC2 instance (Ubuntu 20.04 LTS)
# Connect via SSH
ssh -i your-key.pem ubuntu@your-instance-ip
```

#### Step 2: Install Dependencies
```bash
sudo apt update
sudo apt install -y nodejs npm git
sudo apt install -y mongodb

# Or use MongoDB Atlas (cloud)
```

#### Step 3: Clone and Deploy
```bash
git clone <repo-url>
cd ai-builder-platform/backend
npm install
npm run build
```

#### Step 4: Setup PM2
```bash
npm i -g pm2
pm2 start src/server.js --name "ai-builder"
pm2 startup
pm2 save
```

#### Step 5: Setup Nginx
```bash
sudo apt install -y nginx
```

Create `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Step 6: SSL Certificate
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Docker Deployment

#### Step 1: Create Dockerfile for Backend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 5000

CMD ["node", "src/server.js"]
```

#### Step 2: Create Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/ai-builder
    depends_on:
      - mongo
  
  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

#### Step 3: Deploy
```bash
docker-compose up -d
```

### DigitalOcean App Platform

```bash
# Create app.yaml in root
doctl apps create --spec app.yaml

# Or use DigitalOcean UI
```

---

## Database Deployment

### MongoDB Atlas (Cloud)

1. Create account at mongodb.com/cloud
2. Create cluster
3. Get connection string
4. Add to `MONGODB_URI` env variable
5. Whitelist IPs

### PostgreSQL on AWS RDS

1. Create RDS instance
2. Configure security groups
3. Get connection string
4. Run migrations:
```bash
npm run migrate
```

### Database Backup

```bash
# MongoDB
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/ai-builder"

# PostgreSQL
pg_dump your_database > backup.sql

# Upload to S3
aws s3 cp backup.sql s3://your-bucket/backups/
```

---

## Domain Setup

### DNS Configuration

```
A Record:
  Name: @
  Value: Your-Server-IP

CNAME Records:
  Name: www
  Value: your-domain.com

  Name: api
  Value: your-api-domain.com
```

### SSL Certificate

#### Let's Encrypt (Free)
```bash
certbot certonly --standalone -d your-domain.com
```

#### AWS Certificate Manager
- Request certificate in ACM dashboard
- Validate domain ownership
- Attach to CloudFront/ALB

---

## CDN Setup

### Cloudflare

1. Add domain
2. Update nameservers
3. Configure SSL (Full)
4. Enable caching rules
5. Setup page rules

### AWS CloudFront

1. Create distribution
2. Set origin: S3 bucket or Load Balancer
3. Configure caching
4. Attach SSL certificate
5. Add custom domain

---

## Monitoring & Logging

### Application Monitoring

```bash
# Sentry (Error Tracking)
npm install @sentry/node

# New Relic (APM)
npm install newrelic

# DataDog (Infrastructure)
# Use DataDog agent
```

### Log Aggregation

```bash
# ELK Stack setup
# Or use CloudWatch, Splunk, etc.
```

### Health Checks

```bash
# Add health check endpoint
GET /api/v1/health
```

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Backend
        run: |
          cd backend
          npm install
          git push heroku main
```

---

## Post-Deployment

1. **Verify**
   - Check frontend loads
   - Check API responds
   - Test authentication
   - Verify database connection

2. **Monitor**
   - Check error logs
   - Monitor performance
   - Check uptime
   - Review analytics

3. **Optimize**
   - Enable caching
   - Compress assets
   - Optimize images
   - Monitor performance

4. **Secure**
   - Run security audit
   - Check SSL certificate
   - Verify firewall rules
   - Test authentication

---

## Rollback Procedure

### If deployment fails:

```bash
# Heroku
heroku releases
heroku rollback v10

# AWS
# Use blue-green deployment to revert

# Vercel
# Previous deployment available in dashboard
```

---

## Performance Optimization

### Frontend
- [ ] Enable Next.js compression
- [ ] Optimize images (next/image)
- [ ] Code splitting enabled
- [ ] Tree shaking enabled
- [ ] CSS minified

### Backend
- [ ] Gzip compression enabled
- [ ] Database queries optimized
- [ ] Caching implemented (Redis)
- [ ] Connection pooling configured
- [ ] Load balancing setup

### Database
- [ ] Indexes created
- [ ] Query optimization done
- [ ] Replication enabled
- [ ] Backup automated

