import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  {
    name: "Wood",
    slug: "wood",
    description: "Solid, engineered, and veneers.",
    image_url: "https://loremflickr.com/800/600/wood",
  },
  {
    name: "Glass",
    slug: "glass",
    description: "Clear, frosted, fluted, and tinted.",
    image_url: "https://loremflickr.com/800/600/glass",
  },
  {
    name: "Wallpaper",
    slug: "wallpaper",
    description: "Textured, metallic, and vinyl finishes.",
    image_url: "https://loremflickr.com/800/600/wallpaper",
  },
  {
    name: "Lighting",
    slug: "lighting",
    description: "Pendants, profiles, and chandeliers.",
    image_url: "https://loremflickr.com/800/600/lighting",
  },
  {
    name: "Flooring",
    slug: "flooring",
    description: "Marble, tiles, SPC, and hardwood options.",
    image_url: "https://loremflickr.com/800/600/flooring",
  },
  {
    name: "Metals",
    slug: "metals",
    description: "Brushed, polished, and matte metal finishes.",
    image_url: "https://loremflickr.com/800/600/metal",
  },
  {
    name: "Textiles",
    slug: "textiles",
    description: "Premium upholstery, curtains, and rugs.",
    image_url: "https://loremflickr.com/800/600/fabric",
  },
  {
    name: "Acoustics",
    slug: "acoustics",
    description: "Sound absorbing panels and baffles.",
    image_url: "https://loremflickr.com/800/600/acoustic",
  },
];

const products = [
  {
    name: "Premium Oak Veneer",
    slug: "premium-oak-veneer",
    category_slug: "wood",
    base_price: 120,
    pricing_unit: "sqft",
    image_url: "/oak_veneer_matte.jpg",
  },
  {
    name: "Walnut Solid Wood",
    slug: "walnut-solid-wood",
    category_slug: "wood",
    base_price: 250,
    pricing_unit: "sqft",
    image_url: "/walnut_solid.jpg",
  },
  {
    name: "Fluted Glass Panel",
    slug: "fluted-glass-panel",
    category_slug: "glass",
    base_price: 450,
    pricing_unit: "sqmt",
    image_url: "https://loremflickr.com/800/600/glass,texture",
  },
  {
    name: "Geometric Wallpaper",
    slug: "geometric-wallpaper",
    category_slug: "wallpaper",
    base_price: 85,
    pricing_unit: "piece", // rollback unit
    image_url: "https://loremflickr.com/800/600/wallpaper,pattern",
  },
  {
    name: "Linear Pendant Light",
    slug: "linear-pendant-light",
    category_slug: "lighting",
    base_price: 320,
    pricing_unit: "piece",
    image_url: "https://loremflickr.com/800/600/lighting,modern",
  },
  {
    name: "Calacatta Marble Tile",
    slug: "calacatta-marble-tile",
    category_slug: "flooring",
    base_price: 180,
    pricing_unit: "sqft",
    image_url: "https://loremflickr.com/800/600/marble,texture",
  },
  {
    name: "Brushed Brass Wall Panel",
    slug: "brushed-brass-wall-panel",
    category_slug: "metals",
    base_price: 520,
    pricing_unit: "sqmt",
    image_url: "https://loremflickr.com/800/600/brass,metal",
  },
  {
    name: "Premium Boucle Fabric",
    slug: "premium-boucle-fabric",
    category_slug: "textiles",
    base_price: 150,
    pricing_unit: "sqmt",
    image_url: "https://loremflickr.com/800/600/fabric,boucle",
  },
  {
    name: "Acoustic Slat Wood Panel",
    slug: "acoustic-slat-wood-panel",
    category_slug: "acoustics",
    base_price: 210,
    pricing_unit: "sqft",
    image_url: "https://loremflickr.com/800/600/wood,slats",
  },
];

async function seed() {
  console.log("Starting seed...");

  // 1. Insert Categories
  const categoryMap = {};
  for (const cat of categories) {
    const { data, error } = await supabase
      .from("categories")
      .upsert(
        {
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          image_url: cat.image_url,
        },
        { onConflict: "slug" },
      )
      .select()
      .single();
    if (error) {
      console.error("Error upserting category", cat.slug, error);
      continue;
    }
    categoryMap[cat.slug] = data.id;
    console.log(`Upserted category: ${cat.name}`);
  }

  // 2. Insert Products
  for (const prod of products) {
    const category_id = categoryMap[prod.category_slug];
    if (!category_id) {
      console.warn(`Missing category for product ${prod.slug}`);
      continue;
    }

    const { data: productData, error: productError } = await supabase
      .from("products")
      .upsert(
        {
          slug: prod.slug,
          name: prod.name,
          category_id,
          base_price: prod.base_price,
          pricing_unit: prod.pricing_unit,
        },
        { onConflict: "slug" },
      )
      .select()
      .single();

    if (productError) {
      console.error(`Error upserting product ${prod.slug}`, productError);
      continue;
    }
    console.log(`Upserted product: ${prod.name}`);

    // Insert primary image
    await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productData.id);
    await supabase.from("product_images").insert({
      product_id: productData.id,
      image_url: prod.image_url,
      is_primary: true,
    });
  }

  console.log("Seed complete.");
}

seed().catch(console.error);
