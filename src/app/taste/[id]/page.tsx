type TasteResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const balance = [
  { label: "甜", value: 2 },
  { label: "酸", value: 1 },
  { label: "苦", value: 4 },
  { label: "烈", value: 4 }
];

export default async function TasteResultPage({ params }: TasteResultPageProps) {
  const { id } = await params;

  return (
    <main className="page-shell flex flex-col gap-8 py-10">
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="panel flex flex-col gap-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-(--muted)">品鉴卡</p>
              <h1 className="mt-2 text-3xl font-semibold">调制记录 {id}</h1>
            </div>
            <span className="pill">已保存结果</span>
          </div>
          <p className="text-sm leading-7 text-(--muted)">
            一个完成度高的结果页，会让这次调酒真正变成“属于你的一杯”，而不是只看过一次就消失的动画。
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-(--muted)">外观</p>
              <p className="mt-2 text-base font-semibold">深琥珀偏红，短饮体量，表面明亮</p>
            </div>
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-(--muted)">酒体</p>
              <p className="mt-2 text-base font-semibold">中等偏厚</p>
            </div>
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-(--muted)">适饮场景</p>
              <p className="mt-2 text-base font-semibold">餐前、慢节奏夜晚</p>
            </div>
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-(--muted)">方法备注</p>
              <p className="mt-2 text-base font-semibold">更适合充分搅冷后短饮呈现</p>
            </div>
          </div>
        </div>

        <div className="panel flex flex-col gap-5 p-6">
          <h2 className="text-xl font-semibold">平衡</h2>
          <div className="space-y-4">
            {balance.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="text-(--muted)">{item.value}/5</span>
                </div>
                <div className="h-2 rounded-full bg-white/6">
                  <div
                    className="h-2 rounded-full bg-(--amber)"
                    style={{ width: `${item.value * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="panel p-4">
            <p className="text-sm font-medium">风味标签</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["苦感", "橙皮", "酒体前置", "草本"].map((tag) => (
                <span key={tag} className="pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
