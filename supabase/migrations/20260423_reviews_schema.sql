-- Migration: Add Reviews and Update Orders
-- Date: 2026-04-23

-- 1. Update orders table to include items JSONB
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;

-- 2. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    product_handle TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
    is_verified_purchase BOOLEAN DEFAULT false
);

-- 3. Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. Policies for reviews
-- Everyone can read reviews
CREATE POLICY "Public Read Reviews" 
ON public.reviews FOR SELECT 
TO public 
USING (true);

-- Authenticated users can insert their own reviews
CREATE POLICY "Authenticated Insert Reviews" 
ON public.reviews FOR INSERT 
TO authenticated 
WITH CHECK (auth.jwt()->>'email' = user_email);

-- 5. Storage setup instructions (Cannot be done via SQL easily in all environments, but metadata part)
-- Note: User needs to create a 'review-images' bucket in Supabase Storage with public access.
