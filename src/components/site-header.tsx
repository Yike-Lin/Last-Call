import Link from "next/link";
import { navigation } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(13,17,23,0.88)] backdrop-blur">
      <div className="page-shell flex min-h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[var(--surface)] text-sm font-semibold">
            LC
          </span>
          <div>
            <strong className="block text-sm font-semibold">Last Call</strong>
            <span className="block text-xs text-[var(--muted)]">交互式鸡尾酒网站</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/recipes" className="cta secondary hidden sm:inline-flex">
            搜索
          </Link>
          <Link href="/cabinet" className="cta">
            酒柜
          </Link>
        </div>
      </div>
    </header>
  );
}
