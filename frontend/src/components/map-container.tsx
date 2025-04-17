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

