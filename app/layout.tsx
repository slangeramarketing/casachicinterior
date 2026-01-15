
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

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
    </html>
  );
}
