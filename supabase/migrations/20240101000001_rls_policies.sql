-- 01_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- PROFILES
-- Users can view and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Admins can view and edit all profiles
CREATE POLICY "Admins can do everything on profiles" ON profiles FOR ALL USING (is_admin());


-- PUBLIC CATALOGUE (Read-only for everyone)
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON products FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can view attributes" ON attributes FOR SELECT USING (true);
CREATE POLICY "Public can view attribute options" ON attribute_options FOR SELECT USING (true);
CREATE POLICY "Public can view product attributes" ON product_attributes FOR SELECT USING (true);
CREATE POLICY "Public can view inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Public can view reviews" ON reviews FOR SELECT USING (true);


-- CATALOGUE ADMIN ACCESS (Full access to admins)
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage product images" ON product_images FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage attributes" ON attributes FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage attribute options" ON attribute_options FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage product attributes" ON product_attributes FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage pricing rules" ON pricing_rules FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage inventory" ON inventory FOR ALL USING (is_admin());


-- PRICING RULES (Read for logged in users to calculate price, full for admins)
CREATE POLICY "Public can read pricing rules" ON pricing_rules FOR SELECT USING (true);


-- CARTS & CART ITEMS
-- Users manage their own carts
CREATE POLICY "Users can manage own cart" ON carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts WHERE id = cart_items.cart_id AND user_id = auth.uid())
);


-- ADDRESSES
-- Users manage their own addresses
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);


-- ORDERS & ORDER ITEMS
-- Users can read their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Order items
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
-- Admins can manage all orders
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL USING (is_admin());


-- PAYMENTS
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = payments.order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create own payments" ON payments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = payments.order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage payments" ON payments FOR ALL USING (is_admin());


-- WISHLISTS
CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);


-- REVIEWS
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage reviews" ON reviews FOR ALL USING (is_admin());


-- ENQUIRIES
CREATE POLICY "Anyone can insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own enquiries" ON enquiries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage enquiries" ON enquiries FOR ALL USING (is_admin());


-- TRIGGER to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
