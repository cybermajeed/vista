import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { PillTab } from "../components/ui/Tabs";
import { supabase } from "../lib/supabase";

export function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || "All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogueData = async () => {
      setLoading(true);
      // Fetch categories
      const { data: catData } = await supabase.from('categories').select('name');
      if (catData) {
        setCategories(["All", ...catData.map(c => c.name)]);
      }

      // Fetch active products with images and categories
      const { data: prodData } = await supabase
        .from('products')
        .select(`
          id,
          name,
          base_price,
          pricing_unit,
          categories(name),
          product_images(image_url, is_primary)
        `)
        .eq('is_active', true);
        
      if (prodData) {
        setProducts(prodData);
      }
      setLoading(false);
    };

    fetchCatalogueData();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      const match = categories.find(c => c.toLowerCase() === categoryParam.toLowerCase());
      if (match) setActiveCategory(match);
    } else {
      setActiveCategory("All");
    }
  }, [categoryParam, categories]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category.toLowerCase());
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter((product) => {
    const prodCat = product.categories?.name || "";
    const matchesCategory =
      activeCategory === "All" ||
      prodCat.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-surface py-section px-md md:px-lg border-b border-hairline-soft">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-display-lg text-ink-deep mb-md font-serif">Catalogue</h1>
          <p className="text-subtitle text-slate max-w-2xl mb-xl font-sans">
            Browse our curated collection of premium interior materials. Find
            the perfect fit for your space and customize it to your exact
            specifications.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-md">
            <div className="w-full md:w-96">
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full shadow-1 focus:shadow-2 transition-shadow"
              />
            </div>
            <div className="flex flex-wrap items-center gap-sm w-full pb-2 md:pb-0">
              {categories.map((category) => (
                <PillTab
                  key={category}
                  active={activeCategory === category}
                  onClick={() => handleCategoryChange(category)}
                  className="whitespace-nowrap hover:scale-105 transition-transform"
                >
                  {category}
                </PillTab>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1280px] mx-auto px-md md:px-lg py-section">
        <div className="flex items-center justify-between mb-lg">
          <span className="text-body-md text-slate">
            {loading ? "Loading..." : `${filteredProducts.length} materials found`}
          </span>
          <select className="bg-transparent border border-hairline rounded-md px-sm py-xs text-body-sm-medium text-ink focus:outline-none focus:ring-1 focus:ring-brand-accent cursor-pointer">
            <option>Most popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-section">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-md"></div>
              <p className="text-body-md text-slate">Fetching premium materials...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-xl">
            {filteredProducts.map((product) => {
              const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.image_url 
                || product.product_images?.[0]?.image_url 
                || `https://loremflickr.com/800/600/abstract?random=${product.id}`;

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="block group animate-fade-in"
                >
                  <Card className="p-0 overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-4 hover:-translate-y-1 bg-surface-soft border-hairline-soft">
                    <div className="h-72 bg-surface-soft overflow-hidden relative">
                      <div className="absolute inset-0 bg-ink-deep/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-xl flex-1 flex flex-col bg-canvas z-20">
                      <div className="flex items-start justify-between gap-md mb-md">
                        <div>
                          <span className="text-caption-bold text-brand-accent uppercase tracking-widest mb-xxs block">
                            {product.categories?.name}
                          </span>
                          <h3 className="text-heading-3 font-serif text-ink-deep mb-xs line-clamp-2 group-hover:text-brand-accent transition-colors">
                            {product.name}
                          </h3>
                        </div>
                      </div>
                      <div className="mt-auto pt-md border-t border-hairline-soft">
                        <span className="text-heading-4 font-serif text-ink-deep">
                          ₹{product.base_price}
                        </span>
                        <span className="text-body-sm text-slate uppercase tracking-wider ml-1">
                          / {product.pricing_unit}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-section">
            <h3 className="text-heading-3 text-ink-deep mb-sm">
              No materials found
            </h3>
            <p className="text-body-md text-slate">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
