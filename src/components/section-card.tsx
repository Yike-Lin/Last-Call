import Link from "next/link";

type SectionCardProps = {
  title: string;
  body: string;
  href: string;
  accent: string;
};

export function SectionCard({ title, body, href, accent }: SectionCardProps) {
  return (
    <Link href={href} className="panel flex min-h-44 flex-col justify-between gap-5 p-5 transition hover:border-white/20">
      <div
        className="h-1 w-14 rounded-full"
        style={{ backgroundColor: accent }}
      />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm leading-6 text-(--muted)">{body}</p>
      </div>
      <span className="text-sm font-medium text-(--amber)">进入</span>
    </Link>
  );
}
