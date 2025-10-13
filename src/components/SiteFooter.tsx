// src/components/SiteFooter.tsx
export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Freshly Delivery. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-gray-900" href="#">Privacy</a>
            <a className="hover:text-gray-900" href="#">Terms</a>
            <a className="hover:text-gray-900" href="#">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
