import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import { ShellPicker } from "@/components/shell-picker";
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
  title: "Hikmah Investors — Muslim Investors & Shariah-Compliant Businesses",
  description: "Connect Muslim investors with Shariah-compliant businesses. Ethical, halal investment matching.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ShellPicker user={session?.user ?? null}>{children}</ShellPicker>
      </body>
    </html>
  );
}
