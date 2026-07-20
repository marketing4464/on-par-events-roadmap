import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "On Par Marketing Roadmap",
  description: "Rolling event planning, recommendation, approval, and marketing dashboard for On Par Entertainment."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
