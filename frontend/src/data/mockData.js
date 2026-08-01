export const airlines = [
  { code: 'AI', name: 'Air India' }, { code: '6E', name: 'IndiGo' },
  { code: 'UK', name: 'Vistara' }, { code: 'SG', name: 'SpiceJet' },
  { code: 'QP', name: 'Akasa Air' },
];

export const airports = [
  { code: 'DEL', city: 'New Delhi' }, { code: 'BOM', city: 'Mumbai' },
  { code: 'BLR', city: 'Bengaluru' }, { code: 'HYD', city: 'Hyderabad' },
  { code: 'MAA', city: 'Chennai' }, { code: 'CCU', city: 'Kolkata' },
];

export const monthlyTrend = [
  { month: 'Jan', delay: 18, onTime: 81 }, { month: 'Feb', delay: 15, onTime: 84 },
  { month: 'Mar', delay: 14, onTime: 85 }, { month: 'Apr', delay: 17, onTime: 82 },
  { month: 'May', delay: 21, onTime: 78 }, { month: 'Jun', delay: 28, onTime: 72 },
  { month: 'Jul', delay: 24, onTime: 75 }, { month: 'Aug', delay: 20, onTime: 79 },
  { month: 'Sep', delay: 16, onTime: 83 }, { month: 'Oct', delay: 13, onTime: 87 },
  { month: 'Nov', delay: 19, onTime: 80 }, { month: 'Dec', delay: 26, onTime: 74 },
];

export const airlinePerformance = [
  { name: 'Vistara', delay: 12, onTime: 88, cancellation: 0.8 },
  { name: 'IndiGo', delay: 15, onTime: 85, cancellation: 1.1 },
  { name: 'Akasa', delay: 18, onTime: 82, cancellation: 1.4 },
  { name: 'Air India', delay: 24, onTime: 76, cancellation: 2.3 },
  { name: 'SpiceJet', delay: 29, onTime: 71, cancellation: 3.1 },
];

export const delayDistribution = [
  { range: 'On time', flights: 58240 }, { range: '< 15m', flights: 22180 },
  { range: '15–30m', flights: 12860 }, { range: '30–60m', flights: 7920 },
  { range: '> 60m', flights: 4110 },
];

export const peakHours = [
  { hour: '00', delay: 8 }, { hour: '03', delay: 5 }, { hour: '06', delay: 14 },
  { hour: '09', delay: 21 }, { hour: '12', delay: 18 }, { hour: '15', delay: 25 },
  { hour: '18', delay: 31 }, { hour: '21', delay: 19 },
];

export const routePerformance = [
  { route: 'DEL → BOM', flights: 8420, delay: 18, reliability: 86 },
  { route: 'BLR → DEL', flights: 7150, delay: 22, reliability: 81 },
  { route: 'BOM → BLR', flights: 6890, delay: 14, reliability: 89 },
  { route: 'DEL → HYD', flights: 5240, delay: 26, reliability: 77 },
  { route: 'CCU → DEL', flights: 4810, delay: 31, reliability: 72 },
];

export const flights = [
  { number: '6E 2112', airline: 'IndiGo', origin: 'DEL', destination: 'BOM', date: '2026-07-29', scheduledDeparture: '06:20', actualDeparture: '06:28', scheduledArrival: '08:35', actualArrival: '08:41', delay: 8, status: 'Delayed' },
  { number: 'AI 865', airline: 'Air India', origin: 'DEL', destination: 'BOM', date: '2026-07-29', scheduledDeparture: '10:00', actualDeparture: '09:58', scheduledArrival: '12:15', actualArrival: '12:09', delay: 0, status: 'On time' },
  { number: 'UK 816', airline: 'Vistara', origin: 'BLR', destination: 'DEL', date: '2026-07-29', scheduledDeparture: '11:30', actualDeparture: '11:42', scheduledArrival: '14:10', actualArrival: '14:18', delay: 12, status: 'Delayed' },
  { number: 'QP 1342', airline: 'Akasa Air', origin: 'BOM', destination: 'BLR', date: '2026-07-29', scheduledDeparture: '14:45', actualDeparture: '14:43', scheduledArrival: '16:25', actualArrival: '16:19', delay: 0, status: 'On time' },
  { number: 'SG 8152', airline: 'SpiceJet', origin: 'CCU', destination: 'DEL', date: '2026-07-28', scheduledDeparture: '18:10', actualDeparture: '18:55', scheduledArrival: '20:35', actualArrival: '21:20', delay: 45, status: 'Delayed' },
  { number: '6E 6401', airline: 'IndiGo', origin: 'HYD', destination: 'MAA', date: '2026-07-28', scheduledDeparture: '20:15', actualDeparture: '20:12', scheduledArrival: '21:30', actualArrival: '21:24', delay: 0, status: 'On time' },
];

export const airportPerformance = [
  { code: 'DEL', city: 'New Delhi', flights: 32410, delay: 24, congestion: 82, peak: '18:00–20:00' },
  { code: 'BOM', city: 'Mumbai', flights: 28120, delay: 22, congestion: 78, peak: '17:00–19:00' },
  { code: 'BLR', city: 'Bengaluru', flights: 21450, delay: 17, congestion: 69, peak: '08:00–10:00' },
  { code: 'HYD', city: 'Hyderabad', flights: 15320, delay: 13, congestion: 54, peak: '19:00–21:00' },
  { code: 'MAA', city: 'Chennai', flights: 13910, delay: 15, congestion: 58, peak: '07:00–09:00' },
];

export const featureImportance = [
  { feature: 'Departure hour', value: 0.24 }, { feature: 'Route', value: 0.21 },
  { feature: 'Weather', value: 0.18 }, { feature: 'Airline', value: 0.14 },
  { feature: 'Month', value: 0.1 }, { feature: 'Distance', value: 0.08 },
  { feature: 'Day of week', value: 0.05 },
];
