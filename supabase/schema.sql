-- Create a table for admin users with a link to auth.users
CREATE TABLE admin_users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a secure RLS policy that only allows users to see their own data
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to only see their own data
CREATE POLICY "Users can view their own user data." 
  ON admin_users FOR SELECT 
  USING (auth.uid() = id);

-- Create a function to create admin_users entries when new users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, role)
  VALUES (new.id, new.email, 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to fire the function when users sign up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 