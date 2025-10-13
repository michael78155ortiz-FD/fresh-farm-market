"use client";

export default function Error({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void 
}) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 mt-8">
      <h2 className="mb-2 text-lg font-semibold text-red-600">
        Oops! We couldn't load this vendor
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        {error.message || "Something went wrong. Please try again."}
      </p>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Try again
      </button>
    </div>
  );
}
