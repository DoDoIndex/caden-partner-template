import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Homepage/navbar";
import { Toaster } from 'react-hot-toast';
import ChatDrawer from "./components/ChatDrawer";
import Footer from "@/components/Homepage/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Caden Tile",
  description: "Caden Tile - Your Trusted Partner in Tile Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <ChatDrawer />
        <Toaster position="bottom-right" />
        <Footer />
      </body>
    </html>
  );
}
