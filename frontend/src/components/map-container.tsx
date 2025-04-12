// "use client";
// import { useState, useEffect } from 'react';
// import Map from './map';

// // Define the ToiletDataFormat type
// interface ToiletDataFormat {
//   id: number;
//   name: string;
//   latitude: number;
//   longitude: number;
//   is_male: boolean;
//   is_female: boolean;
//   is_accessible: boolean;
//   is_open: boolean;
//   cleaniness_rating: number;
//   description: string;
//   distance?: number;
// }

// export default function ToiletMapPage() {
//   const [toilets, setToilets] = useState<ToiletDataFormat[]>([]);
//   const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

//   useEffect(() => {
//     // Get user's current location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserPosition([position.coords.latitude, position.coords.longitude]);

//           // Fetch toilets near user location
//           fetch(`/api/toilets`, {
//             method: 'POST',
//             body: JSON.stringify({
//               lat: position.coords.latitude,
//               long: position.coords.longitude
//             })
//           })
//           .then(response => response.json())
//           .then(data => setToilets(data))
//           .catch(error => console.error('Error fetching toilets:', error));
//         },
//         (error) => {
//           console.error('Error getting location:', error);
//           // Fallback to fetching all toilets if location access fails
//           fetch('/api/toilets')
//             .then(response => response.json())
//             .then(data => setToilets(data))
//             .catch(error => console.error('Error fetching toilets:', error));
//         }
//       );
//     } else {
//       // Geolocation is not supported
//       fetch('/api/toilets')
//         .then(response => response.json())
//         .then(data => setToilets(data))
//         .catch(error => console.error('Error fetching toilets:', error));
//     }
//   }, []);

//   const handleMarkerClick = (toiletId: number) => {
//     // Implement any additional logic when a marker is clicked
//     console.log(`Clicked toilet with ID: ${toiletId}`);
//   };

//   return (
//     <Map
//       data={toilets}
//       userPosition={userPosition || [0, 0]}
//       handleMarkerClick={handleMarkerClick}
//     />
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import Map from "./map"; // Adjust the import path as needed
// import { fetchToilets } from "../utils/toiletService"; // Adjust the import path as needed
// // import { ToiletDataFormat } from "../types"; // Create this type or import it

// import ToiletDetail from "./toiletDetail";

// interface ToiletDataFormat {
//   id: number;
//   name: string;
//   latitude: number;
//   longitude: number;
//   is_male: boolean;
//   is_female: boolean;
//   is_accessible: boolean;
//   is_open: boolean;
//   cleaniness_rating: number;
//   description: string;
//   distance?: number;
// }

// export default function MapContainer() {
//   const [toilets, setToilets] = useState<ToiletDataFormat[]>([]);
//   const [userPosition, setUserPosition] = useState<[number, number] | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filters, setFilters] = useState<{
//     is_male?: boolean;
//     is_female?: boolean;
//     is_accessible?: boolean;
//     is_open?: boolean;
//   }>({
//     is_male: undefined,
//     is_female: undefined,
//     is_accessible: undefined,
//     is_open: undefined,
//   });
//   const [selectedToilet, setSelectedToilet] = useState<ToiletDataFormat | null>(
//     null
//   );

//   const handleMarkerClick = (toiletId: number) => {
//     const toilet = toilets.find((t) => t.id === toiletId);
//     if (toilet) {
//       setSelectedToilet(toilet);
//     }
//   };

//   // Get user's geolocation
//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserPosition([
//             position.coords.latitude,
//             position.coords.longitude,
//           ]);
//         },
//         (err) => {
//           console.error("Error getting location:", err);
//           // Default to UI location as in your original Map component
//           setUserPosition([7.44108, 3.9042]);
//         }
//       );
//     } else {
//       console.warn("Geolocation not available");
//       setUserPosition([7.44108, 3.9042]); // Default position
//     }
//   }, []);

//   // Fetch toilet data when user position is available or filters change
//   useEffect(() => {
//     async function loadToilets() {
//       if (!userPosition) return;

//       try {
//         setLoading(true);
//         const data = await fetchToilets(
//           userPosition[0],
//           userPosition[1],
//           filters
//         );
//         setToilets(data);
//         setError(null);
//       } catch (err) {
//         console.error("Failed to fetch toilets:", err);
//         setError("Failed to load toilet data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadToilets();
//   }, [userPosition, filters]);

//   return (
//     <div className="w-full h-full">
//       {loading && !toilets.length ? (
//         <div className="flex items-center justify-center h-full">
//           <p className="text-lg">Loading toilets near you...</p>
//         </div>
//       ) : error ? (
//         <div className="flex items-center justify-center h-full">
//           <p className="text-red-500">{error}</p>
//         </div>
//       ) : (
//         <Map
//           data={toilets}
//           userPosition={userPosition || [7.44108, 3.9042]}
//           handleMarkerClick={handleMarkerClick}
//         />
//       )}

//       {selectedToilet && (
//         <ToiletDetail
//           toilet={selectedToilet}
//           onClose={() => setSelectedToilet(null)}
//         />
//       )}
//       {/* Filter controls */}
//       <div className="my-3 flex flex-wrap gap-2">
//         <button
//           onClick={() =>
//             setFilters({
//               ...filters,
//               is_open: filters.is_open === true ? undefined : true,
//             })
//           }
//           className={`px-3 py-1.5 rounded-md ${
//             filters.is_open === true ? "bg-green-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Open Only
//         </button>
//         <button
//           onClick={() =>
//             setFilters({
//               ...filters,
//               is_accessible: filters.is_accessible === true ? undefined : true,
//             })
//           }
//           className={`px-3 py-1.5 rounded-md ${
//             filters.is_accessible === true
//               ? "bg-green-600 text-white"
//               : "bg-gray-200"
//           }`}
//         >
//           Accessible
//         </button>
//         <button
//           onClick={() =>
//             setFilters({
//               ...filters,
//               is_male: filters.is_male === true ? undefined : true,
//             })
//           }
//           className={`px-3 py-1.5 rounded-md ${
//             filters.is_male === true ? "bg-green-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Male
//         </button>
//         <button
//           onClick={() =>
//             setFilters({
//               ...filters,
//               is_female: filters.is_female === true ? undefined : true,
//             })
//           }
//           className={`px-3 py-1.5 rounded-md ${
//             filters.is_female === true
//               ? "bg-green-600 text-white"
//               : "bg-gray-200"
//           }`}
//         >
//           Female
//         </button>
//         <button
//           onClick={() =>
//             setFilters({
//               is_male: undefined,
//               is_female: undefined,
//               is_accessible: undefined,
//               is_open: undefined,
//             })
//           }
//           className="px-3 py-1.5 rounded-md bg-gray-300"
//         >
//           Clear Filters
//         </button>
//       </div>
//     </div>
//   );
// }
