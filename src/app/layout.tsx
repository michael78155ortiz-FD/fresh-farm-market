// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import SiteHeader from "@/components/SiteHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fresh Farm Market",
  description: "Local farm-fresh produce delivered to your door",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <SiteHeader />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
