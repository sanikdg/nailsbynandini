// ─── Smart Dashboard Data ───
// Extends dummyData.js with intelligent insights, staff, alerts, and heatmap data

export const todayInsights = {
  overlappingBookings: 2,
  peakHours: ['10:00 AM - 11:00 AM', '2:00 PM - 3:00 PM'],
  expectedRevenue: 8400,
  totalTodayBookings: 7,
  completedToday: 3,
  remainingToday: 4,
  avgServiceTime: 68, // minutes
  busiestService: 'Gel Manicure',
};

export const staffData = [
  {
    id: 'STF-001',
    name: 'Nandini',
    role: 'Owner & Lead Artist',
    avatar: 'N',
    color: 'from-violet-500 to-fuchsia-500',
    appointmentsToday: 4,
    appointmentsWeek: 22,
    revenueGenerated: 42600,
    rating: 4.9,
    speciality: 'Nail Art',
    workload: 'high', // low | medium | high
  },
  {
    id: 'STF-002',
    name: 'Priya',
    role: 'Senior Nail Technician',
    avatar: 'P',
    color: 'from-blue-500 to-cyan-500',
    appointmentsToday: 3,
    appointmentsWeek: 18,
    revenueGenerated: 31200,
    rating: 4.7,
    speciality: 'Extensions',
    workload: 'medium',
  },
  {
    id: 'STF-003',
    name: 'Anita',
    role: 'Junior Technician',
    avatar: 'A',
    color: 'from-emerald-500 to-teal-500',
    appointmentsToday: 2,
    appointmentsWeek: 12,
    revenueGenerated: 18400,
    rating: 4.5,
    speciality: 'Manicure & Pedicure',
    workload: 'low',
  },
  {
    id: 'STF-004',
    name: 'Kavya',
    role: 'Nail Technician',
    avatar: 'K',
    color: 'from-amber-500 to-orange-500',
    appointmentsToday: 3,
    appointmentsWeek: 15,
    revenueGenerated: 24800,
    rating: 4.6,
    speciality: 'Gel & Chrome',
    workload: 'medium',
  },
];

export const smartAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Low Bookings Tomorrow',
    message: 'Only 3 bookings for tomorrow. Consider running a flash promotion.',
    time: '10 min ago',
    actionLabel: 'Create Offer',
  },
  {
    id: 2,
    type: 'success',
    title: 'High Demand: Gel Manicure',
    message: 'Gel Manicure bookings up 35% this week. Consider adding more slots.',
    time: '1 hr ago',
    actionLabel: 'View Trend',
  },
  {
    id: 3,
    type: 'danger',
    title: '2 Cancellations Today',
    message: 'Riya Malhotra and Pooja Reddy cancelled. 2 slots now open.',
    time: '2 hrs ago',
    actionLabel: 'Fill Slots',
  },
  {
    id: 4,
    type: 'info',
    title: 'Staff Overload Detected',
    message: 'Nandini has 4 back-to-back appointments today. Consider redistribution.',
    time: '3 hrs ago',
    actionLabel: 'Reassign',
  },
];

export const customerInsightsData = {
  returningPercentage: 68,
  avgVisitsPerCustomer: 8.4,
  newCustomersThisMonth: 18,
  retentionRate: 82,
  topLoyalCustomers: [
    { name: 'Kavita Singh', visits: 20, spent: 28500, streak: '6 months' },
    { name: 'Meera Joshi', visits: 15, spent: 22300, streak: '4 months' },
    { name: 'Priya Sharma', visits: 12, spent: 18600, streak: '5 months' },
  ],
};

// Heatmap: rows = days (Mon-Sun), cols = time slots (9AM-6PM)
export const bookingHeatmap = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  timeSlots: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
  data: [
    // Mon
    [1, 3, 2, 1, 0, 2, 3, 1, 0],
    // Tue
    [2, 4, 3, 2, 1, 3, 2, 2, 1],
    // Wed
    [3, 5, 4, 2, 2, 4, 5, 3, 1],
    // Thu
    [2, 3, 3, 1, 1, 3, 4, 2, 1],
    // Fri
    [4, 5, 5, 3, 2, 5, 6, 4, 2],
    // Sat
    [5, 6, 6, 4, 3, 6, 7, 5, 3],
    // Sun
    [1, 2, 2, 1, 0, 1, 2, 1, 0],
  ],
};

export const predictions = {
  tomorrowBookings: 9,
  tomorrowRevenue: 11200,
  bookingsConfidence: 78,
  revenueConfidence: 72,
  trendDirection: 'up', // up | down | stable
  weekForecast: [
    { day: 'Mon', predicted: 8 },
    { day: 'Tue', predicted: 10 },
    { day: 'Wed', predicted: 12 },
    { day: 'Thu', predicted: 9 },
    { day: 'Fri', predicted: 15 },
    { day: 'Sat', predicted: 18 },
    { day: 'Sun', predicted: 5 },
  ],
};
