export const airlines = [
  { id: 1, code: 'AI', name: 'Air India', averageDelay: 24, onTimePercentage: 76, cancellationRate: 2.3 },
  { id: 2, code: '6E', name: 'IndiGo', averageDelay: 15, onTimePercentage: 85, cancellationRate: 1.1 },
  { id: 3, code: 'UK', name: 'Vistara', averageDelay: 12, onTimePercentage: 88, cancellationRate: 0.8 },
  { id: 4, code: 'SG', name: 'SpiceJet', averageDelay: 29, onTimePercentage: 71, cancellationRate: 3.1 },
  { id: 5, code: 'QP', name: 'Akasa Air', averageDelay: 18, onTimePercentage: 82, cancellationRate: 1.4 },
];

export const airports = [
  { id: 1, code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', flightCount: 32410, averageDelay: 24, congestionScore: 82, peakHours: '18:00–20:00' },
  { id: 2, code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', flightCount: 28120, averageDelay: 22, congestionScore: 78, peakHours: '17:00–19:00' },
  { id: 3, code: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', flightCount: 21450, averageDelay: 17, congestionScore: 69, peakHours: '08:00–10:00' },
  { id: 4, code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', flightCount: 15320, averageDelay: 13, congestionScore: 54, peakHours: '19:00–21:00' },
  { id: 5, code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', flightCount: 13910, averageDelay: 15, congestionScore: 58, peakHours: '07:00–09:00' },
  { id: 6, code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', flightCount: 11870, averageDelay: 21, congestionScore: 63, peakHours: '18:00–20:00' },
];

export const flights = [
  { id: 1, number: '6E 2112', airline: 'IndiGo', airlineCode: '6E', origin: 'DEL', destination: 'BOM', date: '2026-07-29', scheduledDeparture: '06:20', actualDeparture: '06:28', scheduledArrival: '08:35', actualArrival: '08:41', delayMinutes: 8, status: 'Delayed', distance: 1148 },
  { id: 2, number: 'AI 865', airline: 'Air India', airlineCode: 'AI', origin: 'DEL', destination: 'BOM', date: '2026-07-29', scheduledDeparture: '10:00', actualDeparture: '09:58', scheduledArrival: '12:15', actualArrival: '12:09', delayMinutes: 0, status: 'On time', distance: 1148 },
  { id: 3, number: 'UK 816', airline: 'Vistara', airlineCode: 'UK', origin: 'BLR', destination: 'DEL', date: '2026-07-29', scheduledDeparture: '11:30', actualDeparture: '11:42', scheduledArrival: '14:10', actualArrival: '14:18', delayMinutes: 12, status: 'Delayed', distance: 1740 },
  { id: 4, number: 'QP 1342', airline: 'Akasa Air', airlineCode: 'QP', origin: 'BOM', destination: 'BLR', date: '2026-07-29', scheduledDeparture: '14:45', actualDeparture: '14:43', scheduledArrival: '16:25', actualArrival: '16:19', delayMinutes: 0, status: 'On time', distance: 842 },
  { id: 5, number: 'SG 8152', airline: 'SpiceJet', airlineCode: 'SG', origin: 'CCU', destination: 'DEL', date: '2026-07-28', scheduledDeparture: '18:10', actualDeparture: '18:55', scheduledArrival: '20:35', actualArrival: '21:20', delayMinutes: 45, status: 'Delayed', distance: 1305 },
  { id: 6, number: '6E 6401', airline: 'IndiGo', airlineCode: '6E', origin: 'HYD', destination: 'MAA', date: '2026-07-28', scheduledDeparture: '20:15', actualDeparture: '20:12', scheduledArrival: '21:30', actualArrival: '21:24', delayMinutes: 0, status: 'On time', distance: 520 },
];

export const routes = [
  { id: 1, origin: 'DEL', destination: 'BOM', flightCount: 8420, averageDelay: 18, reliabilityScore: 86, bestTimeToFly: '07:00', worstMonth: 'July', averageFlightTime: 132 },
  { id: 2, origin: 'BLR', destination: 'DEL', flightCount: 7150, averageDelay: 22, reliabilityScore: 81, bestTimeToFly: '07:00', worstMonth: 'December', averageFlightTime: 158 },
  { id: 3, origin: 'BOM', destination: 'BLR', flightCount: 6890, averageDelay: 14, reliabilityScore: 89, bestTimeToFly: '10:00', worstMonth: 'July', averageFlightTime: 105 },
  { id: 4, origin: 'DEL', destination: 'HYD', flightCount: 5240, averageDelay: 26, reliabilityScore: 77, bestTimeToFly: '10:00', worstMonth: 'December', averageFlightTime: 128 },
  { id: 5, origin: 'CCU', destination: 'DEL', flightCount: 4810, averageDelay: 31, reliabilityScore: 72, bestTimeToFly: '06:00', worstMonth: 'July', averageFlightTime: 145 },
];

export const monthlyTrend = [
  { month: 'Jan', averageDelay: 18, onTimePercentage: 81 }, { month: 'Feb', averageDelay: 15, onTimePercentage: 84 },
  { month: 'Mar', averageDelay: 14, onTimePercentage: 85 }, { month: 'Apr', averageDelay: 17, onTimePercentage: 82 },
  { month: 'May', averageDelay: 21, onTimePercentage: 78 }, { month: 'Jun', averageDelay: 28, onTimePercentage: 72 },
  { month: 'Jul', averageDelay: 24, onTimePercentage: 75 }, { month: 'Aug', averageDelay: 20, onTimePercentage: 79 },
  { month: 'Sep', averageDelay: 16, onTimePercentage: 83 }, { month: 'Oct', averageDelay: 13, onTimePercentage: 87 },
  { month: 'Nov', averageDelay: 19, onTimePercentage: 80 }, { month: 'Dec', averageDelay: 26, onTimePercentage: 74 },
];

export const dashboard = {
  totals: { flights: 118420, averageDelay: 18.6, onTimePercentage: 81.7, airlines: 5, airports: 64 },
  monthlyTrend,
  delayDistribution: [
    { range: 'On time', flights: 58240 }, { range: '< 15m', flights: 22180 },
    { range: '15–30m', flights: 12860 }, { range: '30–60m', flights: 7920 },
    { range: '> 60m', flights: 4110 },
  ],
  delayByAirline: airlines.map(({ code, name, averageDelay, onTimePercentage }) => ({ code, name, averageDelay, onTimePercentage })),
  topDelayedRoutes: [...routes].sort((a, b) => b.averageDelay - a.averageDelay),
  peakDelayHours: [
    { hour: 0, averageDelay: 8 }, { hour: 3, averageDelay: 5 }, { hour: 6, averageDelay: 14 },
    { hour: 9, averageDelay: 21 }, { hour: 12, averageDelay: 18 }, { hour: 15, averageDelay: 25 },
    { hour: 18, averageDelay: 31 }, { hour: 21, averageDelay: 19 },
  ],
};
