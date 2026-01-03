# PetStay Deployment Guide

## Netlify Deployment

### Prerequisites
- A Netlify account
- A Supabase account with a project set up
- Your Supabase URL and Anon Key

### Step 1: Set Up Environment Variables

Before deploying, you need to configure environment variables in Netlify:

1. Go to your Netlify Dashboard
2. Select your site
3. Navigate to **Site Settings** > **Environment Variables**
4. Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-actual-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
```

To get these values:
1. Go to your Supabase Dashboard
2. Select your project
3. Navigate to **Project Settings** > **API**
4. Copy the **Project URL** (for NEXT_PUBLIC_SUPABASE_URL)
5. Copy the **anon public** key (for NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Step 2: Deploy to Netlify

#### Option A: Deploy from Git

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. In Netlify Dashboard, click **Add new site** > **Import an existing project**
3. Connect your Git provider and select your repository
4. Netlify will auto-detect Next.js and configure build settings
5. Add the environment variables from Step 1
6. Click **Deploy site**

#### Option B: Deploy with Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### Step 3: Verify Deployment

1. Wait for the deployment to complete
2. Visit your site URL
3. Test the registration and login functionality
4. Ensure all features work correctly

## Database Setup

The database migrations have already been applied. If you need to re-run them or set up a new Supabase project:

1. Create a new Supabase project
2. The migrations will be automatically applied
3. Update your environment variables with the new project credentials

## Troubleshooting

### Build Errors

If you see `supabaseUrl is required` error:
- Ensure environment variables are set in Netlify Dashboard
- Redeploy your site after adding environment variables

### Authentication Issues

If authentication isn't working:
- Verify environment variables are correctly set
- Check Supabase Dashboard for any authentication errors
- Ensure your site URL is added to Supabase's allowed redirect URLs

### Database Connection Issues

If you can't connect to the database:
- Verify your Supabase URL and anon key are correct
- Check if RLS policies are properly configured
- Ensure your Supabase project is active and not paused

## Local Development

For local development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`

3. Run the development server:
   ```bash
   npm run dev
   ```

## Support

For issues or questions:
- Check the Supabase documentation: https://supabase.com/docs
- Check the Next.js documentation: https://nextjs.org/docs
- Check the Netlify documentation: https://docs.netlify.com
