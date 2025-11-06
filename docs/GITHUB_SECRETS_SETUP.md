# 🔐 GitHub Secrets Setup Guide

Dokumen ini menjelaskan cara setup GitHub Secrets yang diperlukan untuk CI/CD pipeline.

## ⚠️ Catatan Penting

**Warning lint errors pada workflow files adalah normal!** IDE mendeteksi `secrets.VERCEL_TOKEN` dll sebagai "might be invalid" karena secrets belum dikonfigurasi. Ini akan resolved setelah secrets ditambahkan di GitHub repository settings.

## 📋 Required Secrets

### 1. Vercel Deployment

#### `VERCEL_TOKEN`
- **Purpose:** Authentication untuk Vercel CLI
- **How to get:**
  1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
  2. Go to Settings → Tokens
  3. Create new token dengan nama "GitHub Actions"
  4. Copy token (hanya muncul sekali!)

#### `VERCEL_ORG_ID` (Optional)
- **Purpose:** Organization ID untuk Vercel
- **How to get:**
  1. Run `vercel link` di local project
  2. Check `.vercel/project.json` file
  3. Copy `orgId` value

#### `VERCEL_PROJECT_ID` (Optional)
- **Purpose:** Project ID untuk Vercel
- **How to get:**
  1. Run `vercel link` di local project
  2. Check `.vercel/project.json` file
  3. Copy `projectId` value

### 2. Railway Deployment

#### `RAILWAY_TOKEN`
- **Purpose:** Authentication untuk Railway CLI
- **How to get:**
  1. Login ke [Railway Dashboard](https://railway.app/dashboard)
  2. Go to Account Settings → Tokens
  3. Create new token
  4. Copy token

### 3. API URLs

#### `STAGING_API_URL`
- **Purpose:** Backend API URL untuk staging environment
- **Example:** `https://backend-staging.railway.app/api`
- **When to set:** After first Railway deployment

#### `PRODUCTION_API_URL`
- **Purpose:** Backend API URL untuk production environment
- **Example:** `https://backend-production.railway.app/api`
- **When to set:** After first Railway deployment

### 4. Environment Variables

#### `VITE_API_BASE_URL`
- **Purpose:** Frontend environment variable untuk API endpoint
- **Staging:** Same as `STAGING_API_URL`
- **Production:** Same as `PRODUCTION_API_URL`

## 🔧 How to Add Secrets to GitHub

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository
2. Click **Settings** tab
3. In left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Repository Secrets

Click **New repository secret** button and add each secret:

```
Name: VERCEL_TOKEN
Value: [paste your Vercel token]
```

Repeat for all required secrets.

### Step 3: Verify Secrets

After adding all secrets, you should see:

- ✅ VERCEL_TOKEN
- ✅ RAILWAY_TOKEN
- ✅ STAGING_API_URL
- ✅ PRODUCTION_API_URL
- ✅ VITE_API_BASE_URL (if needed)

## 🧪 Testing CI/CD

### Test Staging Deployment

1. Create feature branch
   ```bash
   git checkout -b feature/test-ci
   ```

2. Make a change and push
   ```bash
   git commit -m "feat: test CI/CD pipeline"
   git push origin feature/test-ci
   ```

3. Create Pull Request to `develop`

4. Check GitHub Actions tab for:
   - ✅ Frontend CI
   - ✅ Backend CI
   - ✅ PR Checks

5. After merge to `develop`:
   - ✅ Deploy to Staging workflow runs

### Test Production Deployment

1. Merge `develop` to `main`
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```

2. Check GitHub Actions tab for:
   - ✅ Deploy to Production workflow runs
   - ✅ GitHub Release created

## 🔍 Troubleshooting

### Issue: "VERCEL_TOKEN not found"

**Solution:**
1. Verify secret name is exactly `VERCEL_TOKEN` (case-sensitive)
2. Check secret is added to correct repository
3. Re-run workflow after adding secret

### Issue: "Railway deployment failed"

**Solution:**
1. Verify `RAILWAY_TOKEN` is valid
2. Check Railway project is linked correctly
3. Verify Railway service names match workflow:
   - `backend-staging`
   - `backend-production`

### Issue: "Health check failed"

**Solution:**
1. Check backend is running on Railway
2. Verify `/health` endpoint exists
3. Check `STAGING_API_URL` or `PRODUCTION_API_URL` is correct
4. Increase sleep time in workflow (currently 30s)

### Issue: "Lint errors about secrets"

**Solution:**
- **This is normal!** IDE shows warnings because secrets don't exist locally
- Warnings will not affect GitHub Actions execution
- Secrets are only available in GitHub Actions environment
- You can safely ignore these warnings

## 📝 Security Best Practices

### ✅ DO:
- Rotate tokens regularly (every 3-6 months)
- Use separate tokens for staging and production
- Never commit secrets to repository
- Use environment-specific secrets
- Limit token permissions to minimum required

### ❌ DON'T:
- Share tokens in chat or email
- Commit `.env` files with real values
- Use production tokens in development
- Give tokens unnecessary permissions
- Store tokens in code comments

## 🔄 Token Rotation

When rotating tokens:

1. Generate new token in service (Vercel/Railway)
2. Update GitHub secret with new value
3. Revoke old token
4. Test deployment to verify new token works

## 📞 Need Help?

If you encounter issues:

1. Check GitHub Actions logs for detailed error messages
2. Verify all secrets are added correctly
3. Ask in team WhatsApp group
4. Contact DevOps lead (Rizky)

## 🔗 Useful Links

- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Railway CLI Documentation](https://docs.railway.app/develop/cli)

---

**Last Updated:** 6 November 2025  
**Maintained by:** Muhammad Rizky (DevOps Lead)
