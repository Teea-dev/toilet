// "use client";
// import { useState, useRef, useEffect } from "react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// interface ToiletDataFormat {
//   id: number;
//   name: string;
//   location: string;
//   latitude: number;
//   longitude: number;
//   is_male: boolean;
//   is_female: boolean;
//   is_accessible: boolean;
//   is_open: boolean;
//   cleanliness_rating: number;
//   description: string;
//   distance?: number;
// }

// export default function Map({
//   data,
//   userPosition,
//   handleMarkerClick,
// }: {
//   data: ToiletDataFormat[];
//   userPosition: [number, number] | null;
//   handleMarkerClick: (toiletId: number) => void;
// }) {
//   const mapRef = useRef<mapboxgl.Map | null>(null);
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const markersRef = useRef<mapboxgl.Marker[]>([]);
  
//   const [center, setCenter] = useState<[number, number]>([0, 0]);
//   const [zoom, setZoom] = useState<number>(17.5);
//   const [pitch, setPitch] = useState<number>(52);
//   const [mapLoaded, setMapLoaded] = useState(false);

//   // Get the token from environment variable
//   const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

//   function getColorByStatus(isOpen: boolean, isAccessible: boolean) {
//     if (!isOpen)
//       return "h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]";
//     if (isAccessible)
//       return "h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)]";
//     return "h-2 w-2 rounded-full bg-amber-400 shadow-[0px_0px_4px_2px_rgba(245,158,11,0.9)]";
//   }

//   // Initialize map
//   useEffect(() => {
//     if (!mapboxToken) {
//       console.error("Mapbox token is not defined in environment variables.");
//       return;
//     }

//     mapboxgl.accessToken = mapboxToken;

//     if (!mapRef.current && mapContainerRef.current) {
//       // Default center position if user position is not available
//       const initialPosition: [number, number] = userPosition || [0, 0];

//       mapRef.current = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: "mapbox://styles/mapbox/streets-v11",
//         center: initialPosition,
//         zoom: zoom,
//         pitch: pitch,
//         attributionControl: true,
//       });

//       mapRef.current.on("load", () => {
//         console.log("Map loaded successfully");
//         setMapLoaded(true);
        
//         // After confirming map loads, switch to custom style if needed
//         mapRef.current?.setStyle(
//           "mapbox://styles/adetokunbo/cm84el8s1002q01sebajs3ril"
//         );
        
//         // Set center to user position if available
//         if (userPosition && userPosition[0] !== 0 && userPosition[1] !== 0) {
//           mapRef.current?.setCenter([userPosition[1], userPosition[0]]);
//           setCenter([userPosition[1], userPosition[0]]);
//         }
//       });

//       mapRef.current.on("error", (e) => {
//         console.error("Mapbox error:", e);
//       });

//       mapRef.current.on("move", () => {
//         if (mapRef.current) {
//           const mapCenter = mapRef.current.getCenter();
//           setCenter([mapCenter.lng, mapCenter.lat]);
//           setZoom(mapRef.current.getZoom());
//           setPitch(mapRef.current.getPitch());
//         }
//       });
//     }

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove();
//         mapRef.current = null;
//       }
//     };
//   }, [mapboxToken, userPosition]);

//   // Add markers when data or user position changes
//   useEffect(() => {
//     if (!mapRef.current || !mapLoaded || !data) return;

//     // Clear any existing markers
//     markersRef.current.forEach(marker => marker.remove());
//     markersRef.current = [];

//     // Add toilet markers
//     data.forEach((toilet) => {
//       if (!toilet.latitude || !toilet.longitude) {
//         console.warn(`Missing coordinates for toilet ${toilet.id}`);
//         return;
//       }

//       const el = document.createElement("div");
//       el.className = getColorByStatus(toilet.is_open, toilet.is_accessible);
      
//       el.addEventListener("click", () => {
//         handleMarkerClick(toilet.id);
        
//         // Optional: Scroll to the toilet in the list if you have an element with this ID
//         const toiletItem = document.getElementById(`toilet-${toilet.id}`);
//         if (toiletItem) {
//           toiletItem.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         }
//       });

//       // Create a popup with toilet details
//       const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
//         <h3>${toilet.name}</h3>
//         <p>Location: ${toilet.location || 'N/A'}</p>
//         <p>Open: ${toilet.is_open ? "Yes" : "No"}</p>
//         <p>Accessible: ${toilet.is_accessible ? "Yes" : "No"}</p>
//         <p>Male Facilities: ${toilet.is_male ? "Yes" : "No"}</p>
//         <p>Female Facilities: ${toilet.is_female ? "Yes" : "No"}</p>
//         <p>Cleanliness: ${toilet.cleanliness_rating}/5</p>
//       `);

//       const marker = new mapboxgl.Marker(el)
//         .setLngLat([toilet.longitude, toilet.latitude])
//         .setPopup(popup)
//         .addTo(mapRef.current!);
        
//       markersRef.current.push(marker);
//     });

//     // Add user position marker if available
//     if (userPosition && userPosition[0] !== 0 && userPosition[1] !== 0) {
//       const userEl = document.createElement("div");
//       userEl.className =
//         "h-3 w-3 border-[1.5px] border-zinc-50 rounded-full bg-blue-400 shadow-[0px_0px_4px_2px_rgba(14,165,233,1)]";

//       const userMarker = new mapboxgl.Marker(userEl)
//         .setLngLat([userPosition[1], userPosition[0]])
//         .addTo(mapRef.current);
        
//       markersRef.current.push(userMarker);
      
//       // Only auto-center on first load or when userPosition changes
//       if (data.length > 0 && mapRef.current) {
//         // Find bounds that include all toilets and user position
//         const bounds = new mapboxgl.LngLatBounds();
//         bounds.extend([userPosition[1], userPosition[0]]);
        
//         data.forEach(toilet => {
//           if (toilet.latitude && toilet.longitude) {
//             bounds.extend([toilet.longitude, toilet.latitude]);
//           }
//         });
        
//         // Fit map to these bounds
//         mapRef.current.fitBounds(bounds, {
//           padding: { top: 50, bottom: 50, left: 50, right: 50 }
//         });
//       }
//     }
//   }, [data, userPosition, mapLoaded, handleMarkerClick]);

//   return (
//     <div className="h-[60vh] sm:w-full sm:h-full relative bg-red-500/0 rounded-[20px] p-2 sm:p-0">
//       <div
//         id="map-container"
//         ref={mapContainerRef}
//         className="opacity-100 h-full w-full rounded-[20px] overflow-hidden"
//       />
//       <div className="bg-[#18181b]/90 absolute bottom-10 left-2 sm:bottom-8 sm:left-0 flex flex-col gap-2 m-1 py-2.5 p-2 rounded-[16px]">
//         <div className="flex items-center gap-0">
//           <div className="h-2 w-2 rounded-full bg-red-400 flex-none"></div>
//           <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-red-700/30 text-red-300/90">
//             Closed
//           </div>
//         </div>
//         <div className="flex items-center gap-0">
//           <div className="h-2 w-2 rounded-full bg-amber-400 flex-none"></div>
//           <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-amber-800/30 text-amber-300/90">
//             Open (Not Accessible)
//           </div>
//         </div>
//         <div className="flex items-center gap-0">
//           <div className="h-2 w-2 rounded-full bg-green-400 flex-none"></div>
//           <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-green-800/30 text-green-300/90">
//             Open & Accessible
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// NOTE: Replace with your actual Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Toilet {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  num_ratings: number;
  is_male: boolean;
  is_female: boolean;
  is_accessible: boolean;
  is_open: boolean;
  cleaniness_rating: number;
  description: string;
  distance?: number;
}

interface MapProps {
  centerLat?: number;
  centerLng?: number;
}

const ToiletMap: React.FC<MapProps> = ({
  centerLat = 7.44108, // Default center based on your sample data
  centerLng = 3.90420
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch toilets from API
  useEffect(() => {
    const fetchToilets = async () => {
      try {
        setLoading(true);
        // Use user location if available
        const params = userLocation
          ? `?latitude=${userLocation[1]}&longitude=${userLocation[0]}`
          : '';

        const response = await fetch(`http://localhost:5000/api/toilets${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch toilet data');
        }

        const data = await response.json();
        setToilets(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching toilet data:", err);
        setError('Failed to load toilet locations. Please try again.');
        setLoading(false);
      }
    };

    fetchToilets();
  }, [userLocation]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if user location is available
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.error("Could not get user location:", error);
        // Continue with default location
      }
    );

    // Initialize map with center location
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/adetokunbo/cm84el8s1002q01sebajs3ril', // Standard street style
      center: [centerLng, centerLat],
      zoom: 15
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [centerLat, centerLng]);

  // Add toilet markers when data and map are ready
  useEffect(() => {
    if (!map.current || loading || toilets.length === 0) return;

    // Add markers for each toilet
    toilets.forEach((toilet) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'toilet-marker';
      markerElement.style.width = '20px';
      markerElement.style.height = '20px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.backgroundColor = toilet.is_open ? '#4CAF50' : '#F44336';
      markerElement.style.border = '2px solid white';
      markerElement.style.cursor = 'pointer';

      // Create popup with toilet information
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <h3>${toilet.name}</h3>
          <p><strong>Rating:</strong> ${toilet.rating.toFixed(1)} (${toilet.num_ratings} ratings)</p>
          <p><strong>Cleanliness:</strong> ${toilet.cleaniness_rating.toFixed(1)}/5</p>
          <p><strong>Facilities:</strong>
             ${toilet.is_male ? '👨' : ''}
             ${toilet.is_female ? '👩' : ''}
             ${toilet.is_accessible ? '♿' : ''}
          </p>
          <p><strong>Status:</strong> ${toilet.is_open ? 'Open' : 'Closed'}</p>
          ${toilet.distance ? `<p><strong>Distance:</strong> ${toilet.distance.toFixed(2)} km</p>` : ''}
          <p>${toilet.description}</p>
        `);

      // Add marker to map
      new mapboxgl.Marker(markerElement)
        .setLngLat([toilet.longitude, toilet.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Fit map to show all toilets (if more than one)
    if (toilets.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      toilets.forEach(toilet => {
        bounds.extend([toilet.longitude, toilet.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 70, maxZoom: 15 });
    }
  }, [toilets, loading]);

  return (
    <div className="map-container">
      {error && <div className="error-message">{error}</div>}
      <div ref={mapContainer} style={{ width: '100%', height: '500px', borderRadius: '8px' }} />
      <style jsx>{`
        .map-container {
          position: relative;
          width: 100%;
          height: 500px;
          margin: 20px 0;
        }
        .error-message {
          color: red;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default ToiletMap;

// "use client";
// import { useState, useRef, useEffect } from "react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// interface ToiletDataFormat {
//   id: number;
//   name: string;
//   latitude: number;
//   longitude: number;
//   is_male: boolean;
//   is_female: boolean;
//   is_accessible: boolean;
//   is_open: boolean;
//   cleaniness_rating: number; // Note: this should be renamed to cleanliness_rating to match the API
//   description: string;
//   distance?: number;
//   location?: string; // Added to match the API format
// }

// export default function Map() {
//   const mapRef = useRef<mapboxgl.Map | null>(null);
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const [center, setCenter] = useState<[number, number]>([0, 0]);
//   const [zoom, setZoom] = useState<number>(16.25);
//   const [pitch, setPitch] = useState<number>(52);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [toiletData, setToiletData] = useState<ToiletDataFormat[]>([]);
//   const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Get the token from environment variable
//   const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

//   // Function to get user's current position
//   const getCurrentPosition = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setUserPosition([latitude, longitude]);
//           fetchToiletData(latitude, longitude);
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           setError("Unable to get your location. Showing all toilets.");
//           fetchAllToiletData();
//         }
//       );
//     } else {
//       setError("Geolocation is not supported by your browser. Showing all toilets.");
//       fetchAllToiletData();
//     }
//   };

//   // Function to fetch toilet data with user position
//   const fetchToiletData = async (lat: number, long: number) => {
//     try {
//       setIsLoading(true);
//       const response = await fetch('/api/toilets', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ lat, long }),
//       });

//       if (!response.ok) {
//         throw new Error(`API error: ${response.status}`);
//       }

//       const data = await response.json();
//       setToiletData(data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Failed to fetch toilet data:", error);
//       setError("Failed to load toilet data. Please try again later.");
//       setIsLoading(false);
//       // Fallback to getting all toilets
//       fetchAllToiletData();
//     }
//   };

//   // Function to fetch all toilet data without position
//   const fetchAllToiletData = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch('/api/toilets', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`API error: ${response.status}`);
//       }

//       const data = await response.json();
//       setToiletData(data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Failed to fetch all toilet data:", error);
//       setError("Failed to load toilet data. Please try again later.");
//       setIsLoading(false);
//     }
//   };

//   // Handle marker click
//   const handleMarkerClick = (toiletId: number) => {
//     // Add your logic here for what happens when a toilet marker is clicked
//     console.log(`Toilet ${toiletId} was clicked`);
//     // You could navigate to a detail page or show more info
//   };

//   function getColorByStatus(isOpen: boolean, isAccessible: boolean) {
//     if (!isOpen) return "h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]";
//     if (isAccessible) return "h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)]";
//     return "h-2 w-2 rounded-full bg-amber-400 shadow-[0px_0px_4px_2px_rgba(245,158,11,0.9)]";
//   }

//   // Initialize map and get user position
//   useEffect(() => {
//     getCurrentPosition();
//   }, []);

//   useEffect(() => {
//     // Debug: Check if token is available
//     if (!mapboxToken) {
//       console.error("Mapbox token is not defined in environment variables.");
//       return;
//     }

//     // Set the token
//     mapboxgl.accessToken = mapboxToken;

//     // Create map instance
//     if (!mapRef.current && mapContainerRef.current) {
//       // Use user position if available, otherwise use default
//       const initialPosition: [number, number] = userPosition
//         ? [userPosition[1], userPosition[0]]
//         : [3.9042, 7.44108]; // Default position

//       mapRef.current = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: "mapbox://styles/mapbox/streets-v11", // Use standard style first to verify map works
//         center: initialPosition,
//         zoom: zoom,
//         pitch: pitch,
//         attributionControl: true,
//       });

//       // Add event listeners
//       mapRef.current.on("load", () => {
//         console.log("Map loaded successfully");
//         setMapLoaded(true);

//         // Switch to custom style after map loads
//         mapRef.current?.setStyle("mapbox://styles/adetokunbo/cm84el8s1002q01sebajs3ril");
//       });

//       mapRef.current.on("error", (e) => {
//         console.error("Mapbox error:", e);
//       });

//       mapRef.current.on("move", () => {
//         if (mapRef.current) {
//           const mapCenter = mapRef.current.getCenter();
//           const mapZoom = mapRef.current.getZoom();
//           const mapPitch = mapRef.current.getPitch();
//           setZoom(mapZoom);
//           setPitch(mapPitch);
//           setCenter([mapCenter.lng, mapCenter.lat]);
//         }
//       });
//     }

//     // Cleanup function
//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove();
//         mapRef.current = null;
//       }
//     };
//   }, [mapboxToken, userPosition]); // Run when user position is updated

//   // Add markers after map is loaded and data is available
//   useEffect(() => {
//     if (!mapRef.current || !mapLoaded || !toiletData || toiletData.length === 0) return;

//     // Clear any existing markers first
//     const markers = document.querySelectorAll('.mapboxgl-marker');
//     markers.forEach(marker => marker.remove());

//     // Add toilet markers
//     toiletData.forEach((toilet) => {
//       const el = document.createElement("div");
//       el.className = getColorByStatus(toilet.is_open, toilet.is_accessible);
//       el.addEventListener("click", () => {
//         handleMarkerClick(toilet.id);
//       });

//       // Create a popup with toilet details
//       const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
//         <h3>${toilet.name}</h3>
//         <p>Location: ${toilet.location || 'Not specified'}</p>
//         <p>Open: ${toilet.is_open ? 'Yes' : 'No'}</p>
//         <p>Accessible: ${toilet.is_accessible ? 'Yes' : 'No'}</p>
//         <p>Male Facilities: ${toilet.is_male ? 'Yes' : 'No'}</p>
//         <p>Female Facilities: ${toilet.is_female ? 'Yes' : 'No'}</p>
//         <p>Cleanliness Rating: ${toilet.cleaniness_rating}/5</p>
//         ${toilet.distance ? `<p>Distance: ${(toilet.distance / 1000).toFixed(2)} km</p>` : ''}
//       `);

//       new mapboxgl.Marker(el)
//         .setLngLat([toilet.longitude, toilet.latitude])
//         .setPopup(popup)
//         .addTo(mapRef.current!);
//     });

//     // Add user position marker if available
//     if (userPosition) {
//       const e2 = document.createElement("div");
//       e2.className =
//         "h-3 w-3 border-[1.5px] border-zinc-50 rounded-full bg-blue-400 shadow-[0px_0px_4px_2px_rgba(14,165,233,1)]";

//       new mapboxgl.Marker(e2)
//         .setLngLat([userPosition[1], userPosition[0]])
//         .addTo(mapRef.current);
//     }
//   }, [toiletData, userPosition, mapLoaded]);

//   return (
//     <div className="h-[60vh] sm:w-full sm:h-full relative bg-red-500/0 rounded-[20px] p-2 sm:p-0">
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 rounded-[20px]">
//           <div className="bg-zinc-800 p-4 rounded-lg text-white">Loading toilet data...</div>
//         </div>
//       )}

//       {error && (
//         <div className="absolute top-4 right-4 bg-red-800/80 text-white p-2 rounded-lg z-10">
//           {error}
//         </div>
//       )}

//       <div id="map-container" ref={mapContainerRef} className="opacity-100 h-full w-full" />

//       <div className="bg-[#18181b]/90 absolute bottom-10 left-2 sm:bottom-8 sm:left-0 flex flex-col gap-2 m-1 py-2.5 p-2 rounded-[16px]">
//         <div className="flex items-center gap-0">
//           <div className="h-2 w-2 rounded-full bg-red-400 flex-none"></div>
//           <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-red-700/30 text-red-300/90">
//             Closed
//           </div>
//         </div>
//         <div className="flex items-center gap-0">
//           <div className="h-2 w-2 rounded-full bg-amber-400 flex-none"></div>
//           <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-amber-800/30 text-amber-300/90">
//             Not Accessible
//           </div>
//         </div>
//         <div className="flex items-center gap-0">
//           <div className="h-2 w-2 rounded-full bg-green-400 flex-none"></div>
//           <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-green-800/30 text-green-300/90">
//             Open and Accessible
//           </div>
//         </div>
//       </div>

//       {toiletData.length > 0 && (
//         <div className="absolute top-4 left-4 bg-zinc-800/80 p-2 rounded-lg z-10 text-white text-sm">
//           Found {toiletData.length} toilets
//         </div>
//       )}
//     </div>
//   );
// }
