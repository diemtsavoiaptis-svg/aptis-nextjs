import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điểm TSA với APTIS",
  description: "Aptis practice platform rebuilt in JavaScript/Next.js",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}




