import { supabase } from '../src/integrations/supabase/client.js';

// Comprehensive donation centers dataset for major Indian cities
const donationCenters = [
  // Mumbai Centers
  {
    name: "Hope Children's Home",
    type: "orphanage",
    address: "Andheri East, Mumbai, Maharashtra 400069",
    latitude: 19.1136,
    longitude: 72.8697,
    phone: "+91-9876543210",
    email: "contact@hopechildrenshome.org",
    description: "Caring for 80+ underprivileged children, providing education and shelter",
    image_url: "/images/hope-children-home.jpg",
    priority: "high",
    needs_types: ["t-shirt", "pants", "dress", "shoes", "jacket"],
    needs_gender: ["children", "unisex"],
    needs_season: ["all-season", "winter"],
    is_active: true
  },
  {
    name: "Mumbai Senior Care Center",
    type: "old-age-home",
    address: "Bandra West, Mumbai, Maharashtra 400050",
    latitude: 19.0596,
    longitude: 72.8295,
    phone: "+91-9876543211",
    email: "info@mumbaiseniorcare.org",
    description: "Home for 60+ elderly citizens providing medical care and comfort",
    image_url: "/images/senior-care-mumbai.jpg",
    priority: "medium",
    needs_types: ["shirt", "pants", "sweater", "shawl"],
    needs_gender: ["men", "women"],
    needs_season: ["winter", "all-season"],
    is_active: true
  },
  {
    name: "Shelter for All Mumbai",
    type: "shelter",
    address: "Dharavi, Mumbai, Maharashtra 400017",
    latitude: 19.0430,
    longitude: 72.8570,
    phone: "+91-9876543212",
    email: "help@shelterforall.org",
    description: "Emergency shelter providing temporary housing for homeless individuals",
    image_url: "/images/shelter-mumbai.jpg",
    priority: "high",
    needs_types: ["t-shirt", "pants", "jacket", "blanket", "shoes"],
    needs_gender: ["men", "women", "children"],
    needs_season: ["all-season", "winter"],
    is_active: true
  },
  // Delhi Centers
  {
    name: "Delhi Children Foundation",
    type: "orphanage",
    address: "Lajpat Nagar, New Delhi, Delhi 110024",
    latitude: 28.5665,
    longitude: 77.2432,
    phone: "+91-9876543213",
    email: "contact@delhichildren.org",
    description: "Supporting 120+ children with education, healthcare and nutrition",
    image_url: "/images/delhi-children.jpg",
    priority: "high",
    needs_types: ["uniform", "t-shirt", "pants", "dress", "shoes", "sweater"],
    needs_gender: ["children"],
    needs_season: ["all-season", "winter", "summer"],
    is_active: true
  },
  {
    name: "Helping Hands NGO",
    type: "ngo",
    address: "Karol Bagh, New Delhi, Delhi 110005",
    latitude: 28.6519,
    longitude: 77.1909,
    phone: "+91-9876543214",
    email: "support@helpinghands.org",
    description: "Community outreach program serving 500+ families in need",
    image_url: "/images/helping-hands.jpg",
    priority: "medium",
    needs_types: ["t-shirt", "shirt", "pants", "dress", "jacket"],
    needs_gender: ["men", "women", "children", "unisex"],
    needs_season: ["all-season"],
    is_active: true
  },
  // Bangalore Centers
  {
    name: "Bangalore Care Home",
    type: "old-age-home",
    address: "Koramangala, Bangalore, Karnataka 560034",
    latitude: 12.9279,
    longitude: 77.6271,
    phone: "+91-9876543215",
    email: "care@bangalorecare.org",
    description: "Specialized care for 45+ senior citizens with medical facilities",
    image_url: "/images/bangalore-care.jpg",
    priority: "medium",
    needs_types: ["shirt", "pants", "sweater", "shawl", "comfortable-wear"],
    needs_gender: ["men", "women"],
    needs_season: ["winter", "all-season"],
    is_active: true
  },
  {
    name: "Tech City Shelter",
    type: "shelter",
    address: "Electronic City, Bangalore, Karnataka 560100",
    latitude: 12.8456,
    longitude: 77.6603,
    phone: "+91-9876543216",
    email: "contact@techcityshelter.org",
    description: "Modern shelter facility for migrant workers and homeless individuals",
    image_url: "/images/tech-shelter.jpg",
    priority: "high",
    needs_types: ["t-shirt", "pants", "jacket", "shoes", "work-wear"],
    needs_gender: ["men", "women"],
    needs_season: ["all-season"],
    is_active: true
  },
  // Chennai Centers
  {
    name: "Chennai Children's Trust",
    type: "orphanage",
    address: "T. Nagar, Chennai, Tamil Nadu 600017",
    latitude: 13.0418,
    longitude: 80.2341,
    phone: "+91-9876543217",
    email: "info@chennaichildren.org",
    description: "Educational and residential support for 90+ underprivileged children",
    image_url: "/images/chennai-children.jpg",
    priority: "high",
    needs_types: ["uniform", "t-shirt", "pants", "dress", "shoes"],
    needs_gender: ["children"],
    needs_season: ["summer", "all-season"],
    is_active: true
  },
  {
    name: "Marina Beach Outreach",
    type: "ngo",
    address: "Marina Beach, Chennai, Tamil Nadu 600013",
    latitude: 13.0475,
    longitude: 80.2824,
    phone: "+91-9876543218",
    email: "outreach@marinabeach.org",
    description: "Beach cleanup and community service organization",
    image_url: "/images/marina-outreach.jpg",
    priority: "low",
    needs_types: ["t-shirt", "pants", "cap", "shoes"],
    needs_gender: ["men", "women", "unisex"],
    needs_season: ["summer", "all-season"],
    is_active: true
  },
  // Hyderabad Centers
  {
    name: "Hyderabad Senior Living",
    type: "old-age-home",
    address: "Banjara Hills, Hyderabad, Telangana 500034",
    latitude: 17.4126,
    longitude: 78.4071,
    phone: "+91-9876543219",
    email: "care@hyderabadsenior.org",
    description: "Premium care facility for elderly with 24/7 medical support",
    image_url: "/images/hyderabad-senior.jpg",
    priority: "medium",
    needs_types: ["shirt", "pants", "sweater", "comfortable-wear"],
    needs_gender: ["men", "women"],
    needs_season: ["winter", "all-season"],
    is_active: true
  },
  {
    name: "City of Pearls Shelter",
    type: "shelter",
    address: "Secunderabad, Hyderabad, Telangana 500003",
    latitude: 17.4399,
    longitude: 78.4983,
    phone: "+91-9876543220",
    email: "help@pearlsshelter.org",
    description: "Emergency accommodation and rehabilitation center",
    image_url: "/images/pearls-shelter.jpg",
    priority: "high",
    needs_types: ["t-shirt", "pants", "jacket", "blanket"],
    needs_gender: ["men", "women", "children"],
    needs_season: ["all-season", "winter"],
    is_active: true
  },
  // Pune Centers
  {
    name: "Pune Education Trust",
    type: "orphanage",
    address: "Kothrud, Pune, Maharashtra 411038",
    latitude: 18.5074,
    longitude: 73.8077,
    phone: "+91-9876543221",
    email: "contact@puneeducation.org",
    description: "Educational institution supporting 70+ orphaned children",
    image_url: "/images/pune-education.jpg",
    priority: "medium",
    needs_types: ["uniform", "t-shirt", "pants", "shoes", "bag"],
    needs_gender: ["children"],
    needs_season: ["all-season"],
    is_active: true
  },
  {
    name: "IT City Care Center",
    type: "ngo",
    address: "Hinjewadi, Pune, Maharashtra 411057",
    latitude: 18.5912,
    longitude: 73.7389,
    phone: "+91-9876543222",
    email: "support@itcitycare.org",
    description: "Tech community-driven social service organization",
    image_url: "/images/itcity-care.jpg",
    priority: "low",
    needs_types: ["t-shirt", "shirt", "pants", "formal-wear"],
    needs_gender: ["men", "women", "unisex"],
    needs_season: ["all-season"],
    is_active: true
  }
];

async function populateCenters() {
  try {
    console.log('Starting to populate donation centers...');
    
    const { data, error } = await supabase
      .from('donation_centers')
      .insert(donationCenters);
    
    if (error) {
      console.error('Error inserting data:', error);
      return;
    }
    
    console.log('Successfully populated', donationCenters.length, 'donation centers');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

populateCenters();