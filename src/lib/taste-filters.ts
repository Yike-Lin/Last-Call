export const moodFilterRules = [
  { label: "全部", slugs: [], labels: [] },
  {
    label: "清爽",
    slugs: ["refreshing", "mint", "sparkling"],
    labels: ["清爽", "薄荷", "气泡"]
  },
  {
    label: "酸爽",
    slugs: ["sour", "acidic", "citrus"],
    labels: ["酸爽", "柑橘"]
  },
  {
    label: "苦甜",
    slugs: ["bitter", "bittersweet"],
    labels: ["苦甜", "苦感"]
  },
  {
    label: "草本",
    slugs: ["herbal", "mint"],
    labels: ["草本", "薄荷"]
  },
  {
    label: "果香",
    slugs: ["fruit", "berry", "apple", "pineapple", "peach", "grapefruit"],
    labels: ["果香", "莓", "苹果", "菠萝", "桃", "葡萄柚"]
  },
  {
    label: "香料",
    slugs: ["spice", "spiced", "aromatic", "vanilla", "oak"],
    labels: ["香料", "辛香", "香草", "橡木"]
  },
  {
    label: "酒感",
    slugs: ["spirit-forward"],
    labels: ["酒感", "酒体前置"]
  }
] as const;

export type MoodFilter = (typeof moodFilterRules)[number]["label"];
export type MoodFilterRule = (typeof moodFilterRules)[number];
