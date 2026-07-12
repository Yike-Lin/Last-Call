export type RecipeCard = {
  slug: string;
  name: string;
  baseSpirit: string;
  summary: string;
  tags: string[];
  glassware: string;
  method: string;
  difficulty: string;
  estimatedAbv: string;
  ingredients: Array<{
    name: string;
    amount: string;
  }>;
  steps: string[];
};

export const recipes: RecipeCard[] = [
  {
    slug: "negroni",
    name: "内格罗尼 Negroni",
    baseSpirit: "金酒",
    summary: "一款苦感鲜明、酒体前置的经典鸡尾酒，由等量金酒、金巴利和甜味美思组成。",
    tags: ["苦感", "草本", "短饮"],
    glassware: "古典杯",
    method: "搅拌",
    difficulty: "简单",
    estimatedAbv: "24-26%",
    ingredients: [
      { name: "金酒", amount: "30 ml" },
      { name: "金巴利", amount: "30 ml" },
      { name: "甜味美思", amount: "30 ml" }
    ],
    steps: [
      "在饮用杯中加入冰块。",
      "倒入金酒、金巴利和甜味美思。",
      "搅拌至充分冰镇并完成稀释。",
      "挤压橙皮释放香气后放入杯中装饰。"
    ]
  },
  {
    slug: "margarita",
    name: "玛格丽特 Margarita",
    baseSpirit: "龙舌兰",
    summary: "龙舌兰、橙味利口酒和新鲜青柠之间形成明亮而紧致的柑橘张力。",
    tags: ["柑橘", "明快", "清爽"],
    glassware: "鸡尾酒杯",
    method: "摇匀",
    difficulty: "简单",
    estimatedAbv: "20-22%",
    ingredients: [
      { name: "白龙舌兰", amount: "50 ml" },
      { name: "橙味利口酒", amount: "20 ml" },
      { name: "新鲜青柠汁", amount: "20 ml" }
    ],
    steps: [
      "将全部原料与冰块加入摇壶。",
      "充分用力摇匀直到冰冷。",
      "细滤入已冰镇的鸡尾酒杯。",
      "可选：出杯前在杯口做盐边。"
    ]
  },
  {
    slug: "mojito",
    name: "莫吉托 Mojito",
    baseSpirit: "朗姆",
    summary: "带有薄荷提香、轻柔甜感和气泡收尾的经典长饮高球。",
    tags: ["薄荷", "长饮", "清爽"],
    glassware: "海波杯",
    method: "直调",
    difficulty: "中等",
    estimatedAbv: "10-12%",
    ingredients: [
      { name: "白朗姆", amount: "45 ml" },
      { name: "新鲜青柠汁", amount: "20 ml" },
      { name: "糖浆", amount: "15 ml" },
      { name: "薄荷", amount: "8 片叶" },
      { name: "苏打水", amount: "加满" }
    ],
    steps: [
      "在杯中将薄荷、糖浆和青柠轻轻压出香气。",
      "加入朗姆酒，再填入碎冰或冰块。",
      "补入苏打水并轻轻提拉混合。",
      "用一束薄荷完成装饰。"
    ]
  },
  {
    slug: "old-fashioned",
    name: "古典 Old Fashioned",
    baseSpirit: "威士忌",
    summary: "一款以糖、苦精和稀释共同塑形的经典短饮，适合慢慢啜饮。",
    tags: ["酒体前置", "橙香", "慢饮"],
    glassware: "古典杯",
    method: "搅拌",
    difficulty: "简单",
    estimatedAbv: "28-30%",
    ingredients: [
      { name: "波本或黑麦威士忌", amount: "60 ml" },
      { name: "糖浆", amount: "7.5 ml" },
      { name: "安哥仕苦精", amount: "2 dash" }
    ],
    steps: [
      "将全部原料与冰块加入调酒杯。",
      "搅拌至充分冰镇。",
      "滤入装有新鲜冰块的古典杯。",
      "挤压橙皮释放香气后装饰。"
    ]
  }
];

export const featuredRecipes = recipes.slice(0, 3);

export const quickStats = [
  { label: "首批配方", value: "100-200", note: "先聚焦经典酒款，而不是做全网聚合。" },
  { label: "核心页面", value: "5", note: "配方、详情、酒柜、调制台、品鉴结果。" },
  { label: "核心价值", value: "4", note: "发现、匹配、调制、保存。" }
];

export const cabinetOverview = [
  { label: "已拥有原料", value: "7", note: "MVP 只跟踪拥有状态。" },
  { label: "现在能做", value: "3", note: "由配方原料覆盖情况计算得出。" },
  { label: "接近可做", value: "6", note: "只差一到两瓶就能完成。" }
];

export function getRecipeBySlug(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug);
}
