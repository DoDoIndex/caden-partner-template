import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Homepage/navbar";
import Footer from "@/components/Homepage/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Caden Tile Partner Catalog",
  description: "Caden Tile Partner Catalog is a white-label website template made for interior designers, builders, and contractors. It lets them showcase and sell Caden Tile’s products, like tiles and vinyl flooring, under their own brand. They can set their own prices and send a branded catalog to their clients, without worrying about inventory or shipping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
