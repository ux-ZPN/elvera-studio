-- ELVÉRA STUDIO MASTER SCHEMA
-- Last Updated: 2026-04-19

-- ==========================================
-- 1. ORDERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT NOT NULL,
    total_amount DECIMAL NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    tracking_number TEXT,
    shipping_address TEXT,
    phone TEXT
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow users to place orders
CREATE POLICY "Allow public insertions" 
ON public.orders FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow users to view their own history (Standard query)
CREATE POLICY "Users view own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() IS NOT NULL AND email = auth.jwt()->>'email');

-- ==========================================
-- 2. SECURE TRACKING FUNCTION (RPC)
-- ==========================================
-- This allows guest tracking by Email + Order ID without opening the whole table
CREATE OR REPLACE FUNCTION track_order(input_email TEXT, input_id_prefix TEXT)
RETURNS SETOF public.orders AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.orders
  WHERE email = input_email
  AND id::text LIKE (input_id_prefix || '%')
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================
-- 3. PRODUCTS TABLE (If you are using Supabase for Products)
-- ==========================================
-- CREATE TABLE IF NOT EXISTS public.products (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     title TEXT,
--     handle TEXT UNIQUE,
--     description TEXT,
--     price DECIMAL,
--     images JSONB,
--     available BOOLEAN DEFAULT true
-- );
-- ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public Read Access" ON public.products FOR SELECT TO public USING (true);
