import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";

export async function GET() {
  // Collect debug information
  const debugInfo = {
    environment: process.env.NODE_ENV || 'unknown',
    firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set (masked)' : 'Not set',
    firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set',
    firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set',
    firebaseInitialized: !!firestore,
    serverTime: new Date().toISOString(),
    netlifySiteUrl: process.env.URL || 'Not set (not a Netlify environment)',
    netlifyContext: process.env.CONTEXT || 'Not a Netlify environment',
    netlifyDeployId: process.env.DEPLOY_ID || 'Not a Netlify environment',
  };
  
  return NextResponse.json(debugInfo);
} 