#!/usr/bin/env node

/**
 * This script creates the first admin user in Supabase.
 * Run with: node create-admin.js
 *
 * It requires the following environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env file."
  );
  process.exit(1);
}

if (!adminEmail || !adminPassword) {
  console.error(
    "Missing admin credentials. Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file."
  );
  process.exit(1);
}

// Validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(adminEmail)) {
  console.error("Invalid email format");
  process.exit(1);
}

// Validate password strength
if (adminPassword.length < 8) {
  console.error("Password must be at least 8 characters long");
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  try {
    console.log("Creating admin user...");

    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", adminEmail);

    if (checkError) {
      throw new Error(`Error checking existing users: ${checkError.message}`);
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log(`Admin user with email ${adminEmail} already exists`);
      process.exit(0);
    }

    // Create the user in Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });

    if (authError) {
      throw new Error(`Error creating auth user: ${authError.message}`);
    }

    const userId = authData.user.id;

    // Create admin record
    const { error: adminError } = await supabase.from("admin_users").insert([
      {
        id: userId,
        email: adminEmail,
        role: "admin",
      },
    ]);

    if (adminError) {
      throw new Error(`Error creating admin record: ${adminError.message}`);
    }

    console.log("Admin user created successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log("You can now log in at /login");
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  }
}

createAdminUser();
