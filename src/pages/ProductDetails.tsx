import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../lib/supabase";

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [width, setWidth] = useState<number>(1200);
  const [height, setHeight] = useState<number>(2400);
  const [quantity, setQuantity] = useState<number>(1);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

  const [currentImage, setCurrentImage] = useState<string>("");
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          categories(name),
          product_images(image_url, is_primary)
        `,
        )
        .eq("id", id)
        .single();

      if (data && !error) {
        setProduct(data);
        const primaryImage =
          data.product_images?.find((img: any) => img.is_primary)?.image_url ||
          data.product_images?.[0]?.image_url ||
          `https://loremflickr.com/800/600/abstract?random=${data.id}`;
        setCurrentImage(primaryImage);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Pricing Engine Logic
  useEffect(() => {
    if (!product) return;
    let unitCost = Number(product.base_price);
    let finalPrice = 0;

    const isArea =
      product.pricing_unit === "sqmt" || product.pricing_unit === "sqft";

    if (isArea) {
      // Assuming dimensions in mm, converting to sqft or sqmt
      // If unit is sqft: 1 sqft = 92903 sq mm
      // If unit is sqmt: 1 sqmt = 1,000,000 sq mm
      const area =
        product.pricing_unit === "sqmt"
          ? (width * height) / 1000000
          : (width * height) / 92903;
      finalPrice = area * unitCost * quantity;
    } else {
      finalPrice = unitCost * quantity;
    }

    setEstimatedPrice(Math.round(finalPrice));
  }, [width, height, quantity, product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-md"></div>
          <p className="text-body-md text-slate font-sans">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center">
        <h2 className="text-heading-2 font-serif mb-sm">Product not found</h2>
        <Link to="/catalogue" className="text-brand-accent hover:underline">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const isArea =
    product.pricing_unit === "sqmt" || product.pricing_unit === "sqft";

  return (
    <div className="min-h-screen bg-canvas animate-fade-in">
      <div className="max-w-[1280px] mx-auto px-md md:px-lg py-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-section">
          {/* Visual Preview */}
          <div className="bg-surface-soft rounded-xxxl overflow-hidden border border-hairline-soft lg:sticky lg:top-24 h-[400px] lg:h-[600px] flex items-center justify-center relative shadow-2 hover:shadow-3 transition-shadow">
            <div className="relative w-full h-full group">
              <img
                src={currentImage}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-700 ${isFading ? "opacity-0 scale-100" : "opacity-100 scale-105 group-hover:scale-110"}`}
              />
              <div className="absolute inset-0 bg-ink-deep/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-canvas/95 backdrop-blur p-md rounded-lg shadow-2 text-center border border-hairline-soft transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-caption-bold text-ink-deep mb-xs uppercase tracking-widest font-sans">
                    Live Configuration
                  </p>
                  {isArea && (
                    <p className="text-body-sm text-slate font-sans">
                      {width}mm × {height}mm
                    </p>
                  )}
                  <p className="text-body-sm text-slate font-sans mt-xs">
                    {product.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="flex flex-col animate-slide-up animate-delay-100">
            <div className="mb-xs">
              <span className="text-caption-bold text-brand-accent uppercase tracking-widest mb-xxs block font-sans">
                {product.categories?.name}
              </span>
              <h1 className="text-display-lg text-ink-deep font-serif leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-heading-4 text-slate mb-xl font-serif italic">
              Base: ₹{product.base_price} / {product.pricing_unit}
            </p>

            {product.description && (
              <p className="text-body-md text-charcoal mb-xl font-sans leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="space-y-xl">
              {/* Dimensions */}
              {isArea && (
                <div className="space-y-md bg-surface-soft p-lg rounded-xl border border-hairline-soft">
                  <h3 className="text-heading-4 text-ink-deep font-serif">
                    Dimensions (mm)
                  </h3>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="block text-body-sm-medium text-slate mb-xs font-sans">
                        Width
                      </label>
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        min={100}
                        max={3000}
                        className="font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-body-sm-medium text-slate mb-xs font-sans">
                        Height
                      </label>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        min={100}
                        max={3000}
                        className="font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-md">
                <h3 className="text-heading-4 text-ink-deep font-serif">
                  Quantity
                </h3>
                <div className="flex items-center gap-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full border border-hairline-strong bg-canvas text-ink flex items-center justify-center hover:bg-surface-soft hover:border-slate transition-all font-sans text-lg"
                  >
                    -
                  </button>
                  <span className="text-heading-4 w-8 text-center font-serif">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full border border-hairline-strong bg-canvas text-ink flex items-center justify-center hover:bg-surface-soft hover:border-slate transition-all font-sans text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="mt-section pt-xl border-t border-hairline-strong sticky bottom-0 bg-canvas/95 backdrop-blur py-md z-10">
              <div className="flex items-center justify-between mb-lg">
                <span className="text-heading-3 text-ink-deep font-serif">
                  Estimated Price
                </span>
                <span className="text-display-lg text-brand-accent font-serif font-bold">
                  ₹{estimatedPrice.toLocaleString()}
                </span>
              </div>
              {useAuthStore.getState().profile?.role !== "admin" && (
                <div className="flex gap-md">
                  <Button
                    variant="primary"
                    className="flex-1 text-lg py-[16px] hover:shadow-2 transition-all font-sans"
                    onClick={() => {
                      useCartStore.getState().addItem({
                        productId: product.id,
                        name: product.name,
                        price: estimatedPrice / quantity,
                        quantity,
                        image: currentImage,
                        options: {},
                        dimensions: isArea ? { width, height } : undefined,
                      });
                      alert("Added to cart!");
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-16 flex items-center justify-center border-hairline-strong text-slate hover:text-brand-red-dark hover:border-brand-red-dark hover:bg-brand-rose transition-all"
                    title="Save to Wishlist"
                    onClick={async () => {
                      const authUser = useAuthStore.getState().user;
                      if (!authUser) {
                        alert("Please sign in to save items to your wishlist.");
                        return;
                      }
                      const { error } = await supabase.from("wishlists").insert({
                        user_id: authUser.id,
                        product_id: product.id,
                      });
                      if (error) {
                        alert(
                          "Failed to save to wishlist or item already exists.",
                        );
                      } else {
                        alert("Saved to wishlist!");
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transform hover:scale-110 transition-transform"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
