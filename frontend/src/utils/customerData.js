// ─── Customer Dashboard Data ───
// Dummy data for customer-facing features: recommendations, loyalty, trends, notifications

export const recommendedServices = [
  {
    id: 'svc-1',
    name: 'Gel Manicure',
    description: 'Long-lasting gel polish with cuticle care',
    price: 1200,
    duration: 60,
    image: '💅',
    tag: 'Popular',
    tagColor: 'bg-rose-100 text-rose-600',
  },
  {
    id: 'svc-2',
    name: 'Nail Art - Floral',
    description: 'Hand-painted floral designs on all nails',
    price: 1800,
    duration: 90,
    image: '🌸',
    tag: 'Trending',
    tagColor: 'bg-violet-100 text-violet-600',
  },
  {
    id: 'svc-3',
    name: 'Pedicure Deluxe',
    description: 'Full spa pedicure with massage and mask',
    price: 1500,
    duration: 75,
    image: '🦶',
    tag: 'Recommended',
    tagColor: 'bg-emerald-100 text-emerald-600',
  },
  {
    id: 'svc-4',
    name: 'Chrome Nails',
    description: 'Metallic mirror-finish chrome powder nails',
    price: 2200,
    duration: 90,
    image: '✨',
    tag: 'New',
    tagColor: 'bg-amber-100 text-amber-600',
  },
  {
    id: 'svc-5',
    name: 'Nail Extension',
    description: 'Acrylic or gel extensions with custom shape',
    price: 3000,
    duration: 120,
    image: '💎',
    tag: 'Premium',
    tagColor: 'bg-blue-100 text-blue-600',
  },
];

export const serviceCatalog = [
  { id: 'cat-1', name: 'Gel Manicure', category: 'Manicure', price: 1200, duration: 60, image: '💅', tag: 'Popular' },
  { id: 'cat-2', name: 'Basic Manicure', category: 'Manicure', price: 600, duration: 30, image: '🤚', tag: null },
  { id: 'cat-3', name: 'Nail Art - Floral', category: 'Nail Art', price: 1800, duration: 90, image: '🌸', tag: 'Trending' },
  { id: 'cat-4', name: 'Nail Art - Abstract', category: 'Nail Art', price: 2000, duration: 90, image: '🎨', tag: null },
  { id: 'cat-5', name: 'Nail Art - French', category: 'Nail Art', price: 1600, duration: 75, image: '🇫🇷', tag: 'Popular' },
  { id: 'cat-6', name: 'Pedicure Classic', category: 'Pedicure', price: 800, duration: 45, image: '🦶', tag: null },
  { id: 'cat-7', name: 'Pedicure Deluxe', category: 'Pedicure', price: 1500, duration: 75, image: '🧖', tag: 'Popular' },
  { id: 'cat-8', name: 'Chrome Nails', category: 'Extensions', price: 2200, duration: 90, image: '✨', tag: 'New' },
  { id: 'cat-9', name: 'Acrylic Extensions', category: 'Extensions', price: 3000, duration: 120, image: '💎', tag: 'Premium' },
  { id: 'cat-10', name: 'Gel Extensions', category: 'Extensions', price: 2800, duration: 110, image: '💅', tag: null },
  { id: 'cat-11', name: 'Nail Repair', category: 'Maintenance', price: 400, duration: 20, image: '🔧', tag: null },
  { id: 'cat-12', name: 'Cuticle Treatment', category: 'Maintenance', price: 500, duration: 25, image: '🌿', tag: null },
];

export const availableTimeSlots = {
  '2026-04-20': [
    { time: '9:00 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '12:00 PM', available: true },
    { time: '1:00 PM', available: false },
    { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: true },
    { time: '4:00 PM', available: false },
    { time: '5:00 PM', available: true },
  ],
  '2026-04-21': [
    { time: '9:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '12:00 PM', available: true },
    { time: '1:00 PM', available: true },
    { time: '2:00 PM', available: false },
    { time: '3:00 PM', available: true },
    { time: '4:00 PM', available: true },
    { time: '5:00 PM', available: false },
  ],
  '2026-04-22': [
    { time: '9:00 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '12:00 PM', available: false },
    { time: '1:00 PM', available: true },
    { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: true },
    { time: '4:00 PM', available: true },
    { time: '5:00 PM', available: true },
  ],
};

export const loyaltyData = {
  points: 2450,
  tier: 'Gold',
  nextTier: 'Platinum',
  pointsToNextTier: 550,
  totalVisits: 12,
  memberSince: 'Jan 2025',
  availableRewards: [
    { id: 'rwd-1', name: 'Free Basic Manicure', points: 500, icon: '🎁' },
    { id: 'rwd-2', name: '20% Off Any Service', points: 300, icon: '🏷️' },
    { id: 'rwd-3', name: 'Free Nail Art Upgrade', points: 800, icon: '✨' },
  ],
};

export const trendingDesigns = [
  { id: 'td-1', name: 'Pastel Ombré', category: 'Ombré', emoji: '🌅', likes: 234 },
  { id: 'td-2', name: 'Gold Leaf Accent', category: 'Luxury', emoji: '🍂', likes: 189 },
  { id: 'td-3', name: 'Cherry Blossom Art', category: 'Floral', emoji: '🌸', likes: 312 },
  { id: 'td-4', name: 'Marble Effect', category: 'Abstract', emoji: '🪨', likes: 156 },
  { id: 'td-5', name: 'Minimal Line Art', category: 'Minimal', emoji: '✏️', likes: 278 },
  { id: 'td-6', name: 'French Twist', category: 'Classic', emoji: '💄', likes: 198 },
  { id: 'td-7', name: 'Galaxy Chrome', category: 'Chrome', emoji: '🌌', likes: 245 },
  { id: 'td-8', name: 'Butterfly Wings', category: 'Artsy', emoji: '🦋', likes: 267 },
];

export const customerNotifications = [
  { id: 'n-1', type: 'reminder', title: 'Appointment Tomorrow', message: 'Gel Manicure at 10:00 AM', time: '2 hrs ago', read: false },
  { id: 'n-2', type: 'offer', title: '20% Off This Weekend!', message: 'Use code NAILS20 on all art services', time: '5 hrs ago', read: false },
  { id: 'n-3', type: 'confirmation', title: 'Booking Confirmed', message: 'Pedicure Deluxe on Apr 22, 2:00 PM', time: '1 day ago', read: true },
  { id: 'n-4', type: 'reward', title: 'You Earned 200 Points!', message: 'From your last Gel Manicure visit', time: '3 days ago', read: true },
];
