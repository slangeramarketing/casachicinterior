// lib/utils/coords.ts

export const cityCoordinates: Record<string, [number, number]> = {
  // --- Delhi NCR Regions ---
  "Delhi": [77.1025, 28.6139],
  "New Delhi": [77.2090, 28.6139],
  "Noida": [77.3910, 28.5355],
  "Gurgaon": [77.0266, 28.4595],
  "Gurugram": [77.0266, 28.4595], // GA4 may use both names
  "Ghaziabad": [77.4229, 28.6692],
  "Faridabad": [77.3178, 28.4089],
  "Greater Noida": [77.5076, 28.4744],
  "Patna": [85.1376, 25.5941],

  // --- Other Major Indian Cities ---
  "Mumbai": [72.8777, 19.0760],
  "Bengaluru": [77.5946, 12.9716],
  "Bangalore": [77.5946, 12.9716],
  "Hyderabad": [78.4867, 17.3850],
  "Chennai": [80.2707, 13.0827],
  "Kolkata": [88.3639, 22.5726],
  "Pune": [73.8567, 18.5204],
  "Ahmedabad": [72.5714, 23.0225],
  "Jaipur": [75.7873, 26.9124],
  "Lucknow": [80.9462, 26.8467],

  // --- Global Hubs ---
  "London": [-0.1276, 51.5074],
  "New York": [-74.0060, 40.7128],
  "Dubai": [55.2708, 25.2048],
  "Paris": [2.3522, 48.8566],
  "Singapore": [103.8198, 1.3521],
};