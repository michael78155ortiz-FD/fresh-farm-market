export default function VendorSignupPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Become a Vendor</h1>
      <p className="text-gray-700">
        Sell your fresh goods on Fresh Farm. It’s free to start.
      </p>
      <ul className="list-disc pl-6 text-gray-700">
        <li>Create your vendor profile</li>
        <li>Add your products</li>
        <li>Get paid securely</li>
      </ul>

      <div className="pt-2">
        <a
          href="/api/vendor/connect" 
          className="inline-block rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition"
        >
          Start Signup
        </a>
      </div>
    </section>
  );
}
