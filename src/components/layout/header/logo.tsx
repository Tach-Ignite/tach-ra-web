import Link from 'next/link';

export function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center gap-x-2">
      <img
        className="w-28 object-cover"
        width={96}
        height={52}
        src="/images/logos/tach-logo.svg"
        alt="Tach Logo"
      />
      <div className="text-2xl hidden md:block">Tach Color Store</div>
    </Link>
  );
}
