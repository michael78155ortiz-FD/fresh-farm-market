import Link from "next/link";

export default function VendorSignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Become a Vendor
          </h1>
          <p className="text-xl text-gray-600">
            Join Fresh Farm Market and reach thousands of customers.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Why sell with us?</h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Low Commission Rates</h3>
                <p className="text-gray-600">Keep more of what you earn.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Direct Customer Access</h3>
                <p className="text-gray-600">Shoppers who love local produce.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy Setup</h3>
                <p className="text-gray-600">Open your shop in minutes.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Weekly Payouts</h3>
                <p className="text-gray-600">Fast, reliable payments.</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Ready to get started?</h3>
            <p className="text-gray-600 mb-6">
              Email us and we will guide you through your vendor application.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              
                href="mailto:vendors@freshfarmmarket.com"
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-green-700 transition"
              >
                Email Us
              </a>

              <Link
                href="/auth/sign-in"
                className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-200 transition"
              >
                Sign in / Create Account
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
