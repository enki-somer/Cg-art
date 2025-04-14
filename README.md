# KELWA - CG Art Portfolio

A modern portfolio showcasing CG artwork with an admin panel secured by Supabase authentication.

## Features

- Responsive design for all devices
- Admin panel for content management
- Secure authentication with Supabase
- Cloudinary integration for image uploads
- Dark theme with stunning visual effects

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd enki
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by copying the `.env.example` file:

```bash
cp .env.example .env
```

4. Fill in the required environment variables in the `.env` file:

```
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database Configuration
DATABASE_URL="file:./dev.db"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

5. Set up Supabase by following the instructions in `SUPABASE_SETUP.md`

6. Run the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Authentication

The admin panel is protected using Supabase Authentication with the following security features:

- Email/password authentication
- Middleware protection for admin routes
- HTTP-only cookies for tokens
- Role-based access control
- Row Level Security in the database

See `SUPABASE_SETUP.md` for detailed setup instructions.

## Deployment

1. Build the application:

```bash
npm run build
```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

3. Set up environment variables on your hosting platform

## Project Structure

- `/app` - Next.js application pages
- `/components` - Reusable UI components
- `/contexts` - React context providers (including auth)
- `/lib` - Utility functions and libraries
- `/middleware.ts` - Route protection middleware
- `/prisma` - Database schema for SQLite
- `/supabase` - Supabase SQL schema and setup
- `/public` - Static assets

## Security Features

1. **Authentication**: Supabase handles authentication with secure token management
2. **Middleware Protection**: Admin routes are protected by middleware
3. **Role-Based Access**: Only users with admin role can access admin features
4. **HTTP-only Cookies**: Session tokens stored in HTTP-only cookies
5. **Row Level Security**: Database-level security with Supabase RLS policies

## Customization

- Edit `tailwind.config.js` to customize the theme
- Update components in `/components` for UI changes
- Modify authentication logic in `/contexts/AuthContext.tsx`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
