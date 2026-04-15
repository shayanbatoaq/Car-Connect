import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "./components/Footer";
import { MobileBottomBar } from "./components/MobileBottomBar";
import { Navbar } from "./components/Navbar";

export const metadata: Metadata = {
  title: "Design Safe Safar Landing Page",
  description: "Safe Safar landing page and signup experience built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
          <Navbar />
          {children}
          <Footer />
          <MobileBottomBar />
        </div>
      </body>
    </html>
  );
}
