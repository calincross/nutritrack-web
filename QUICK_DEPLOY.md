# Quick Deployment Guide: Vercel + Railway

This is the **cheapest and easiest** way to deploy NutriTrack. Total cost: **$0-20/month** (often free for small projects).

## Why Vercel + Railway?

| Feature | Vercel | Railway |
|---------|--------|---------|
| **Cost** | Free tier available | Free tier available |
| **Setup** | 2 minutes | 5 minutes |
| **Auto-deploy** | Yes (on git push) | Yes (on git push) |
| **Database** | N/A | Included MySQL |
| **SSL/HTTPS** | Automatic | Automatic |
| **Scalability** | Excellent | Good |

## Prerequisites

- GitHub account with your code pushed
- Vercel account (free)
- Railway account (free)

## Step 1: Deploy Backend to Railway (5 minutes)

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Start Project"
3. Sign in with GitHub

### 1.2 Create New Project
1. Click "Create New Project"
2. Select "GitHub Repo"
3. Authorize Railway to access your GitHub
4. Select your `nutritrack-web` repository

### 1.3 Configure Backend Service
1. Railway will detect the project
2. Click on the project
3. Click "Add Service" → "GitHub Repo"
4. Select your repository again
5. In the settings, set:
   - **Root Directory**: `server`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`

### 1.4 Add MySQL Database
1. Click "Add Service" → "Database" → "MySQL"
2. Railway creates a MySQL instance automatically
3. Copy the connection string (you'll need it)

### 1.5 Set Environment Variables
In Railway dashboard:
1. Go to your backend service
2. Click "Variables"
3. Add these variables:

```
PORT=3000
JWT_SECRET=your-super-secret-key-change-this
DB_HOST=mysql.railway.internal
DB_USER=root
DB_PASSWORD=[Railway generates this]
DB_NAME=railway
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@nutritrack.com
```

**Get DB credentials:**
- Click on MySQL service
- Go to "Connect" tab
- Copy the connection details

### 1.6 Deploy
1. Railway auto-deploys when you push to GitHub
2. Wait 2-3 minutes for deployment
3. Get your backend URL from Railway dashboard
   - It will look like: `https://your-app.up.railway.app`

## Step 2: Deploy Frontend to Vercel (2 minutes)

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign in with GitHub

### 2.2 Import Project
1. Click "Add New" → "Project"
2. Select your `nutritrack-web` repository
3. Vercel auto-detects it's a Vite project

### 2.3 Configure Build Settings
1. **Framework Preset**: Vite
2. **Build Command**: `pnpm build`
3. **Output Directory**: `dist`
4. **Install Command**: `pnpm install`

### 2.4 Set Environment Variables
Add this environment variable:
```
VITE_API_URL=https://your-railway-backend-url/api
```

Replace `your-railway-backend-url` with your actual Railway backend URL.

### 2.5 Deploy
1. Click "Deploy"
2. Wait 1-2 minutes
3. Your frontend is live! 🎉

## Step 3: Verify Everything Works

### 3.1 Test Frontend
1. Go to your Vercel URL
2. Register a new account
3. Check your email for welcome email
4. Log in and try logging a meal

### 3.2 Test Backend API
```bash
# Test API health
curl https://your-railway-url/health

# Test registration
curl -X POST https://your-railway-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 3.3 Check Email Notifications
1. Register a new account
2. Check your email inbox for welcome email
3. Log a meal that reaches your calorie goal
4. Check for goal achievement email

## Step 4: Custom Domain (Optional)

### Add Domain to Vercel
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Add Domain to Railway
1. In Railway dashboard, go to Settings
2. Add custom domain for backend
3. Update `VITE_API_URL` in Vercel with new backend URL

## Troubleshooting

### Backend Not Connecting
**Problem:** Frontend shows "API Error"

**Solution:**
1. Check `VITE_API_URL` in Vercel is correct
2. Verify Railway backend is running (check Railway dashboard)
3. Check backend logs in Railway for errors
4. Ensure CORS is configured in backend

### Database Connection Error
**Problem:** Backend crashes with database error

**Solution:**
1. Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD` in Railway
2. Check MySQL service is running in Railway
3. Run migrations: `pnpm db:push`

### Email Not Sending
**Problem:** No welcome email received

**Solution:**
1. Check `EMAIL_USER` and `EMAIL_PASSWORD` are correct
2. For Gmail: verify app-specific password is used
3. Check Railway backend logs for email errors
4. Test with Mailtrap first (see EMAIL_SETUP.md)

### Deployment Failed
**Problem:** Railway or Vercel shows deployment error

**Solution:**
1. Check build logs in dashboard
2. Ensure all dependencies are in package.json
3. Verify environment variables are set
4. Try redeploying manually

## Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Vercel** | 100GB bandwidth | $20/month |
| **Railway** | $5 credit/month | Pay as you go |
| **MySQL** | Included | Included |
| **Total** | **$0-5/month** | **$20-30/month** |

For most users, the free tier is sufficient!

## Monitoring & Maintenance

### Railway Dashboard
- Check backend logs
- Monitor database usage
- View deployment history

### Vercel Dashboard
- Check frontend builds
- Monitor performance
- View analytics

### Daily Checks
- Test login/registration
- Verify email notifications
- Check API responses

## Scaling Up

When you need more resources:

**Railway:**
- Upgrade to paid plan
- Increase database size
- Add more backend instances

**Vercel:**
- Upgrade to Pro ($20/month)
- Increase build minutes
- Add more deployments

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy backend to Railway
3. ✅ Deploy frontend to Vercel
4. ✅ Test all features
5. ✅ Share your live app!

## Support

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Nodemailer Docs](https://nodemailer.com)

---

**Congratulations!** Your NutriTrack app is now live! 🚀
