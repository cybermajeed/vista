import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const total = getTotal();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order placement
    setTimeout(() => {
      clearCart();
      alert('Order placed successfully! In a real app, this would redirect to a confirmation page with an order ID.');
      navigate('/dashboard'); // Mocking redirect to orders
    }, 1000);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-canvas py-section px-md md:px-lg">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-display-lg text-ink-deep mb-lg">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          <div>
            <Card className="p-xl mb-xl">
              <h2 className="text-heading-3 text-ink-deep mb-lg">Shipping Information</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-md">
                <div className="grid grid-cols-2 gap-md">
                  <div>
                    <label className="block text-body-sm-medium text-slate mb-xs">First Name</label>
                    <Input required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-body-sm-medium text-slate mb-xs">Last Name</label>
                    <Input required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-body-sm-medium text-slate mb-xs">Email</label>
                  <Input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-body-sm-medium text-slate mb-xs">Street Address</label>
                  <Input required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="grid grid-cols-3 gap-md">
                  <div className="col-span-1">
                    <label className="block text-body-sm-medium text-slate mb-xs">City</label>
                    <Input required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-body-sm-medium text-slate mb-xs">State</label>
                    <Input required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-body-sm-medium text-slate mb-xs">ZIP</label>
                    <Input required value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} />
                  </div>
                </div>
              </form>
            </Card>

            <Card className="p-xl">
              <h2 className="text-heading-3 text-ink-deep mb-lg">Payment</h2>
              <div className="bg-surface-soft p-md rounded-md border border-hairline mb-md">
                <p className="text-body-md text-ink">Pay on Delivery / Invoice</p>
                <p className="text-body-sm text-slate mt-xs">For this demonstration, payment will be collected after order confirmation.</p>
              </div>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24 p-xl">
              <h2 className="text-heading-3 text-ink-deep mb-lg">Order Summary</h2>
              <div className="space-y-md mb-lg">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-body-md text-ink">
                    <span className="flex-1 pr-4">{item.quantity}x {item.name}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-hairline-soft pt-md space-y-sm mb-lg text-body-md text-slate">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₹1,500</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-xl border-t border-hairline-strong pt-md">
                <span className="text-heading-4 text-ink-deep">Total</span>
                <span className="text-display-lg text-ink-deep font-bold">₹{(total + 1500).toLocaleString()}</span>
              </div>
              
              <Button type="submit" form="checkout-form" variant="primary" className="w-full text-lg py-[16px]">
                Confirm Order
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
