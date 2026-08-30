const fs = require("fs");

let seedContent = fs.readFileSync("seed.mjs", "utf8");

// The new nice interior material images
const images = {
  wood: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
  glass: "https://images.unsplash.com/photo-1505377059067-e285a7bac49b?auto=format&fit=crop&q=80&w=800",
  wallpaper: "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?auto=format&fit=crop&q=80&w=800",
  lighting: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
  flooring: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800",
  metals: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
  textiles: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
  acoustics: "https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&q=80&w=800",
};

// Fix Categories
seedContent = seedContent.replace(
  /name: "Wood",[\s\S]*?image_url: ".*?"/g,
  `name: "Wood",\n    slug: "wood",\n    description: "Solid, engineered, and veneers.",\n    image_url: "${images.wood}"`,
);
seedContent = seedContent.replace(
  /name: "Glass",[\s\S]*?image_url: ".*?"/g,
  `name: "Glass",\n    slug: "glass",\n    description: "Clear, frosted, fluted, and tinted.",\n    image_url: "${images.glass}"`,
);
seedContent = seedContent.replace(
  /name: "Wallpaper",[\s\S]*?image_url: ".*?"/g,
  `name: "Wallpaper",\n    slug: "wallpaper",\n    description: "Textured, metallic, and vinyl finishes.",\n    image_url: "${images.wallpaper}"`,
);
seedContent = seedContent.replace(
  /name: "Lighting",[\s\S]*?image_url: ".*?"/g,
  `name: "Lighting",\n    slug: "lighting",\n    description: "Pendants, profiles, and chandeliers.",\n    image_url: "${images.lighting}"`,
);
seedContent = seedContent.replace(
  /name: "Flooring",[\s\S]*?image_url: ".*?"/g,
  `name: "Flooring",\n    slug: "flooring",\n    description: "Marble, tiles, SPC, and hardwood options.",\n    image_url: "${images.flooring}"`,
);
seedContent = seedContent.replace(
  /name: "Metals",[\s\S]*?image_url: ".*?"/g,
  `name: "Metals",\n    slug: "metals",\n    description: "Brushed, polished, and matte metal finishes.",\n    image_url: "${images.metals}"`,
);
seedContent = seedContent.replace(
  /name: "Textiles",[\s\S]*?image_url: ".*?"/g,
  `name: "Textiles",\n    slug: "textiles",\n    description: "Premium upholstery, curtains, and rugs.",\n    image_url: "${images.textiles}"`,
);
seedContent = seedContent.replace(
  /name: "Acoustics",[\s\S]*?image_url: ".*?"/g,
  `name: "Acoustics",\n    slug: "acoustics",\n    description: "Sound absorbing panels and baffles.",\n    image_url: "${images.acoustics}"`,
);

// Fix Products
seedContent = seedContent.replace(
  /slug: "premium-oak-veneer",[\s\S]*?image_url: ".*?"/g,
  `slug: "premium-oak-veneer",\n    category_slug: "wood",\n    base_price: 120,\n    pricing_unit: "sqft",\n    image_url: "${images.wood}"`,
);
seedContent = seedContent.replace(
  /slug: "walnut-solid-wood",[\s\S]*?image_url: ".*?"/g,
  `slug: "walnut-solid-wood",\n    category_slug: "wood",\n    base_price: 250,\n    pricing_unit: "sqft",\n    image_url: "${images.wood}"`,
);
seedContent = seedContent.replace(
  /slug: "fluted-glass-panel",[\s\S]*?image_url: ".*?"/g,
  `slug: "fluted-glass-panel",\n    category_slug: "glass",\n    base_price: 450,\n    pricing_unit: "sqmt",\n    image_url: "${images.glass}"`,
);
seedContent = seedContent.replace(
  /slug: "geometric-wallpaper",[\s\S]*?image_url: ".*?"/g,
  `slug: "geometric-wallpaper",\n    category_slug: "wallpaper",\n    base_price: 85,\n    pricing_unit: "piece",\n    image_url: "${images.wallpaper}"`,
);
seedContent = seedContent.replace(
  /slug: "linear-pendant-light",[\s\S]*?image_url: ".*?"/g,
  `slug: "linear-pendant-light",\n    category_slug: "lighting",\n    base_price: 320,\n    pricing_unit: "piece",\n    image_url: "${images.lighting}"`,
);
seedContent = seedContent.replace(
  /slug: "calacatta-marble-tile",[\s\S]*?image_url: ".*?"/g,
  `slug: "calacatta-marble-tile",\n    category_slug: "flooring",\n    base_price: 180,\n    pricing_unit: "sqft",\n    image_url: "${images.flooring}"`,
);
seedContent = seedContent.replace(
  /slug: "brushed-brass-wall-panel",[\s\S]*?image_url: ".*?"/g,
  `slug: "brushed-brass-wall-panel",\n    category_slug: "metals",\n    base_price: 520,\n    pricing_unit: "sqmt",\n    image_url: "${images.metals}"`,
);
seedContent = seedContent.replace(
  /slug: "premium-boucle-fabric",[\s\S]*?image_url: ".*?"/g,
  `slug: "premium-boucle-fabric",\n    category_slug: "textiles",\n    base_price: 150,\n    pricing_unit: "sqmt",\n    image_url: "${images.textiles}"`,
);
seedContent = seedContent.replace(
  /slug: "acoustic-slat-wood-panel",[\s\S]*?image_url: ".*?"/g,
  `slug: "acoustic-slat-wood-panel",\n    category_slug: "acoustics",\n    base_price: 210,\n    pricing_unit: "sqft",\n    image_url: "${images.acoustics}"`,
);

fs.writeFileSync("seed.mjs", seedContent);

// also fix mockData.ts with the exact same logic since it's the exact same data structure but exported
let mockContent = fs.readFileSync("src/lib/mockData.ts", "utf8");
// Mock data has variants and stuff which is tricky to regex without breaking structure
// Wait, I can just write a simpler regex for mockData
mockContent = mockContent.replace(
  /image: "https:\/\/images.unsplash.com[^"]*"/g,
  (match) => {
    if (match.includes("1546413642")) return `image: "${images.wood}"`;
    if (match.includes("1505377059067")) return `image: "${images.glass}"`;
    if (match.includes("1615800098779")) return `image: "${images.wallpaper}"`;
    if (match.includes("1565814329452")) return `image: "${images.lighting}"`;
    if (match.includes("1581858726788")) return `image: "${images.flooring}"`;
    if (match.includes("1533090161767")) return `image: "${images.metals}"`;
    if (match.includes("1620000788607")) return `image: "${images.textiles}"`;
    if (match.includes("1582582494705")) return `image: "${images.acoustics}"`;
    return match;
  },
);
// And the variants properties
mockContent = mockContent.replace(
  /: "https:\/\/images.unsplash.com[^"]*"/g,
  (match) => {
    if (match.includes("1546413642")) return `: "${images.wood}"`;
    if (match.includes("1505377059067")) return `: "${images.glass}"`;
    if (match.includes("1615800098779")) return `: "${images.wallpaper}"`;
    if (match.includes("1565814329452")) return `: "${images.lighting}"`;
    if (match.includes("1581858726788")) return `: "${images.flooring}"`;
    if (match.includes("1533090161767")) return `: "${images.metals}"`;
    if (match.includes("1620000788607")) return `: "${images.textiles}"`;
    if (match.includes("1582582494705")) return `: "${images.acoustics}"`;
    return match;
  },
);
fs.writeFileSync("src/lib/mockData.ts", mockContent);

console.log("Replaced urls in seed.mjs and src/lib/mockData.ts");
