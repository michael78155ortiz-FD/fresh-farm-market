import { CartProvider } from "@/components/cart/CartProvider";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
