import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School Polling Booth",
  description: "Secure and verifiable school election system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative pb-12">
        {children}
        <footer className="fixed bottom-0 w-full bg-slate-800 text-slate-300 text-center py-3 text-sm z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] font-medium">
          made by Unnati Varshney
        </footer>
      </body>
    </html>
  );
}
