import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dream",
  description: "Dream is an IDE built for AI coding.",
  icons: {
    icon: "/dream.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {process.env.NODE_ENV === "production" && (
          <Script
            defer
            src="/u.js"
            data-website-id="7ade14cb-bcb8-431f-9f5e-a0787c7cf311"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col max-w-[1400px] mx-auto w-full mx-auto px-4 sm:px-6 lg:px-8 ">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
