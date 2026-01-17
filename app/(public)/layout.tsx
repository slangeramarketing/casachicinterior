import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { serviceServer } from "@/modules/services/service.server";
import db from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casachicinterior",
  description: "Interior Design and Decoration Services",
};

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   await db();
   const featuredServiceList=await serviceServer.getFeatured(5);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div>
          <Header featuredServiceList={featuredServiceList} />
        </div>
        <main>{children}</main>
       <div>
         <Footer featuredServiceList={featuredServiceList} />
       </div>
      </body>
    </html>
  );
}
