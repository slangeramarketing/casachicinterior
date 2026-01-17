import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import HeaderServer from "./blocks/Header.server";
import FooterServer from "./blocks/Footer.server";

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

export const dynamic = "force-dynamic";


export default async function PublicLayout({
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
          <HeaderServer />
        </div>
        <main>{children}</main>
       <div>
         <FooterServer />
       </div>
      </body>
    </html>
  );
}
