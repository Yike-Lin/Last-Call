export type CocktailLayerKey = "shadow" | "base" | "refraction" | "garnish" | "rim";

export type CocktailSpec = {
  id: string;
  index: string;
  label: string;
  name: string;
  note: string;
  accent: string;
  ready: boolean;
  layers: Partial<Record<CocktailLayerKey, string>>;
};

export const cocktailSlots: CocktailSpec[] = [
  {
    id: "tom-collins",
    index: "01",
    label: "CLEAN",
    name: "TOM COLLINS",
    note: "cold / clear / citrus",
    accent: "#b19f45",
    ready: true,
    layers: {
      shadow: "/images/cocktails/tom-collins-shadow.png",
      base: "/images/cocktails/tom-collins-base.png",
      refraction: "/images/cocktails/tom-collins-refraction.png",
      garnish: "/images/cocktails/tom-collins-lemon-peel.png",
      rim: "/images/cocktails/tom-collins-rim.png",
    },
  },
  {
    id: "negroni",
    index: "02",
    label: "BITTERSWEET",
    name: "NEGRONI",
    note: "bitter / herb / amber",
    accent: "#a84b2d",
    ready: false,
    layers: {},
  },
  {
    id: "daiquiri",
    index: "03",
    label: "ACID",
    name: "DAIQUIRI",
    note: "sharp / white / bright",
    accent: "#c8a34a",
    ready: false,
    layers: {},
  },
  {
    id: "last-word",
    index: "04",
    label: "HERBAL",
    name: "LAST WORD",
    note: "green / aromatic / dry",
    accent: "#6e7b4a",
    ready: false,
    layers: {},
  },
  {
    id: "paloma",
    index: "05",
    label: "FRUIT",
    name: "PALOMA",
    note: "pink / mineral / lift",
    accent: "#bd6d58",
    ready: false,
    layers: {},
  },
  {
    id: "penicillin",
    index: "06",
    label: "SPICE",
    name: "PENICILLIN",
    note: "smoke / honey / heat",
    accent: "#a46f34",
    ready: false,
    layers: {},
  },
  {
    id: "old-fashioned",
    index: "07",
    label: "SPIRIT",
    name: "OLD FASHIONED",
    note: "oak / orange / depth",
    accent: "#895331",
    ready: false,
    layers: {},
  },
];
