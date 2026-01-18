-- Create profiles table for user information
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    location_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donation centers table
CREATE TABLE public.donation_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- orphanage, old-age-home, shelter, ngo
    description TEXT,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    image_url TEXT,
    needs_gender TEXT[] DEFAULT '{}', -- men, women, children, unisex
    needs_types TEXT[] DEFAULT '{}', -- t-shirt, shirt, pants, etc.
    needs_season TEXT[] DEFAULT '{}', -- summer, winter, all-season
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table to track user donations
CREATE TABLE public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    center_id UUID REFERENCES public.donation_centers(id) ON DELETE SET NULL,
    items JSONB NOT NULL DEFAULT '[]', -- Array of clothing items
    status TEXT DEFAULT 'pending', -- pending, scheduled, in-transit, delivered
    scheduled_date DATE,
    notes TEXT,
    ai_match_reason TEXT,
    match_score NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Donation centers policies (public read, admin write)
CREATE POLICY "Anyone can view active donation centers"
ON public.donation_centers FOR SELECT
USING (is_active = true);

-- Donations policies
CREATE POLICY "Users can view their own donations"
ON public.donations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own donations"
ON public.donations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donations"
ON public.donations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own donations"
ON public.donations FOR DELETE
USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donation_centers_updated_at
BEFORE UPDATE ON public.donation_centers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
BEFORE UPDATE ON public.donations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();