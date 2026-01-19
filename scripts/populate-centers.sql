-- Run this SQL in your Supabase SQL Editor to populate donation centers

INSERT INTO donation_centers (
  name, type, address, latitude, longitude, phone, email, description, 
  image_url, priority, needs_types, needs_gender, needs_season, is_active
) VALUES 
-- Mumbai Centers
('Hope Children''s Home', 'orphanage', 'Andheri East, Mumbai, Maharashtra 400069', 19.1136, 72.8697, '+91-9876543210', 'contact@hopechildrenshome.org', 'Caring for 80+ underprivileged children, providing education and shelter', '/images/hope-children-home.jpg', 'high', ARRAY['t-shirt', 'pants', 'dress', 'shoes', 'jacket'], ARRAY['children', 'unisex'], ARRAY['all-season', 'winter'], true),

('Mumbai Senior Care Center', 'old-age-home', 'Bandra West, Mumbai, Maharashtra 400050', 19.0596, 72.8295, '+91-9876543211', 'info@mumbaiseniorcare.org', 'Home for 60+ elderly citizens providing medical care and comfort', '/images/senior-care-mumbai.jpg', 'medium', ARRAY['shirt', 'pants', 'sweater', 'shawl'], ARRAY['men', 'women'], ARRAY['winter', 'all-season'], true),

('Shelter for All Mumbai', 'shelter', 'Dharavi, Mumbai, Maharashtra 400017', 19.0430, 72.8570, '+91-9876543212', 'help@shelterforall.org', 'Emergency shelter providing temporary housing for homeless individuals', '/images/shelter-mumbai.jpg', 'high', ARRAY['t-shirt', 'pants', 'jacket', 'blanket', 'shoes'], ARRAY['men', 'women', 'children'], ARRAY['all-season', 'winter'], true),

-- Delhi Centers
('Delhi Children Foundation', 'orphanage', 'Lajpat Nagar, New Delhi, Delhi 110024', 28.5665, 77.2432, '+91-9876543213', 'contact@delhichildren.org', 'Supporting 120+ children with education, healthcare and nutrition', '/images/delhi-children.jpg', 'high', ARRAY['uniform', 't-shirt', 'pants', 'dress', 'shoes', 'sweater'], ARRAY['children'], ARRAY['all-season', 'winter', 'summer'], true),

('Helping Hands NGO', 'ngo', 'Karol Bagh, New Delhi, Delhi 110005', 28.6519, 77.1909, '+91-9876543214', 'support@helpinghands.org', 'Community outreach program serving 500+ families in need', '/images/helping-hands.jpg', 'medium', ARRAY['t-shirt', 'shirt', 'pants', 'dress', 'jacket'], ARRAY['men', 'women', 'children', 'unisex'], ARRAY['all-season'], true),

-- Bangalore Centers
('Bangalore Care Home', 'old-age-home', 'Koramangala, Bangalore, Karnataka 560034', 12.9279, 77.6271, '+91-9876543215', 'care@bangalorecare.org', 'Specialized care for 45+ senior citizens with medical facilities', '/images/bangalore-care.jpg', 'medium', ARRAY['shirt', 'pants', 'sweater', 'shawl'], ARRAY['men', 'women'], ARRAY['winter', 'all-season'], true),

('Tech City Shelter', 'shelter', 'Electronic City, Bangalore, Karnataka 560100', 12.8456, 77.6603, '+91-9876543216', 'contact@techcityshelter.org', 'Modern shelter facility for migrant workers and homeless individuals', '/images/tech-shelter.jpg', 'high', ARRAY['t-shirt', 'pants', 'jacket', 'shoes'], ARRAY['men', 'women'], ARRAY['all-season'], true),

-- Chennai Centers
('Chennai Children''s Trust', 'orphanage', 'T. Nagar, Chennai, Tamil Nadu 600017', 13.0418, 80.2341, '+91-9876543217', 'info@chennaichildren.org', 'Educational and residential support for 90+ underprivileged children', '/images/chennai-children.jpg', 'high', ARRAY['uniform', 't-shirt', 'pants', 'dress', 'shoes'], ARRAY['children'], ARRAY['summer', 'all-season'], true),

('Marina Beach Outreach', 'ngo', 'Marina Beach, Chennai, Tamil Nadu 600013', 13.0475, 80.2824, '+91-9876543218', 'outreach@marinabeach.org', 'Beach cleanup and community service organization', '/images/marina-outreach.jpg', 'low', ARRAY['t-shirt', 'pants', 'cap', 'shoes'], ARRAY['men', 'women', 'unisex'], ARRAY['summer', 'all-season'], true),

-- Hyderabad Centers
('Hyderabad Senior Living', 'old-age-home', 'Banjara Hills, Hyderabad, Telangana 500034', 17.4126, 78.4071, '+91-9876543219', 'care@hyderabadsenior.org', 'Premium care facility for elderly with 24/7 medical support', '/images/hyderabad-senior.jpg', 'medium', ARRAY['shirt', 'pants', 'sweater'], ARRAY['men', 'women'], ARRAY['winter', 'all-season'], true),

('City of Pearls Shelter', 'shelter', 'Secunderabad, Hyderabad, Telangana 500003', 17.4399, 78.4983, '+91-9876543220', 'help@pearlsshelter.org', 'Emergency accommodation and rehabilitation center', '/images/pearls-shelter.jpg', 'high', ARRAY['t-shirt', 'pants', 'jacket', 'blanket'], ARRAY['men', 'women', 'children'], ARRAY['all-season', 'winter'], true),

-- Pune Centers
('Pune Education Trust', 'orphanage', 'Kothrud, Pune, Maharashtra 411038', 18.5074, 73.8077, '+91-9876543221', 'contact@puneeducation.org', 'Educational institution supporting 70+ orphaned children', '/images/pune-education.jpg', 'medium', ARRAY['uniform', 't-shirt', 'pants', 'shoes'], ARRAY['children'], ARRAY['all-season'], true),

('IT City Care Center', 'ngo', 'Hinjewadi, Pune, Maharashtra 411057', 18.5912, 73.7389, '+91-9876543222', 'support@itcitycare.org', 'Tech community-driven social service organization', '/images/itcity-care.jpg', 'low', ARRAY['t-shirt', 'shirt', 'pants'], ARRAY['men', 'women', 'unisex'], ARRAY['all-season'], true);