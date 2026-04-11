import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Texas Vogue AI",
  description: "Client conversation studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#171311] text-[#F3EDE6]">
        <Header />
        {children}
      </body>
    </html>
  );
}