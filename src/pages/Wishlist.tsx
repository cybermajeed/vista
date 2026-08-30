import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Trash2, ArrowRight } from 'lucide-react';

export function Wishlist() {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchWishlist = async () => {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          products (
            id,
            name,
            base_price,
            pricing_unit,
            category_id,
            categories ( name )
          )
        `)
        .eq('user_id', user.id);

      if (!error && data) {
        setWishlistItems(data);
      }
      setLoadingItems(false);
    };

    fetchWishlist();
  }, [user, isLoading, navigate]);

  const removeFromWishlist = async (id: string) => {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setWishlistItems(prev => prev.filter(item => item.id !== id));
    }
  };

  if (isLoading || loadingItems) {
    return <div className="min-h-screen bg-canvas flex items-center justify-center">Loading wishlist...</div>;
  }

  return (
    <div className="min-h-screen bg-canvas py-section px-md md:px-lg animate-fade-in">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-display-lg text-ink-deep mb-lg font-serif">Your Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <Card className="p-xl text-center">
            <h2 className="text-heading-3 text-ink-deep mb-sm font-serif">Your wishlist is empty</h2>
            <p className="text-body-md text-slate mb-lg">Save items you love here to easily find them later.</p>
            <Link to="/catalogue">
              <Button variant="primary">Browse Catalogue</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="p-0 overflow-hidden flex flex-col group animate-slide-up">
                <div className="relative h-64 bg-surface-soft">
                  <div className="absolute top-md right-md z-10">
                    <button 
                      onClick={(e) => { e.preventDefault(); removeFromWishlist(item.id); }}
                      className="w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-hairline-strong flex items-center justify-center text-slate hover:text-brand-red-dark transition-colors shadow-1"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {/* Real app would use product image */}
                  <img 
                    src={`https://loremflickr.com/800/600/abstract?random=${item.product_id}`} 
                    alt={item.products.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-lg flex-1 flex flex-col">
                  <div className="mb-md">
                    <h3 className="text-heading-4 text-ink-deep mb-xs line-clamp-1">{item.products.name}</h3>
                    <span className="text-caption-bold text-slate uppercase">{item.products.categories?.name || 'Category'}</span>
                  </div>
                  <div className="mt-auto pt-md border-t border-hairline-soft flex items-center justify-between">
                    <div>
                      <span className="text-heading-4 text-ink-deep font-serif">₹{item.products.base_price}</span>
                      <span className="text-body-sm text-slate"> / {item.products.pricing_unit}</span>
                    </div>
                    <Link to={`/product/${item.product_id}`} className="text-brand-accent hover:text-accent-pressed">
                      <ArrowRight size={24} />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
