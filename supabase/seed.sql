-- seed.sql
-- Run this in your Supabase SQL Editor to populate initial categories and products

-- CATEGORIES
INSERT INTO categories (name, slug, description, image_url) VALUES
('Wood', 'wood', 'Solid, engineered, and veneers.', 'https://loremflickr.com/800/600/wood'),
('Glass', 'glass', 'Clear, frosted, fluted, and tinted.', 'https://loremflickr.com/800/600/glass'),
('Wallpaper', 'wallpaper', 'Textured, metallic, and vinyl finishes.', 'https://loremflickr.com/800/600/wallpaper'),
('Lighting', 'lighting', 'Pendants, profiles, and chandeliers.', 'https://loremflickr.com/800/600/lighting'),
('Flooring', 'flooring', 'Marble, tiles, SPC, and hardwood options.', 'https://loremflickr.com/800/600/flooring'),
('Metals', 'metals', 'Brushed, polished, and matte metal finishes.', 'https://loremflickr.com/800/600/metal'),
('Textiles', 'textiles', 'Premium upholstery, curtains, and rugs.', 'https://loremflickr.com/800/600/fabric'),
('Acoustics', 'acoustics', 'Sound absorbing panels and baffles.', 'https://loremflickr.com/800/600/acoustic')
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- PRODUCTS
-- Premium Oak Veneer
INSERT INTO products (category_id, name, slug, base_price, pricing_unit)
SELECT id, 'Premium Oak Veneer', 'premium-oak-veneer', 120, 'sqft' FROM categories WHERE slug = 'wood'
ON CONFLICT (slug) DO NOTHING;

-- Walnut Solid Wood
INSERT INTO products (category_id, name, slug, base_price, pricing_unit)
SELECT id, 'Walnut Solid Wood', 'walnut-solid-wood', 250, 'sqft' FROM categories WHERE slug = 'wood'
ON CONFLICT (slug) DO NOTHING;

-- Fluted Glass Panel
INSERT INTO products (category_id, name, slug, base_price, pricing_unit)
SELECT id, 'Fluted Glass Panel', 'fluted-glass-panel', 450, 'sqmt' FROM categories WHERE slug = 'glass'
ON CONFLICT (slug) DO NOTHING;

-- Geometric Wallpaper
INSERT INTO products (category_id, name, slug, base_price, pricing_unit)
SELECT id, 'Geometric Wallpaper', 'geometric-wallpaper', 85, 'piece' FROM categories WHERE slug = 'wallpaper'
ON CONFLICT (slug) DO NOTHING;

-- Linear Pendant Light
INSERT INTO products (category_id, name, slug, base_price, pricing_unit)
SELECT id, 'Linear Pendant Light', 'linear-pendant-light', 320, 'piece' FROM categories WHERE slug = 'lighting'
ON CONFLICT (slug) DO NOTHING;

-- Calacatta Marble Tile
INSERT INTO products (category_id, name, slug, base_price, pricing_unit)
SELECT id, 'Calacatta Marble Tile', 'calacatta-marble-tile', 180, 'sqft' FROM categories WHERE slug = 'flooring'
ON CONFLICT (slug) DO NOTHING;

-- Brushed Brass Wall Panel
INSERT INTO products (category_id, name, slug, base_price, pricing_unit)
SELECT id, 'Brushed Brass Wall Panel', 'brushed-brass-wall-panel', 520, 'sqmt' FROM categories WHERE slug = 'metals'
ON CONFLICT (slug) DO NOTHING;

-- Premium Boucle Fabric
INSERT INTO products (category_id, name, slug, base_price, pricing_unit)
SELECT id, 'Premium Boucle Fabric', 'premium-boucle-fabric', 150, 'sqmt' FROM categories WHERE slug = 'textiles'
ON CONFLICT (slug) DO NOTHING;

-- Acoustic Slat Wood Panel
INSERT INTO products (category_id, name, slug, base_price, pricing_unit)
SELECT id, 'Acoustic Slat Wood Panel', 'acoustic-slat-wood-panel', 210, 'sqft' FROM categories WHERE slug = 'acoustics'
ON CONFLICT (slug) DO NOTHING;

-- IMAGES
INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, '/oak_veneer_matte.jpg', true FROM products WHERE slug = 'premium-oak-veneer'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, '/walnut_solid.jpg', true FROM products WHERE slug = 'walnut-solid-wood'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, 'https://loremflickr.com/800/600/glass,texture', true FROM products WHERE slug = 'fluted-glass-panel'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, 'https://loremflickr.com/800/600/wallpaper,pattern', true FROM products WHERE slug = 'geometric-wallpaper'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, 'https://loremflickr.com/800/600/lighting,modern', true FROM products WHERE slug = 'linear-pendant-light'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, 'https://loremflickr.com/800/600/marble,texture', true FROM products WHERE slug = 'calacatta-marble-tile'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, 'https://loremflickr.com/800/600/brass,metal', true FROM products WHERE slug = 'brushed-brass-wall-panel'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, 'https://loremflickr.com/800/600/fabric,boucle', true FROM products WHERE slug = 'premium-boucle-fabric'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, 'https://loremflickr.com/800/600/wood,slats', true FROM products WHERE slug = 'acoustic-slat-wood-panel'
ON CONFLICT DO NOTHING;

-- ATTRIBUTES  
INSERT INTO attributes (name, type) VALUES ('Thickness', 'select'), ('Finish', 'select'), ('Grade', 'select'), ('Tint', 'select'), ('Material', 'select'), ('Color Temp', 'select'), ('Length', 'select'), ('Size', 'select') ON CONFLICT DO NOTHING;
