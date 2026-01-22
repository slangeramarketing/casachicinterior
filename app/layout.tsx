
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body>
        <NextTopLoader  
          color="#F97316"        // brand color
          height={3}
          showSpinner={false}
          crawlSpeed={200}
          easing="ease"
          speed={200}
        />
       {children}
      </body>
      {/* Aapka Measurement ID yahan aayega */}
      <GoogleAnalytics gaId="G-NPBJ9H7JCR" />
    </html>
  );
}
