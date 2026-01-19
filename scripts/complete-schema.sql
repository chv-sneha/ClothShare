-- Complete ClothShare Database Schema

-- Donations table for tracking all donations
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  clothes_type TEXT NOT NULL,
  gender TEXT NOT NULL,
  season TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  condition TEXT NOT NULL,
  pickup_or_drop TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  images TEXT[],
  notes TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'matched', 'pickup_scheduled', 'picked', 'delivered')),
  matched_center_id UUID REFERENCES donation_centers(id),
  pickup_date TIMESTAMP,
  delivered_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  center_id UUID REFERENCES donation_centers(id),
  role TEXT DEFAULT 'center_admin' CHECK (role IN ('super_admin', 'center_admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add pickup availability to donation centers
ALTER TABLE donation_centers 
ADD COLUMN IF NOT EXISTS pickup_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS google_maps_link TEXT;

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own donations" ON donations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own donations" ON donations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view center donations" ON donations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (center_id = donations.matched_center_id OR role = 'super_admin')
    )
  );

CREATE POLICY "Admins can update center donations" ON donations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (center_id = donations.matched_center_id OR role = 'super_admin')
    )
  );