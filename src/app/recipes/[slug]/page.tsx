import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipeBySlug, recipes } from "@/lib/mock-data";

type RecipeDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="page-shell flex flex-col gap-8 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel flex flex-col gap-5 p-6">
          <div className="flex flex-wrap gap-2">
            <span className="pill">{recipe.baseSpirit}</span>
            {recipe.tags.map((tag) => (
              <span key={tag} className="pill">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">{recipe.name}</h1>
            <p className="max-w-2xl text-sm leading-7 text-(--muted)">{recipe.summary}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-(--muted)">杯型</p>
              <p className="mt-2 text-base font-semibold">{recipe.glassware}</p>
            </div>
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-(--muted)">做法</p>
              <p className="mt-2 text-base font-semibold">{recipe.method}</p>
            </div>
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-(--muted)">难度</p>
              <p className="mt-2 text-base font-semibold">{recipe.difficulty}</p>
            </div>
            <div className="panel p-4">
              <p className="text-xs uppercase tracking-wide text-(--muted)">预计酒精度</p>
              <p className="mt-2 text-base font-semibold">{recipe.estimatedAbv}</p>
            </div>
          </div>
        </div>

        <aside className="panel flex flex-col gap-4 p-6">
          <h2 className="text-lg font-semibold">酒柜匹配</h2>
          <p className="text-sm leading-6 text-(--muted)">
            这一块后面会正式接上用户酒柜。缺料、接近可完成、已拥有状态这些数据结构现在都已经准备好了。
          </p>
          <div className="panel p-4">
            <p className="text-sm font-medium">缺少的原料</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-(--muted)">
              <li>金巴利</li>
              <li>甜味美思</li>
            </ul>
          </div>
          <Link className="cta" href="/mix">
            开始调制
          </Link>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel flex flex-col gap-4 p-6">
          <h2 className="text-xl font-semibold">原料</h2>
          <ul className="space-y-3 text-sm text-(--muted)">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.name} className="flex items-center justify-between gap-4 border-b border-(--border) pb-3 last:border-b-0 last:pb-0">
                <span>{ingredient.name}</span>
                <strong className="font-medium text-(--foreground)">{ingredient.amount}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel flex flex-col gap-4 p-6">
          <h2 className="text-xl font-semibold">制作步骤</h2>
          <ol className="space-y-3 text-sm leading-6 text-(--muted)">
            {recipe.steps.map((step) => (
              <li key={step} className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-(--border) text-xs font-semibold text-(--foreground)">
                  {recipe.steps.indexOf(step) + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
