export const metadata = {
  title: "Fresh Farm Live",
  description: "Connect with local vendors and live experiences",
  icons: { icon: "/favicon.svg" }, // tells Next to use your SVG, not /favicon.ico
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black">{children}</body>
    </html>
  );
}
