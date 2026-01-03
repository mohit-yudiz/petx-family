# Mock Mode - Local Demo Guide

The PetStay application now includes a **Mock Mode** that allows you to test and demo all features without configuring Supabase credentials. All data is stored locally in your browser's localStorage.

## How It Works

When the application detects placeholder Supabase credentials (or missing credentials), it automatically switches to Mock Mode:

- ✅ **Full Authentication**: Register, login, and logout work completely
- ✅ **All Features**: Pet management, bookings, messages, notifications, etc.
- ✅ **Persistent Data**: Data saved in localStorage survives page refreshes
- ✅ **Zero Setup**: Works immediately without any configuration

## Using Mock Mode

### 1. Start the Application

```bash
npm run dev
```

The app will automatically run in Mock Mode if no Supabase credentials are configured.

### 2. Create an Account

1. Go to the Register page
2. Fill in your details:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Password: password123
   - Confirm Password: password123
3. Check the terms checkbox
4. Click "Send OTP"
5. Enter any 6-digit code (e.g., 123456)
6. Click "Verify & Create Account"

### 3. Login

Use the credentials you just created:
- Email: john@example.com (or phone number)
- Password: password123

### 4. Test Features

You can now test all features:
- Complete your profile
- Add pets
- Switch to host mode
- Set availability (as host)
- Browse hosts (as owner)
- Create bookings
- Send messages
- And more!

## Mock Mode Banner

When running in Mock Mode, you'll see a yellow banner at the top of the page:

> **Demo Mode:** Running with mock data. All data is stored locally in your browser.

This reminds you that you're using the local mock system.

## Data Storage

All mock data is stored in your browser's localStorage under these keys:

- `petstay_mock_users` - User accounts
- `petstay_mock_profiles` - User profiles
- `petstay_mock_pets` - Pet profiles
- `petstay_mock_bookings` - Bookings
- `petstay_mock_messages` - Chat messages
- `petstay_mock_notifications` - Notifications
- `petstay_mock_availability` - Host availability
- `petstay_mock_current_user` - Current logged-in user

### Clear All Data

To reset and start fresh, open your browser's Developer Console and run:

```javascript
localStorage.clear();
location.reload();
```

## Switching to Real Supabase

When you're ready to use the real database:

1. **Get Supabase Credentials**:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to **Settings** → **API**
   - Copy your **Project URL** and **anon public** key

2. **For Local Development**:
   ```bash
   # Create .env file
   cp .env.example .env

   # Edit .env and add your credentials
   NEXT_PUBLIC_SUPABASE_URL=your-actual-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-key
   ```

3. **For Netlify Deployment**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add both variables with your actual Supabase credentials
   - Redeploy your site

4. **Restart the application** and the banner will disappear

## Features in Mock Mode

### ✅ Working Features

- Authentication (register, login, logout, password reset)
- User profiles (create, read, update)
- Pet management (CRUD operations)
- Host discovery and search
- Booking requests and management
- Booking status updates
- Availability management
- Notifications
- Messages (basic - no real-time)
- Profile photo uploads (stored as base64)

### ⚠️ Limitations

- **No Real-time Updates**: Messages and notifications don't update automatically
- **Browser-specific**: Data is only in your browser's localStorage
- **No Multi-user Testing**: Can't test with multiple users simultaneously
- **No File Uploads to Server**: Images stored as base64 in localStorage
- **Limited Search**: Some advanced queries may not work perfectly

## Troubleshooting

### "No data showing up"

Make sure you've created an account and logged in. Check browser console for errors.

### "App not detecting Mock Mode"

The app checks for placeholder URLs. Make sure `.env` file either doesn't exist or has placeholder values.

### "Lost all my data"

Mock data is stored in localStorage. Clearing browser data or using incognito mode will erase it.

## Best Practices

1. **Testing**: Mock Mode is perfect for testing features during development
2. **Demos**: Great for showing the app to stakeholders without database setup
3. **Development**: Iterate quickly without worrying about database state
4. **Not for Production**: Always use real Supabase in production deployments

## Need Help?

- Check [README.md](./README.md) for general documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- See [NETLIFY_SETUP.md](./NETLIFY_SETUP.md) for Netlify-specific instructions

---

**Enjoy testing PetStay with zero configuration!** 🐾
