import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-md">
        <h2 className="text-display-lg text-ink-deep mb-md">Your cart is empty</h2>
        <p className="text-subtitle text-slate mb-xl">Looks like you haven't added any materials yet.</p>
        <Link to="/catalogue">
          <Button variant="primary">Browse Catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-section px-md md:px-lg">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-display-lg text-ink-deep mb-lg">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          <div className="lg:col-span-2 space-y-md">
            {items.map((item) => (
              <Card key={item.id} className="flex flex-col sm:flex-row gap-lg p-lg">
                <div className="w-full sm:w-32 h-32 bg-surface-soft rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-sm">
                      <h3 className="text-heading-4 text-ink-deep">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-body-sm text-slate bg-transparent hover:text-brand-red-dark transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="text-body-sm text-slate space-y-xxs mb-md">
                      {item.dimensions && (
                        <p>Dimensions: {item.dimensions.width}mm × {item.dimensions.height}mm</p>
                      )}
                      {Object.entries(item.options).map(([k, v]) => (
                         <p key={k} className="capitalize">{k}: {v}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-sm">
                       <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-full border border-hairline-strong bg-canvas text-ink flex items-center justify-center hover:bg-surface-soft"
                       >-</button>
                       <span className="text-body-md-medium w-6 text-center">{item.quantity}</span>
                       <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-hairline-strong bg-canvas text-ink flex items-center justify-center hover:bg-surface-soft"
                       >+</button>
                    </div>
                    <span className="text-heading-4 text-ink-deep">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-xl">
              <h3 className="text-heading-3 text-ink-deep mb-lg">Order Summary</h3>
              
              <div className="space-y-sm mb-lg text-body-md text-slate border-b border-hairline-soft pb-md">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery (Estimated)</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-xl">
                <span className="text-heading-4 text-ink-deep">Total</span>
                <span className="text-display-lg text-ink-deep font-bold">₹{total.toLocaleString()}</span>
              </div>
              
              <Link to="/checkout" className="block w-full">
                <Button variant="primary" className="w-full text-lg py-[16px]">
                  Proceed to Checkout
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
