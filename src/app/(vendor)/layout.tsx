import { CartProvider } from "@/lib/context/CartContext";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
