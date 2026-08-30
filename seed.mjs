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
    image_url: "https://images.unsplash.com/photo-1546413642-f81d1912df0f?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Glass",
    slug: "glass",
    description: "Clear, frosted, fluted, and tinted.",
    image_url: "https://images.unsplash.com/photo-1505377059067-e285a7bac49b?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Wallpaper",
    slug: "wallpaper",
    description: "Textured, metallic, and vinyl finishes.",
    image_url: "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Lighting",
    slug: "lighting",
    description: "Pendants, profiles, and chandeliers.",
    image_url: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Flooring",
    slug: "flooring",
    description: "Marble, tiles, SPC, and hardwood options.",
    image_url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Metals",
    slug: "metals",
    description: "Brushed, polished, and matte metal finishes.",
    image_url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Textiles",
    slug: "textiles",
    description: "Premium upholstery, curtains, and rugs.",
    image_url: "https://images.unsplash.com/photo-1620000788607-42299839fcbe?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Acoustics",
    slug: "acoustics",
    description: "Sound absorbing panels and baffles.",
    image_url: "https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&q=80&w=800",
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
    image_url: "https://images.unsplash.com/photo-1505377059067-e285a7bac49b?auto=format&fit=crop&q=80&w=800,texture",
  },
  {
    name: "Geometric Wallpaper",
    slug: "geometric-wallpaper",
    category_slug: "wallpaper",
    base_price: 85,
    pricing_unit: "piece", // rollback unit
    image_url: "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?auto=format&fit=crop&q=80&w=800,pattern",
  },
  {
    name: "Linear Pendant Light",
    slug: "linear-pendant-light",
    category_slug: "lighting",
    base_price: 320,
    pricing_unit: "piece",
    image_url: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=800,modern",
  },
  {
    name: "Calacatta Marble Tile",
    slug: "calacatta-marble-tile",
    category_slug: "flooring",
    base_price: 180,
    pricing_unit: "sqft",
    image_url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Brushed Brass Wall Panel",
    slug: "brushed-brass-wall-panel",
    category_slug: "metals",
    base_price: 520,
    pricing_unit: "sqmt",
    image_url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Premium Boucle Fabric",
    slug: "premium-boucle-fabric",
    category_slug: "textiles",
    base_price: 150,
    pricing_unit: "sqmt",
    image_url: "https://images.unsplash.com/photo-1620000788607-42299839fcbe?auto=format&fit=crop&q=80&w=800,boucle",
  },
  {
    name: "Acoustic Slat Wood Panel",
    slug: "acoustic-slat-wood-panel",
    category_slug: "acoustics",
    base_price: 210,
    pricing_unit: "sqft",
    image_url: "https://images.unsplash.com/photo-1546413642-f81d1912df0f?auto=format&fit=crop&q=80&w=800,slats",
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
