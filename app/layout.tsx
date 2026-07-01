import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Hanuman } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { LanguageProvider } from "@/context/language-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const hanuman = Hanuman({
  subsets: ["khmer"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-khmer",
});

export const metadata: Metadata = {
  title: "AdCraft AI | High-Converting Marketing Copy Generator",
  description: "Craft high-converting ad copy, landing page headlines, and social posts in seconds with advanced AI tailored for your product details.",
  keywords: ["AI Copywriting", "Marketing Assistant", "SaaS Ad Generator", "Gemini AI", "Text Ads", "Social Media Copywriter"],
  authors: [{ name: "AdCraft AI Team" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem("adcraft_language");
                if (saved === "km") {
                  document.documentElement.setAttribute("lang", "km");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} ${hanuman.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
