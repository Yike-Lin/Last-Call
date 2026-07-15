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
    <main className="mix-layout page-shell grid gap-6 py-10">
      <section className="panel flex flex-col gap-4 p-6">
        <div>
          <h1 className="text-3xl font-semibold">调制台</h1>
          <p className="text-muted mt-2 text-sm leading-6">
            MVP 版调制台用清晰可见的状态变化来替代物理拟真。液面、杯型和装饰都应该一眼能读懂。
          </p>
        </div>

        <div className="grid gap-3">
          {["鸡尾酒杯", "古典杯", "海波杯"].map((glass) => (
            <button
              key={glass}
              className="panel flex min-h-11 items-center justify-between px-4 text-left transition hover:border-(--amber)"
              type="button"
            >
              <span>{glass}</span>
              <span className="text-muted text-xs">选择</span>
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
          <p className="text-muted text-xs uppercase tracking-wide">当前调制</p>
          <h2 className="mt-2 text-2xl font-semibold">内格罗尼 Negroni</h2>
        </div>

        <div className="mix-stage">
          <div className="mix-stage-shadow" />
          <div className="mix-glass">
            <div className="mix-liquid" />
            <div className="mix-ice-left" />
            <div className="mix-ice-right" />
            <div className="mix-orange-peel" />
          </div>
        </div>

        <button className="cta" type="button">
          完成出杯
        </button>
      </section>

      <aside className="panel flex flex-col gap-4 p-6">
        <h2 className="text-xl font-semibold">调制顺序</h2>
        <ol className="text-muted space-y-3 text-sm">
          {buildSteps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="text-foreground mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-(--border) text-xs font-semibold">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="panel p-4">
          <p className="text-sm font-medium">预期结果</p>
          <p className="text-muted mt-2 text-sm leading-6">
            苦感明显、酒体前置，由甜味美思带来圆润感，短饮并带有橙皮香气。
          </p>
        </div>
      </aside>
    </main>
  );
}
