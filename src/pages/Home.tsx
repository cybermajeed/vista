import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import { getImageUrl } from "../utils";

export function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*").limit(6);
      if (data) {
        setCategories(data);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-canvas animate-fade-in">
      {/* Hero Section */}
      <section className="px-md md:px-lg py-hero max-w-[1280px] mx-auto w-full text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-pricing-featured/40 via-canvas to-canvas -z-10 blur-3xl"></div>
        <h1 className="text-hero-display text-ink-deep mb-md max-w-4xl mx-auto font-serif animate-slide-up">
          Visual Interior Selection{" "}
          <span className="italic text-brand-accent">&</span> Trade Application.
        </h1>
        <p className="text-subtitle text-slate mb-xl max-w-2xl mx-auto animate-slide-up animate-delay-100 font-sans">
          Welcome to VISTA. Discover, customize, and price premium materials for
          your next project. Instant quotes, endless possibilities.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-md animate-slide-up animate-delay-200">
          <Link to="/visualizer">
            <Button
              variant="primary"
              className="shadow-2 hover:shadow-4 hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try AI Room Visualizer</span>
            </Button>
          </Link>
          <Link to="/catalogue">
            <Button
              variant="secondary"
              className="hover:bg-surface-soft transition-colors"
            >
              Browse Catalogue
            </Button>
          </Link>
        </div>
      </section>

      {/* AI Visualizer Showcase Banner */}
      <section className="px-md md:px-lg py-section max-w-[1280px] mx-auto w-full">
        <div className="relative rounded-feature overflow-hidden border border-hairline-strong bg-surface-pricing-featured p-xl md:p-section flex flex-col lg:flex-row items-center justify-between gap-xl shadow-2">
          <div className="max-w-xl">
            <Badge className="bg-brand-yellow border border-brand-yellow-deep/20 text-brand-accent font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-md inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Feature</span>
            </Badge>
            <h2 className="text-display-md text-ink-deep font-serif mb-sm">
              Visualize Materials in Your Actual Space
            </h2>
            <p className="text-body-md text-slate mb-lg leading-relaxed">
              Upload a photograph of any empty room. Our image-to-image AI strictly preserves your walls, windows, and ceiling boundaries while redesigning the space with genuine materials from the VISTA catalogue.
            </p>
            <div className="flex items-center gap-md">
              <Link to="/visualizer">
                <Button variant="primary" className="flex items-center gap-2">
                  <span>Launch Visualizer</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-3 border border-hairline relative aspect-[16/10] bg-canvas group">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
              alt="AI Interior Visualizer Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-3 left-3 bg-ink-deep/80 backdrop-blur-md text-white text-body-xs font-semibold px-sm py-1 rounded-md">
              AI Redesigned Interior Concept
            </div>
            <div className="absolute top-3 right-3 bg-brand-yellow text-primary text-body-xs font-bold px-sm py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-accent" />
              <span>Architectural Preservation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-canvas py-section-lg px-md md:px-lg border-t border-hairline-soft">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-display-lg text-ink-deep mb-section text-center font-serif">
            Explore Materials
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/catalogue?category=${cat.slug}`}
                  className={`block transform transition-all duration-500 hover:-translate-y-2 hover:shadow-4 rounded-xxxl overflow-hidden relative group animate-slide-up`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="absolute inset-0">
                    <img
                      src={getImageUrl(cat.image_url, cat.name)}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 via-ink-deep/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="relative h-[300px] md:h-[400px] flex flex-col justify-between p-xl text-white z-10">
                    <div>
                      <Badge className="bg-white/10 text-white border border-white/20 backdrop-blur-md mb-md px-4 py-1.5 rounded-full text-xs font-sans tracking-widest uppercase shadow-1">
                        {cat.name} Collection
                      </Badge>
                      <h3 className="text-heading-2 font-serif group-hover:text-brand-yellow transition-colors duration-300">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-body-md mt-sm opacity-90 font-sans transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          {cat.description}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-brand-accent rounded-full p-sm shadow-2">
                        <ArrowRight size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-section-lg px-md md:px-lg max-w-[1280px] mx-auto w-full">
        <div className="bg-primary text-on-primary rounded-feature p-section text-center shadow-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-accent/5 group-hover:bg-brand-accent/10 transition-colors duration-500"></div>
          <h2 className="text-heading-1 mb-md font-serif relative z-10">
            Ready to customize?
          </h2>
          <p className="text-subtitle text-on-dark-muted mb-xl max-w-2xl mx-auto font-sans relative z-10">
            Get instant visual previews and real-time pricing for your unique
            configurations.
          </p>
          <Link to="/catalogue" className="relative z-10 inline-block">
            <Button
              variant="on-dark"
              className="hover:scale-105 transition-transform duration-300 shadow-3"
            >
              Start creating
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
