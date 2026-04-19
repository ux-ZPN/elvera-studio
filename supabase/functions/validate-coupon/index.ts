// @ts-nocheck
/* eslint-disable */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code, subtotal } = await req.json()
    
    // Initialize Supabase Client internally
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Example logic checking 'coupons' table
    const { data: coupon, error } = await supabaseClient
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (error || !coupon) throw new Error('Invalid coupon code')

    if (subtotal < coupon.min_purchase_amount) throw new Error(`Minimum purchase of ₹${coupon.min_purchase_amount} required`)

    let discountValue = 0
    if (coupon.type === 'fixed') {
      discountValue = coupon.value
    } else if (coupon.type === 'percentage') {
      discountValue = (subtotal * coupon.value) / 100
    }

    return new Response(
      JSON.stringify({ valid: true, discount: discountValue, code: coupon.code }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(JSON.stringify({ valid: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
