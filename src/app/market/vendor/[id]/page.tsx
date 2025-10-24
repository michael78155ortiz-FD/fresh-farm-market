/**
 * Vendor page (Next.js 15 param-promise compatible)
 * - `params` in PageProps is a Promise in Next 15; we await it here.
 * - Keep this server component simple; replace UI as needed.
 */

type PageParams = { id: string };
type PagePropsCompat = { params: Promise<PageParams> };

export default async function Page({ params }: PagePropsCompat) {
  const { id } = await params;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Vendor: {id}</h1>
      <p className="mt-2 text-sm text-gray-500">
        Placeholder vendor page (Next.js 15 params Promise fix). Replace with your actual UI.
      </p>
    </main>
  );
}
