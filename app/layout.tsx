import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CursorWrapper } from "@/components/cursor-wrapper";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthLayout from "@/components/AuthLayout";

// Load font with subset optimization
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false, // Changed to false to reduce processing
  weight: ["400", "500", "700"], // Only load the weights we need
});

export const metadata: Metadata = {
  title: "KELWA",
  description: "Portfolio showcasing stunning CG artwork and projects",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://localhost:3000" />
        <link rel="dns-prefetch" href="https://localhost:3000" />
        {/* Preload critical assets */}
        <link rel="preload" href="/images/cg (2).jpg" as="image" />
      </head>
      <body
        className={`${spaceGrotesk.className} antialiased bg-black`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <CursorWrapper />
          <AuthLayout>{children}</AuthLayout>
          <Script id="disable-grammar-extensions" strategy="afterInteractive">
            {`
              document.body.setAttribute('data-grammarly-skip', 'true');
              
              // Force removal of extension attributes that cause hydration warnings
              window.addEventListener('load', () => {
                setTimeout(() => {
                  document.documentElement.removeAttribute('data-gr-ext-installed');
                  document.documentElement.removeAttribute('data-new-gr-c-s-check-loaded');
                  document.body.removeAttribute('data-gr-ext-installed');
                  document.body.removeAttribute('data-new-gr-c-s-check-loaded');
                }, 100);
              });
            `}
          </Script>
        </AuthProvider>
      </body>
    </html>
  );
}
