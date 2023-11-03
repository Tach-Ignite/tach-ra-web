import Link from 'next/link';

export function BrowseAllProducts() {
  return (
    <Link
      href="/p"
      className="underline underline-offset-4 hover:text-tachPurple transition duration-300"
    >
      Browse All Products
    </Link>
  );
}
