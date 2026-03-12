import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "HealthPOS — Health Club Management",
  description: "Premium health club management system for Herbalife clubs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface text-charcoal antialiased">{children}</body>
    </html>
  );
}
