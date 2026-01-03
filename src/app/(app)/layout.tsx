import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <>
      <Navbar />
      {children}
    </>
  );
}
