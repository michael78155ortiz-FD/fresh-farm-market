import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { CartProvider } from "@/components/cart/CartProvider";

export const metadata: Metadata = {
  title: "Fresh Farm",
  description: "Local market",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <CartProvider>
          <SiteHeader />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
