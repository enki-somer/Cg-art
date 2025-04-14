# Supabase Setup Guide for Admin Authentication

This guide will help you set up Supabase for the admin authentication system in your Next.js application.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project and note your project URL and API keys

## Step 2: Update Environment Variables

Update the `.env` file in your project with your Supabase credentials:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Step 3: Set Up the Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Run the SQL commands from the `supabase/schema.sql` file in this project

This will:

- Create an `admin_users` table
- Set up Row Level Security (RLS) policies
- Create a trigger to automatically add new users to the admin_users table

## Step 4: Create Your First Admin User

There are two ways to create your first admin user:

### Option 1: Using the create-admin script (Recommended)

1. Install the required package: `npm install dotenv`
2. Run the admin creation script:

   ```bash
   # Set the admin email and password in the command
   ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npm run create-admin

   # OR set them in your .env file first
   npm run create-admin
   ```

3. You should see a success message if the admin user was created
4. **IMPORTANT**: Delete the `create-admin.js` file after you've created your admin user for security

### Option 2: Using the Supabase Dashboard (Advanced)

1. In Supabase dashboard, go to Authentication > Users
2. Click "Invite user" and enter the email address
3. The user will receive an invitation email to set their password
4. After they set a password, you need to manually:
   - Get the user's ID from the Authentication > Users list
   - Go to the SQL Editor and run:
     ```sql
     INSERT INTO admin_users (id, email, role)
     VALUES ('user-id-from-auth', 'user-email', 'admin');
     ```

## Step 5: Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Under Email Auth, ensure "Enable Email Signup" is turned on
3. Configure Site URL: http://localhost:3000 (for development)
4. Add additional redirect URLs if needed

## Step 6: Set Up Email Templates (Optional)

1. Go to Authentication > Email Templates
2. Customize the email templates for:
   - Confirmation
   - Invitation
   - Magic Link
   - Recovery

## Step 7: Deploy to Production

When deploying to production:

1. Update environment variables with production values
2. Update Site URL and redirect URLs in Supabase dashboard
3. Consider enabling additional security features like:
   - CAPTCHA protection
   - Rate limiting
   - Email domain restrictions

## Database Schema

The main table used for admin authentication is:

```sql
CREATE TABLE admin_users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

This table links to Supabase's built-in auth.users table and stores additional admin-specific information like roles.

## Security Best Practices

1. **Row Level Security**: Users can only view their own data
2. **HTTP-only Cookies**: Session tokens are stored in HTTP-only cookies
3. **Middleware Protection**: Admin routes are protected by middleware
4. **Service Role Key**: Keep your service role key secure - never expose it client-side
5. **Environment Variables**: Store sensitive keys in environment variables
6. **Admin Creation**: Delete the create-admin.js script after creating your first admin user

## Troubleshooting

- If users can't log in, check that your Supabase URL and API keys are correct
- If middleware isn't working, ensure you've configured the matcher correctly
- For database errors, check the Supabase dashboard logs
- For client-side errors, check your browser console

For more help, refer to [Supabase Documentation](https://supabase.com/docs)
