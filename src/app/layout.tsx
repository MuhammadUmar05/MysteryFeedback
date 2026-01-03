import type { Metadata } from "next";
import {Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/context/AuthProvider";


const poppins = Poppins({ 
  weight:"300",
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mystery Feedback",
  description: "Send anonymous messages anytime, anywhere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${poppins.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
