import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CasaChic Interior",
  description:
    "CasaChic Interior specializes in modern home interiors, modular kitchens, renovations, and commercial interior design solutions delivered with quality craftsmanship and timely execution.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div>
          <Header/>
        </div>
        <main>{children}</main>
       <div>
         <Footer/>
       </div>
      </body>
    </html>
  );
}
