import Link from "next/link";

export default function TopBar() {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-32 flex items-center justify-center">
          <Link
            href="/"
            aria-label="Gå til forsiden"
            title="Skivelgeren"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/images/skivelgeren.png"
              alt="Skivelgeren"
              className="h-20 w-auto"
              loading="eager"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
