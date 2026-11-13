import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Sparkles, Tag } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import type { MatchedProduct } from "../../store/visualizerStore";

interface MatchedProductsSectionProps {
  products: MatchedProduct[];
  designSummary?: string | null;
}

export const MatchedProductsSection: React.FC<MatchedProductsSectionProps> = ({
  products,
  designSummary
}) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-xl pt-xl border-t border-hairline-soft">
      {/* Header with clear concept vs product distinction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-lg gap-sm">
        <div>
          <div className="flex items-center gap-xs text-brand-accent font-semibold text-body-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Catalogue Integration</span>
          </div>
          <h3 className="text-heading-3 text-ink-deep font-serif">
            Matching VISTA Materials & Products
          </h3>
          <p className="text-body-sm text-slate mt-1 max-w-2xl">
            Our AI visualizer detected key architectural finishes in this concept. Below are the authentic, purchasable materials from the VISTA catalogue to bring this interior to life.
          </p>
        </div>

        {/* Clear Concept vs Purchasable badge */}
        <div className="flex-shrink-0 bg-surface-pricing-featured border border-brand-yellow px-md py-sm rounded-lg flex items-center gap-xs">
          <CheckCircle2 className="w-4 h-4 text-brand-accent" />
          <span className="text-body-xs-medium text-ink-deep">
            Genuine Purchasable Catalogue Items
          </span>
        </div>
      </div>

      {designSummary && (
        <div className="mb-lg p-md rounded-lg bg-surface-soft border border-hairline text-body-sm text-slate italic">
          "{designSummary}"
        </div>
      )}

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {products.map((item) => (
          <Card
            key={item.id}
            className="group flex flex-col justify-between overflow-hidden border border-hairline-strong hover:border-brand-accent transition-all duration-200 hover:shadow-md"
          >
            <div>
              {/* Image with Category Badge */}
              <div className="relative aspect-[4/3] bg-surface overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="tag-yellow">
                    {item.category}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-md">
                <h4 className="text-body-md font-semibold text-ink-deep group-hover:text-brand-accent transition-colors">
                  {item.name}
                </h4>
                <div className="flex items-baseline gap-1 mt-1 text-ink-deep font-medium">
                  <span className="text-body-md">₹{item.base_price}</span>
                  <span className="text-body-xs text-slate">/ {item.pricing_unit}</span>
                </div>
                {item.matchedReason && (
                  <p className="mt-2 text-[12px] text-slate line-clamp-2 bg-surface p-1.5 rounded flex items-start gap-1">
                    <Tag className="w-3 h-3 text-brand-accent flex-shrink-0 mt-0.5" />
                    <span>{item.matchedReason}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Action */}
            <div className="p-md pt-0">
              <Link
                to={`/product/${item.slug}`}
                className="w-full flex items-center justify-center gap-xs px-md py-sm rounded-lg bg-surface-soft hover:bg-surface-pricing-featured text-ink hover:text-brand-accent border border-hairline transition-colors text-body-xs font-semibold"
              >
                <span>View Material Specs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
