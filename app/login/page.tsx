"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetupHelp, setShowSetupHelp] = useState(false);
  const { signIn } = useAuth();
  const searchParams = useSearchParams();
  const registered = searchParams?.get("registered");

  useEffect(() => {
    if (registered === "true") {
      // Show success message for newly registered users
      setError(
        "Registration successful! Please check your email to confirm your account."
      );
    }
  }, [registered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);
      if (result?.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-10 bg-zinc-900 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className={`px-4 py-3 rounded relative ${
                registered === "true"
                  ? "bg-green-500/10 border border-green-500 text-green-500"
                  : "bg-red-500/10 border border-red-500 text-red-500"
              }`}
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setShowSetupHelp(!showSetupHelp)}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            {showSetupHelp
              ? "Hide setup instructions"
              : "First time setup? Click here"}
          </button>

          {showSetupHelp && (
            <div className="mt-4 text-left p-4 bg-gray-800 rounded-md text-sm text-gray-300">
              <h3 className="font-medium text-white mb-2">
                Initial Setup Instructions:
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Run the admin creation script from the command line:</li>
                <li className="font-mono bg-gray-900 p-2 rounded">
                  npm install dotenv
                </li>
                <li className="font-mono bg-gray-900 p-2 rounded">
                  ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword node
                  create-admin.js
                </li>
                <li>This will create your first admin user</li>
                <li>
                  Return to this login page and sign in with those credentials
                </li>
              </ol>
              <p className="mt-3 text-yellow-500">
                <strong>Important:</strong> Delete the create-admin.js file
                after creating your admin user for security.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
