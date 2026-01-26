import PwaSuppressor from "@/app/pwa-suppress";

export const metadata = {
  manifest: "/manifest.json",
};

export default function PwaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PwaSuppressor />
      {children}
    </>
  );
}
