BEGIN;

INSERT INTO airlines (code, name) VALUES
  ('AI', 'Air India'), ('6E', 'IndiGo'), ('UK', 'Vistara'),
  ('SG', 'SpiceJet'), ('QP', 'Akasa Air')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO airports (code, name, city, latitude, longitude) VALUES
  ('DEL', 'Indira Gandhi International Airport', 'New Delhi', 28.556162, 77.099958),
  ('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 19.089560, 72.865614),
  ('BLR', 'Kempegowda International Airport', 'Bengaluru', 13.198635, 77.706593),
  ('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad', 17.240263, 78.429385),
  ('MAA', 'Chennai International Airport', 'Chennai', 12.994112, 80.170867),
  ('CCU', 'Netaji Subhas Chandra Bose International Airport', 'Kolkata', 22.654739, 88.446722)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, city = EXCLUDED.city;

INSERT INTO routes (origin_airport_id, destination_airport_id, distance_km, scheduled_duration_minutes)
SELECT origin.id, destination.id, seed.distance_km, seed.duration
FROM (VALUES
  ('DEL','BOM',1148,135), ('BLR','DEL',1740,160), ('BOM','BLR',842,105),
  ('DEL','HYD',1265,130), ('CCU','DEL',1305,145), ('HYD','MAA',520,75)
) AS seed(origin_code, destination_code, distance_km, duration)
JOIN airports origin ON origin.code = seed.origin_code
JOIN airports destination ON destination.code = seed.destination_code
ON CONFLICT (origin_airport_id, destination_airport_id)
DO UPDATE SET distance_km = EXCLUDED.distance_km, scheduled_duration_minutes = EXCLUDED.scheduled_duration_minutes;

INSERT INTO flights (
  flight_number, airline_id, route_id, flight_date, scheduled_departure, actual_departure,
  scheduled_arrival, actual_arrival, delay_minutes, status, weather
)
SELECT seed.flight_number, airline.id, route.id, seed.flight_date::date, seed.scheduled_departure::time,
  seed.actual_departure::time, seed.scheduled_arrival::time, seed.actual_arrival::time,
  seed.delay_minutes, seed.status, seed.weather
FROM (VALUES
  ('6E 2112','6E','DEL','BOM','2026-07-29','06:20','06:28','08:35','08:41',8,'Delayed','Clear'),
  ('AI 865','AI','DEL','BOM','2026-07-29','10:00','09:58','12:15','12:09',0,'On time','Clear'),
  ('UK 816','UK','BLR','DEL','2026-07-29','11:30','11:42','14:10','14:18',12,'Delayed','Cloudy'),
  ('QP 1342','QP','BOM','BLR','2026-07-29','14:45','14:43','16:25','16:19',0,'On time','Clear'),
  ('SG 8152','SG','CCU','DEL','2026-07-28','18:10','18:55','20:35','21:20',45,'Delayed','Rain'),
  ('6E 6401','6E','HYD','MAA','2026-07-28','20:15','20:12','21:30','21:24',0,'On time','Clear')
) AS seed(flight_number, airline_code, origin_code, destination_code, flight_date,
  scheduled_departure, actual_departure, scheduled_arrival, actual_arrival, delay_minutes, status, weather)
JOIN airlines airline ON airline.code = seed.airline_code
JOIN airports origin ON origin.code = seed.origin_code
JOIN airports destination ON destination.code = seed.destination_code
JOIN routes route ON route.origin_airport_id = origin.id AND route.destination_airport_id = destination.id
ON CONFLICT (flight_number, flight_date) DO UPDATE SET
  actual_departure = EXCLUDED.actual_departure, actual_arrival = EXCLUDED.actual_arrival,
  delay_minutes = EXCLUDED.delay_minutes, status = EXCLUDED.status, weather = EXCLUDED.weather;

COMMIT;
