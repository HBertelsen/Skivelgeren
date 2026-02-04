import Link from "next/link";

const navItems = [
  { href: "/", label: "Hjem" },
  { href: "/quiz", label: "Quiz" },
  { href: "/katalog", label: "Katalog" },
];

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          Skivelgeren
        </Link>

        <nav className="flex gap-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
