 // ============================================
// SWITZERLAND TOUR PLANNER - COMPLETE MOCK DATA
// ============================================

// --- CITIES ---
export const cities = [
  { id: 'zurich', name: 'Zurich', image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&q=80&w=800', description: 'A global center for banking and finance, lies at the north end of Lake Zurich.', lat: 47.3769, lng: 8.5417 },
  { id: 'lucerne', name: 'Lucerne', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800', description: 'Known for preserved medieval architecture, sits amid snowcapped mountains on Lake Lucerne.', lat: 47.0502, lng: 8.3093 },
  { id: 'interlaken', name: 'Interlaken', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800', description: 'A traditional resort town in the mountainous Bernese Oberland region.', lat: 46.6863, lng: 7.8632 },
  { id: 'bern', name: 'Bern', image: 'https://images.unsplash.com/photo-1591289009723-aef0a1a8a211?auto=format&fit=crop&q=80&w=800', description: 'The capital city of Switzerland, built around a crook in the Aare River.', lat: 46.9480, lng: 7.4474 },
  { id: 'zermatt', name: 'Zermatt', image: 'https://images.unsplash.com/photo-1531737212413-667205e1cda7?auto=format&fit=crop&q=80&w=800', description: 'A mountain resort renowned for skiing below the iconic Matterhorn peak.', lat: 46.0207, lng: 7.7491 },
  { id: 'geneva', name: 'Geneva', image: 'https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&q=80&w=800', description: 'A global city and diplomatic capital on the shores of Lake Geneva.', lat: 46.2044, lng: 6.1432 },
];

// --- DISTANCE MATRIX ---
export const distanceMatrix = {
  'zurich-lucerne': { km: 52, mins: 45, transport: 'Train' },
  'zurich-interlaken': { km: 118, mins: 115, transport: 'Train' },
  'zurich-bern': { km: 125, mins: 56, transport: 'Train' },
  'zurich-zermatt': { km: 228, mins: 210, transport: 'Train' },
  'zurich-geneva': { km: 280, mins: 170, transport: 'Train' },
  'lucerne-interlaken': { km: 68, mins: 110, transport: 'Train' },
  'lucerne-bern': { km: 90, mins: 60, transport: 'Train' },
  'lucerne-zermatt': { km: 180, mins: 195, transport: 'Train' },
  'lucerne-geneva': { km: 230, mins: 180, transport: 'Train' },
  'interlaken-bern': { km: 56, mins: 50, transport: 'Train' },
  'interlaken-zermatt': { km: 130, mins: 140, transport: 'Train' },
  'interlaken-geneva': { km: 195, mins: 165, transport: 'Train' },
  'bern-zermatt': { km: 155, mins: 135, transport: 'Train' },
  'bern-geneva': { km: 160, mins: 105, transport: 'Train' },
  'zermatt-geneva': { km: 235, mins: 220, transport: 'Train' },
};

export function getDistance(cityA, cityB) {
  if (cityA === cityB) return { km: 0, mins: 0, transport: 'N/A' };
  const key1 = `${cityA}-${cityB}`;
  const key2 = `${cityB}-${cityA}`;
  return distanceMatrix[key1] || distanceMatrix[key2] || { km: 0, mins: 0, transport: 'Unknown' };
}

// --- HOTELS ---
export const hotels = [
  { id: 'hot_1', cityId: 'zurich', name: 'Hotel Welcome Inn', category: '3 Star', price: 120, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Breakfast', 'Parking'] },
  { id: 'hot_2', cityId: 'zurich', name: 'Zurich Marriott Hotel', category: '5 Star', price: 350, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c05?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Spa', 'Pool', 'Restaurant'] },
  { id: 'hot_7', cityId: 'zurich', name: 'Hotel Schweizerhof', category: '4 Star', price: 220, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Breakfast', 'Restaurant'] },
  { id: 'hot_3', cityId: 'lucerne', name: 'Hotel Rothaus Lucerne', category: '3 Star', price: 110, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Breakfast'] },
  { id: 'hot_8', cityId: 'lucerne', name: 'Grand Hotel National', category: '5 Star', price: 380, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Spa', 'Pool', 'Lake View'] },
  { id: 'hot_4', cityId: 'interlaken', name: 'Hotel Weisses Kreuz', category: '4 Star', price: 180, image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Breakfast', 'Mountain View'] },
  { id: 'hot_9', cityId: 'interlaken', name: 'Victoria Jungfrau Grand', category: '5 Star', price: 420, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Spa', 'Pool', 'Mountain View'] },
  { id: 'hot_5', cityId: 'bern', name: 'Hotel City am Bahnhof', category: '4 Star', price: 160, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Breakfast', 'City Center'] },
  { id: 'hot_10', cityId: 'bern', name: 'Bellevue Palace', category: '5 Star', price: 400, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c05?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Spa', 'Restaurant', 'Parliament View'] },
  { id: 'hot_6', cityId: 'zermatt', name: 'Hotel Bristol Zermatt', category: '3 Star', price: 130, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Breakfast', 'Matterhorn View'] },
  { id: 'hot_11', cityId: 'zermatt', name: 'The Omnia Zermatt', category: '5 Star', price: 450, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Spa', 'Matterhorn View'] },
  { id: 'hot_12', cityId: 'geneva', name: 'Hotel Auteuil Geneva', category: '4 Star', price: 200, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Breakfast', 'Lake View'] },
  { id: 'hot_13', cityId: 'geneva', name: 'Four Seasons des Bergues', category: '5 Star', price: 500, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c05?auto=format&fit=crop&q=80&w=800', amenities: ['WiFi', 'Spa', 'Pool', 'Lake View'] },
];

// --- SIGHTSEEING ---
export const sightseeings = [
  { id: 'sight_1', cityId: 'zurich', name: 'Old Town (Altstadt)', duration: '2 hours', cost: 0, image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&q=80&w=800', description: 'Medieval lanes, Lindenhof hill & Bahnhofstrasse.' },
  { id: 'sight_2', cityId: 'zurich', name: 'Lake Zurich Boat Ride', duration: '1.5 hours', cost: 30, image: 'https://images.unsplash.com/photo-1504803900752-c2051699d0e8?auto=format&fit=crop&q=80&w=800', description: 'Scenic boat ride with panoramic mountain views.' },
  { id: 'sight_3', cityId: 'lucerne', name: 'Chapel Bridge', duration: '1 hour', cost: 0, image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800', description: "Europe's oldest covered wooden bridge." },
  { id: 'sight_4', cityId: 'lucerne', name: 'Lion Monument', duration: '30 mins', cost: 0, image: 'https://images.unsplash.com/photo-1527631746654-2195821f51ee?auto=format&fit=crop&q=80&w=800', description: 'Famous rock sculpture of a dying lion.' },
  { id: 'sight_5', cityId: 'interlaken', name: 'Harder Kulm Viewpoint', duration: '3 hours', cost: 35, image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800', description: 'Best panoramic viewpoint with Eiger, Mönch & Jungfrau.' },
  { id: 'sight_6', cityId: 'bern', name: 'Bern Old Town (UNESCO)', duration: '2 hours', cost: 0, image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0748b1?auto=format&fit=crop&q=80&w=800', description: 'UNESCO World Heritage old town.' },
  { id: 'sight_7', cityId: 'zermatt', name: 'Matterhorn Viewpoint', duration: '2 hours', cost: 0, image: 'https://images.unsplash.com/photo-1531737212413-667205e1cda7?auto=format&fit=crop&q=80&w=800', description: 'Iconic views of the Matterhorn.' },
  { id: 'sight_8', cityId: 'geneva', name: "Jet d'Eau Fountain", duration: '1 hour', cost: 0, image: 'https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&q=80&w=800', description: "Geneva's famous 140m high water fountain." },
  { id: 'sight_9', cityId: 'geneva', name: 'United Nations HQ', duration: '2 hours', cost: 15, image: 'https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&q=80&w=800', description: 'Guided tour of the Palais des Nations.' },
];

// --- ACTIVITIES ---
export const activities = [
  { id: 'act_1', cityId: 'zurich', title: 'Rhine Falls Day Trip', shift: 'Morning', price: 45, duration: '3 hours', image: 'https://images.unsplash.com/photo-1536696429535-626dfedb3260?auto=format&fit=crop&q=80&w=800', inclusions: ['Transport', 'Entry Ticket'], description: "Europe's largest waterfall near Schaffhausen." },
  { id: 'act_2', cityId: 'zurich', title: 'Walking Tour Old Town', shift: 'Morning', price: 0, duration: '2 hours', image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&q=80&w=800', inclusions: ['Guide'], description: 'Discover the history and culture of Zurich.' },
  { id: 'act_10', cityId: 'zurich', title: 'Zurich Food Tour', shift: 'Noon', price: 65, duration: '3 hours', image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&q=80&w=800', inclusions: ['Guide', 'Food Tastings'], description: 'Taste the best of Swiss cuisine.' },
  { id: 'act_3', cityId: 'lucerne', title: 'Mt. Pilatus Golden Round Trip', shift: 'Morning', price: 95, duration: '6 hours', image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&q=80&w=800', inclusions: ['Cable Car', 'Boat', 'Rail'], description: 'The ultimate Lucerne experience via Mt. Pilatus.' },
  { id: 'act_4', cityId: 'lucerne', title: 'Lake Lucerne Cruise', shift: 'Evening', price: 40, duration: '2 hours', image: 'https://images.unsplash.com/photo-1527631746654-2195821f51ee?auto=format&fit=crop&q=80&w=800', inclusions: ['Cruise Ticket'], description: 'Cruise on Lake Lucerne with captivating charm.' },
  { id: 'act_11', cityId: 'lucerne', title: 'Mt. Rigi Day Trip', shift: 'Morning', price: 80, duration: '5 hours', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800', inclusions: ['Cogwheel Train', 'Cable Car'], description: 'Queen of the Mountains with 360° panoramas.' },
  { id: 'act_5', cityId: 'interlaken', title: 'Jungfraujoch - Top of Europe', shift: 'Morning', price: 200, duration: '8 hours', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800', inclusions: ['Cogwheel Rail', 'Ice Palace'], description: "Europe's highest railway station at 3,454m." },
  { id: 'act_6', cityId: 'interlaken', title: 'Paragliding Adventure', shift: 'Noon', price: 180, duration: '2 hours', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800', inclusions: ['Equipment', 'Instructor', 'Photos'], description: 'Tandem paragliding over the Swiss Alps.' },
  { id: 'act_12', cityId: 'interlaken', title: 'Lauterbrunnen Valley Walk', shift: 'Noon', price: 20, duration: '3 hours', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800', inclusions: ['Transport to Valley'], description: 'Valley between cliffs and 72 waterfalls.' },
  { id: 'act_7', cityId: 'bern', title: 'Einstein House & Museum', shift: 'Morning', price: 15, duration: '2 hours', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0748b1?auto=format&fit=crop&q=80&w=800', inclusions: ['Entry Ticket'], description: "Where Einstein developed the theory of relativity." },
  { id: 'act_13', cityId: 'bern', title: 'Bear Park & Rose Garden', shift: 'Noon', price: 0, duration: '2 hours', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0748b1?auto=format&fit=crop&q=80&w=800', inclusions: ['Free Entry'], description: "Bern's famous bears and panoramic views." },
  { id: 'act_8', cityId: 'zermatt', title: 'Gornergrat Railway', shift: 'Morning', price: 90, duration: '4 hours', image: 'https://images.unsplash.com/photo-1531737212413-667205e1cda7?auto=format&fit=crop&q=80&w=800', inclusions: ['Cogwheel Rail', 'Observatory'], description: 'Highest open-air cog railway to 3,089m.' },
  { id: 'act_14', cityId: 'zermatt', title: 'Glacier Paradise', shift: 'Noon', price: 100, duration: '4 hours', image: 'https://images.unsplash.com/photo-1531737212413-667205e1cda7?auto=format&fit=crop&q=80&w=800', inclusions: ['Cable Car', 'Ice Palace'], description: "Europe's highest cable car station at 3,883m." },
  { id: 'act_9', cityId: 'geneva', title: 'Lake Geneva Cruise', shift: 'Evening', price: 50, duration: '2 hours', image: 'https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&q=80&w=800', inclusions: ['Cruise Ticket', 'Audio Guide'], description: 'Cruise on Lake Geneva with Alps views.' },
  { id: 'act_15', cityId: 'geneva', title: 'CERN Science Gateway', shift: 'Morning', price: 20, duration: '3 hours', image: 'https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&q=80&w=800', inclusions: ['Entry', 'Guided Tour'], description: "World's largest particle physics laboratory." },
];

// --- TRANSPORT ---
export const transportOptions = [
  { id: 'trans_1', type: 'Economy', name: 'Economy Coach', seats: 8, pricePerKm: 1.5, image: '🚐', description: 'Budget-friendly group transport' },
  { id: 'trans_2', type: 'Standard', name: 'Standard Minivan', seats: 6, pricePerKm: 2.5, image: '🚗', description: 'Comfortable mid-range vehicle' },
  { id: 'trans_3', type: 'Premium', name: 'Premium SUV', seats: 4, pricePerKm: 4.0, image: '🏎️', description: 'Luxury travel experience' },
];

export const travelTypes = [
  { id: 'self_drive', label: 'Self Drive', description: 'Rent and drive yourself', icon: '🚘' },
  { id: 'seat_in_coach', label: 'Seat in Coach', description: 'Shared coach transfer', icon: '🚌' },
  { id: 'chauffeur', label: 'Chauffeur Driver (FIT)', description: 'Private driver service', icon: '👨‍✈️' },
];

// --- MEALS ---
export const mealOptions = [
  { id: 'chef', label: 'Chef Meals', description: 'Personal chef prepares Indian meals', price: 50, icon: '👨‍🍳' },
  { id: 'local', label: 'Local Meals', description: 'Authentic Swiss & European cuisine', price: 35, icon: '🍽️' },
  { id: 'no_meals', label: 'No Meals', description: 'Explore restaurants on your own', price: 0, icon: '✖️' },
];

export const dietaryPreferences = [
  { id: 'jain', label: 'Jain Food' },
  { id: 'swaminarayan', label: 'Swaminarayan Food' },
  { id: 'veg', label: 'Vegetarian' },
  { id: 'nonveg', label: 'Non-Vegetarian' },
];

// --- SPECIAL OCCASIONS ---
export const specialOccasions = [
  { id: 'birthday', label: 'Birthday', icon: '🎂', addons: ['Cake', 'Room Decoration', 'Surprise Gift'] },
  { id: 'anniversary', label: 'Anniversary', icon: '💍', addons: ['Flowers', 'Dinner Cruise', 'Room Decoration'] },
  { id: 'honeymoon', label: 'Honeymoon', icon: '💕', addons: ['Suite Upgrade', 'Spa Package', 'Romantic Dinner'] },
];

// --- PASSES ---
export const passes = [
  { id: 'pass_1', name: 'Swiss Travel Pass (2nd Class)', days: 8, price: 450, description: 'Unlimited travel on Swiss public transport' },
  { id: 'pass_2', name: 'Swiss Travel Pass (1st Class)', days: 8, price: 650, description: 'Premium unlimited Swiss public transport' },
  { id: 'pass_3', name: 'Half Fare Card', days: 30, price: 120, description: '50% discount on most Swiss transport' },
];

// --- ADMIN: Projects CRM ---
export const projectsData = [
  { id: '23', name: 'Jain Sangh Trust Tour', client: 'Jayesh Doshi', date: 'Jan 10, 2026', quoted: 'Yes', amount: 'INR 4,500', status: 'In Progress', email: 'jayesh@example.com', category: 'Group', cities: ['zurich', 'lucerne', 'interlaken'], days: 10 },
  { id: '24', name: 'Patel Family Tour', client: 'Rajesh Patel', date: 'Feb 15, 2026', quoted: 'Yes', amount: 'INR 6,200', status: 'Confirmed', email: 'rajesh@example.com', category: 'Family', cities: ['zurich', 'bern', 'zermatt'], days: 7 },
  { id: '25', name: 'Honeymoon Special', client: 'Priya Sharma', date: 'Feb 20, 2026', quoted: 'No', amount: '-', status: 'New', email: 'priya@example.com', category: 'Couple', cities: ['lucerne', 'interlaken'], days: 5 },
  { id: '26', name: 'Corporate Retreat', client: 'TechCorp Ltd', date: 'Mar 01, 2026', quoted: 'Yes', amount: 'INR 12,400', status: 'Confirmed', email: 'events@techcorp.com', category: 'Group', cities: ['zurich', 'lucerne', 'bern', 'geneva'], days: 12 },
  { id: '27', name: 'Solo Explorer', client: 'Amit Verma', date: 'Mar 10, 2026', quoted: 'No', amount: '-', status: 'New Inquiry', email: 'amit@example.com', category: 'Solo', cities: ['zurich', 'interlaken', 'zermatt'], days: 8 },
];

// --- USERS MOCK ---
export const mockUsers = [
  { id: 'user_1', name: 'Rajesh Patel', email: 'rajesh@example.com', role: 'b2c', phone: '+91 98765 43210' },
  { id: 'agent_1', name: 'Travel Masters Agency', email: 'info@travelmasters.com', role: 'agent', phone: '+91 22 2345 6789', agencyName: 'Travel Masters', gst: '22AAAAA0000A1Z5', address: 'Mumbai, India' },
  { id: 'admin_1', name: 'Super Admin', email: 'admin@digiwave.com', role: 'admin', phone: '+91 99999 00000' },
];

// --- SAVED PLANS ---
export const savedPlans = [
  { id: 'plan_1', userId: 'user_1', name: 'Swiss Family Adventure', createdAt: '2026-01-15', status: 'confirmed', duration: 7, category: 'family', cities: ['zurich', 'lucerne', 'interlaken'], totalAmount: 4200, passengers: { adults: 2, children: 1, rooms: 1 } },
  { id: 'plan_2', userId: 'agent_1', clientName: 'Mr. Jayesh Doshi', name: 'Jain Sangh Group Tour', createdAt: '2026-02-01', status: 'draft', duration: 10, category: 'family', cities: ['zurich', 'lucerne', 'interlaken', 'bern'], totalAmount: 8500, passengers: { adults: 8, children: 4, rooms: 4 } },
  { id: 'plan_3', userId: 'user_1', name: 'Quick Zurich Weekend', createdAt: '2026-02-10', status: 'draft', duration: 3, category: 'couple', cities: ['zurich'], totalAmount: 1200, passengers: { adults: 2, children: 0, rooms: 1 } },
];
