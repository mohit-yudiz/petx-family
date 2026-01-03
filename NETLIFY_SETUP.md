# Netlify Setup - Quick Start

## ⚠️ IMPORTANT: Environment Variables Required

Your PetStay application **requires** environment variables to function properly. The build will succeed, but the app will not work at runtime without these variables.

## Setup Steps

### 1. Deploy to Netlify

Connect your repository to Netlify. The build configuration is already set up in `netlify.toml`.

### 2. Add Environment Variables (CRITICAL)

After deploying, immediately add these environment variables in your Netlify Dashboard:

1. Go to: **Site Settings** → **Environment Variables** → **Add a variable**

2. Add these two variables:

   ```
   Variable name: NEXT_PUBLIC_SUPABASE_URL
   Value: [Your Supabase Project URL]
   ```

   ```
   Variable name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [Your Supabase Anon Key]
   ```

### 3. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 4. Redeploy

After adding environment variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for deployment to complete

### 5. Verify

Visit your site and test:
- ✅ Registration works
- ✅ Login works
- ✅ Dashboard loads
- ✅ No console errors about Supabase

## Troubleshooting

### "Cannot read properties of undefined" or similar errors

**Cause**: Environment variables not set or not loaded properly

**Solution**:
1. Verify variables are added in Netlify Dashboard
2. Ensure variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy after adding variables

### "Invalid API key" errors

**Cause**: Wrong Supabase credentials

**Solution**:
1. Double-check you copied the correct values from Supabase
2. Use the **anon public** key, not the service role key
3. Ensure no extra spaces in the values

### Build succeeds but app doesn't work

**Cause**: Environment variables missing (build uses placeholders)

**Solution**: Add the environment variables as described in Step 2

## Need Help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
2. Review [Netlify Environment Variables Docs](https://docs.netlify.com/environment-variables/get-started/)
3. Review [Supabase API Keys Docs](https://supabase.com/docs/guides/api/api-keys)

---

**Remember**: The environment variables must be added in Netlify Dashboard, not just in your local `.env` file!
