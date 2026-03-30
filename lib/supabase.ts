import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ruxakjimpfsxvxhptldw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1eGFramltcGZzeHZ4aHB0bGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODc0MDIsImV4cCI6MjA5MDQ2MzQwMn0.mtWHUMyLPyFWSy_EcXrt30A5J_EGGTAd-t0xdBWBRGA'
export const supabase = createClient(supabaseUrl, supabaseKey)
