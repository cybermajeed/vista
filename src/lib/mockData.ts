export const MOCK_PRODUCTS: Record<string, any> = {
  "1": {
    id: "1",
    name: "Premium Oak Veneer",
    category: "wood",
    basePrice: 120,
    unit: "sqft",
    image: "/oak_veneer_matte.jpg",
    attributes: [
      {
        id: "a1",
        name: "Thickness",
        type: "select",
        options: [
          { label: "12mm", value: "12", priceAdjustment: 0 },
          { label: "18mm", value: "18", priceAdjustment: 30 },
        ],
      },
      {
        id: "a2",
        name: "Finish",
        type: "select",
        options: [
          { label: "Matte", value: "matte", priceAdjustment: 0 },
          { label: "Gloss", value: "gloss", priceAdjustment: 15 },
        ],
      },
    ],
    pricingRule: "area",
    variants: {
      a2: {
        matte: "/oak_veneer_matte.jpg",
        gloss: "/oak_veneer_gloss.jpg",
      },
    },
  },
  "2": {
    id: "2",
    name: "Walnut Solid Wood",
    category: "wood",
    basePrice: 250,
    unit: "sqft",
    image: "/walnut_solid.jpg",
    attributes: [
      {
        id: "a1",
        name: "Thickness",
        type: "select",
        options: [
          { label: "20mm", value: "20", priceAdjustment: 0 },
          { label: "30mm", value: "30", priceAdjustment: 50 },
        ],
      },
      {
        id: "a2",
        name: "Grade",
        type: "select",
        options: [
          { label: "Standard", value: "standard", priceAdjustment: 0 },
          { label: "Premium", value: "premium", priceAdjustment: 100 },
        ],
      },
    ],
    pricingRule: "area",
  },
  "3": {
    id: "3",
    name: "Fluted Glass Panel",
    category: "glass",
    basePrice: 450,
    unit: "sqmt",
    image: "https://loremflickr.com/800/600/glass,texture",
    attributes: [
      {
        id: "a1",
        name: "Thickness",
        type: "select",
        options: [
          { label: "8mm", value: "8", priceAdjustment: 0 },
          { label: "12mm", value: "12", priceAdjustment: 100 },
        ],
      },
      {
        id: "a2",
        name: "Tint",
        type: "select",
        options: [
          { label: "Clear", value: "clear", priceAdjustment: 0 },
          { label: "Bronze", value: "bronze", priceAdjustment: 50 },
        ],
      },
    ],
    pricingRule: "area",
    variants: {
      a2: {
        clear: "https://loremflickr.com/800/600/glass,texture",
        bronze: "https://loremflickr.com/800/600/glass,bronze,texture",
      },
    },
  },
  "4": {
    id: "4",
    name: "Geometric Wallpaper",
    category: "wallpaper",
    basePrice: 85,
    unit: "roll",
    image:
      "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?auto=format&fit=crop&q=80&w=800",
    attributes: [
      {
        id: "a1",
        name: "Material",
        type: "select",
        options: [
          { label: "Vinyl", value: "vinyl", priceAdjustment: 0 },
          { label: "Fabric", value: "fabric", priceAdjustment: 25 },
        ],
      },
    ],
    pricingRule: "unit",
    variants: {
      a1: {
        vinyl:
          "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?auto=format&fit=crop&q=80&w=800",
        fabric: "https://loremflickr.com/800/600/fabric,texture",
      },
    },
  },
  "5": {
    id: "5",
    name: "Linear Pendant Light",
    category: "lighting",
    basePrice: 320,
    unit: "piece",
    image:
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=800",
    attributes: [
      {
        id: "a1",
        name: "Color Temp",
        type: "select",
        options: [
          { label: "Warm (3000K)", value: "warm", priceAdjustment: 0 },
          { label: "Cool (4000K)", value: "cool", priceAdjustment: 0 },
        ],
      },
      {
        id: "a2",
        name: "Length",
        type: "select",
        options: [
          { label: "1200mm", value: "1200", priceAdjustment: 0 },
          { label: "1800mm", value: "1800", priceAdjustment: 80 },
        ],
      },
    ],
    pricingRule: "unit",
    variants: {
      a1: {
        warm: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=800",
        cool: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
      },
    },
  },
  "6": {
    id: "6",
    name: "Calacatta Marble Tile",
    category: "flooring",
    basePrice: 180,
    unit: "sqft",
    image: "https://loremflickr.com/800/600/marble,texture",
    attributes: [
      {
        id: "a1",
        name: "Size",
        type: "select",
        options: [
          { label: "600x600mm", value: "600", priceAdjustment: 0 },
          { label: "800x800mm", value: "800", priceAdjustment: 40 },
        ],
      },
      {
        id: "a2",
        name: "Finish",
        type: "select",
        options: [
          { label: "Honed", value: "honed", priceAdjustment: 0 },
          { label: "Polished", value: "polished", priceAdjustment: 20 },
        ],
      },
    ],
    pricingRule: "area",
    variants: {
      a2: {
        honed: "https://loremflickr.com/800/600/marble,texture",
        polished: "https://loremflickr.com/800/600/marble,polished,texture",
      },
    },
  },
  "7": {
    id: "7",
    name: "Brushed Brass Wall Panel",
    category: "metals",
    basePrice: 520,
    unit: "sqmt",
    image: "https://loremflickr.com/800/600/brass,metal",
    attributes: [
      {
        id: "a1",
        name: "Finish",
        type: "select",
        options: [
          { label: "Brushed", value: "brushed", priceAdjustment: 0 },
          { label: "Polished", value: "polished", priceAdjustment: 80 },
        ],
      },
    ],
    pricingRule: "area",
    variants: {
      a1: {
        brushed: "https://loremflickr.com/800/600/brass,metal",
        polished: "https://loremflickr.com/800/600/brass,polished",
      },
    },
  },
  "8": {
    id: "8",
    name: "Premium Boucle Fabric",
    category: "textiles",
    basePrice: 150,
    unit: "sqmt",
    image: "https://loremflickr.com/800/600/fabric,boucle",
    attributes: [
      {
        id: "a1",
        name: "Color",
        type: "select",
        options: [
          { label: "Ivory", value: "ivory", priceAdjustment: 0 },
          { label: "Charcoal", value: "charcoal", priceAdjustment: 0 },
        ],
      },
    ],
    pricingRule: "area",
  },
  "9": {
    id: "9",
    name: "Acoustic Slat Wood Panel",
    category: "acoustics",
    basePrice: 210,
    unit: "sqft",
    image: "https://loremflickr.com/800/600/wood,slats",
    attributes: [
      {
        id: "a1",
        name: "Wood Type",
        type: "select",
        options: [
          { label: "Oak", value: "oak", priceAdjustment: 0 },
          { label: "Walnut", value: "walnut", priceAdjustment: 40 },
        ],
      },
    ],
    pricingRule: "area",
  },
};
