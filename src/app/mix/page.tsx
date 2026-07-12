const buildSteps = [
  "选择杯型",
  "加入冰块",
  "倒入基酒",
  "加入辅料与柑橘",
  "摇匀或搅拌",
  "完成装饰"
];

export default function MixPage() {
  return (
    <main className="page-shell grid gap-6 py-10 lg:grid-cols-[0.9fr_1.1fr_0.8fr]">
      <section className="panel flex flex-col gap-4 p-6">
        <div>
          <h1 className="text-3xl font-semibold">调制台</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            MVP 版调制台用清晰可见的状态变化来替代物理拟真。液面、杯型和装饰都应该一眼能读懂。
          </p>
        </div>

        <div className="grid gap-3">
          {["鸡尾酒杯", "古典杯", "海波杯"].map((glass) => (
            <button
              key={glass}
              className="panel flex min-h-11 items-center justify-between px-4 text-left transition hover:border-white/20"
              type="button"
            >
              <span>{glass}</span>
              <span className="text-xs text-[var(--muted)]">选择</span>
            </button>
          ))}
        </div>

        <div className="panel p-4">
          <p className="text-sm font-medium">操作分组</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["冰块", "金酒", "金巴利", "甜味美思", "搅拌", "橙皮"].map((item) => (
              <span key={item} className="pill">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="panel flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">当前调制</p>
          <h2 className="mt-2 text-2xl font-semibold">内格罗尼 Negroni</h2>
        </div>

        <div className="relative flex h-[360px] w-full max-w-[280px] items-end justify-center">
          <div className="absolute inset-x-0 bottom-2 h-5 rounded-full bg-black/20 blur-md" />
          <div className="relative flex h-[280px] w-[190px] items-end justify-center overflow-hidden rounded-b-[24px] rounded-t-[18px] border border-white/15 bg-white/5">
            <div className="absolute inset-x-0 bottom-0 h-[52%] bg-[linear-gradient(180deg,_rgba(214,107,90,0.95),_rgba(127,49,40,0.92))]" />
            <div className="absolute left-[26px] top-[86px] h-12 w-10 rotate-6 rounded-xl bg-white/15" />
            <div className="absolute right-[30px] top-[122px] h-14 w-11 -rotate-6 rounded-xl bg-white/15" />
            <div className="absolute right-[36px] top-[28px] h-16 w-3 rounded-full bg-[linear-gradient(180deg,_#ffbf6d,_#d87c2d)]" />
          </div>
        </div>

        <button className="cta" type="button">
          完成出杯
        </button>
      </section>

      <aside className="panel flex flex-col gap-4 p-6">
        <h2 className="text-xl font-semibold">调制顺序</h2>
        <ol className="space-y-3 text-sm text-[var(--muted)]">
          {buildSteps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-xs font-semibold text-[var(--foreground)]">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="panel p-4">
          <p className="text-sm font-medium">预期结果</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            苦感明显、酒体前置，由甜味美思带来圆润感，短饮并带有橙皮香气。
          </p>
        </div>
      </aside>
    </main>
  );
}
