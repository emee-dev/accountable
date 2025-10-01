import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider, ThemeProvider } from "@/provider";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrains_mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Bookmarker",
  description: "Tag-yourself a tweet. Keep what matters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <body
          className={`${inter.className} ${geistMono.variable} ${GeistSans.variable} ${jetbrains_mono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-muted flex flex-col transition-colors duration-300">
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}
