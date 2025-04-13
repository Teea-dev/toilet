// "use client";
// import { useState, useRef, useEffect, use } from "react";
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

// interface MapProps {
//   centerLat?: number;
//   centerLng?: number;
// }
// export default function Map({
//   centerLat = 7.44108,
//   centerLng = 3.9042,
// }: MapProps) {
//   const mapRef = useRef<mapboxgl.Map | null>(null);
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const markersRef = useRef<mapboxgl.Marker[]>([]);
//   const [toilets, setToilets] = useState<ToiletDataFormat[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [center, setCenter] = useState<[number, number]>([0, 0]);
//   const [zoom, setZoom] = useState<number>(2.5);
//   const [pitch, setPitch] = useState<number>(52);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [userLocation, setUserLocation] = useState<[number, number] | null>(
//     null
//   );

//   // Get the token from environment variable
//   const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

//   function getColorByStatus(isOpen: boolean, isAccessible: boolean) {
//     if (!isOpen)
//       return "h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]";
//     if (isAccessible)
//       return "h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)]";
//     return "h-2 w-2 rounded-full bg-amber-400 shadow-[0px_0px_4px_2px_rgba(245,158,11,0.9)]";
//   }

//   useEffect(() => {
//     const fetchToilets = async () => {
//       try {
//         setLoading(true);
//         // Use user location if available
//         const params = userLocation
//           ? `?latitude=${userLocation[1]}&longitude=${userLocation[0]}`
//           : "";

//         const response = await fetch(
//           `http://localhost:5000/api/toilets${params}`
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch toilet data");
//         }

//         const data = await response.json();
//         setToilets(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching toilet data:", err);
//         setError("Failed to load toilet locations. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchToilets();
//   }, [userLocation]);
//   //   // Initialize map
//   useEffect(() => {
//     if (!mapboxToken) {
//       console.error("Mapbox token is not defined in environment variables.");
//       return;
//     }

//     mapboxgl.accessToken = mapboxToken;

//     if (!mapRef.current && mapContainerRef.current) {
//       // Default center position if user position is not available

//       mapRef.current = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: "mapbox://styles/mapbox/streets-v11",
//         center: [centerLng, centerLat],
//         zoom: zoom,
//         pitch: pitch,
//         attributionControl: true,
//       });

//       mapRef.current.on("load", () => {
//         console.log("Map loaded successfully");
//         setCenter([centerLng, centerLat]);
//         setMapLoaded(true);

//         // After confirming map loads, switch to custom style if needed
//         mapRef.current?.setStyle(
//           "mapbox://styles/adetokunbo/cm84el8s1002q01sebajs3ril"
//         );
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
//   }, [centerLat, centerLng, mapboxToken]);

//   // Add markers when data or user position changes

//   useEffect(() => {
//     if (!mapRef.current || loading || toilets.length === 0) return;

//     toilets.forEach((toilet) => {
//       const markerElement = document.createElement("div");
//       // markerElement.className = getColorByStatus(
//       //   toilet.is_open,
//       //   toilet.is_accessible
//       // );
//       // markerElement.addEventListener("click", () => {
//       //   console.log(`Toilet ${toilet.id} was clicked`);
//       // });
//       markerElement.className = "toilet-marker";
//       markerElement.style.width = "20px";
//       markerElement.style.height = "20px";
//       markerElement.style.borderRadius = "50%";
//       markerElement.style.backgroundColor = toilet.is_open
//         ? "#4CAF50"
//         : "#F44336";
//       markerElement.style.border = "2px solid white";
//       markerElement.style.cursor = "pointer";
//       const cleanlinessDisplay = toilet.cleanliness_rating !== undefined
//       ? toilet.cleanliness_rating.toFixed(1)
//       : "No rating";
//       const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
//         <h3>${toilet.name}</h3>
//         <p><strong>Rating:</strong> ${cleanlinessDisplay}/5</p>
//       <p><strong> Facilities: </strong>
//  ${toilet.is_male ? "👨" : ""}
//              ${toilet.is_female ? "👩" : ""}
//              ${toilet.is_accessible ? "♿" : ""}
//           </p>
//           <p><strong>Status:</strong> ${toilet.is_open ? "Open" : "Closed"}</p>
//           ${
//             toilet.distance
//               ? `<p><strong>Distance:</strong> ${toilet.distance.toFixed(
//                   2
//                 )} km</p>`
//               : ""
//           }
//           <p>${toilet.description}</p>
//         `);

//       new mapboxgl.Marker(markerElement)
//         .setLngLat([toilet.longitude, toilet.latitude])
//         .setPopup(popup)
//         .addTo(mapRef.current!);
//     });

//     // Fit map to show all toilets (if more than one)
//     if (toilets.length > 1) {
//       const bounds = new mapboxgl.LngLatBounds();
//       toilets.forEach((toilet) => {
//         bounds.extend([toilet.longitude, toilet.latitude]);
//       });
//       mapRef.current.fitBounds(bounds, { padding: 70, maxZoom: 15 });
//     }
//   }, [toilets, loading]);

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

// interface MapProps {
//   centerLat?: number;
//   centerLng?: number;
// }

// export default function Map({
//   centerLat = 7.44108,
//   centerLng = 3.9042,
// }: MapProps) {
//   const mapRef = useRef<mapboxgl.Map | null>(null);
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const [toilets, setToilets] = useState<ToiletDataFormat[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [center, setCenter] = useState<[number, number]>([centerLng, centerLat]);
//   const [zoom, setZoom] = useState<number>(17.5);
//   const [pitch, setPitch] = useState<number>(52);
//   const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

//   // Get the token from environment variable
//   const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

//   function getColorByStatus(isOpen: boolean, isAccessible: boolean) {
//     if (!isOpen)
//       return "h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]";
//     if (isAccessible)
//       return "h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)]";
//     return "h-2 w-2 rounded-full bg-amber-400 shadow-[0px_0px_4px_2px_rgba(245,158,11,0.9)]";
//   }

//   useEffect(() => {
//     const fetchToilets = async () => {
//       try {
//         setLoading(true);
//         // Use user location if available
//         const params = userLocation
//           ? `?latitude=${userLocation[1]}&longitude=${userLocation[0]}`
//           : "";

//         const response = await fetch(
//           `http://localhost:5000/api/toilets${params}`
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch toilet data");
//         }

//         const data = await response.json();
//         setToilets(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching toilet data:", err);
//         setError("Failed to load toilet locations. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchToilets();
//   }, [userLocation]);

//   // Initialize map
//   useEffect(() => {
//     if (!mapboxToken) {
//       console.error("Mapbox token is not defined in environment variables.");
//       return;
//     }

//     mapboxgl.accessToken = mapboxToken;

//     if (!mapRef.current && mapContainerRef.current) {
//       mapRef.current = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: "mapbox://styles/adetokunbo/cm84el8s1002q01sebajs3ril", 
//         center: center,
//         zoom: zoom,
//         pitch: pitch,
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

//     // Add markers when map is loaded and data is available
//     if (mapRef.current && !loading && toilets.length > 0) {
//       // Clear existing markers if any
//       if (mapRef.current) {
//         const markers = document.getElementsByClassName('mapboxgl-marker');
//         while (markers[0]) {
//           markers[0].remove();
//         }
//       }

//       toilets.forEach((toilet) => {
//         const el = document.createElement("div");
//         el.className = getColorByStatus(toilet.is_open, toilet.is_accessible);

//         el.addEventListener("click", () => {
//           console.log(`Toilet ${toilet.id} was clicked`);
//           // Add any click behavior here
//         });

//         const cleanlinessDisplay = toilet.cleanliness_rating !== undefined
//           ? toilet.cleanliness_rating.toFixed(1)
//           : "No rating";
          
//         const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
//           <h3>${toilet.name}</h3>
//           <p><strong>Rating:</strong> ${cleanlinessDisplay}/5</p>
//           <p><strong>Facilities:</strong>
//              ${toilet.is_male ? "👨" : ""}
//              ${toilet.is_female ? "👩" : ""}
//              ${toilet.is_accessible ? "♿" : ""}
//           </p>
//           <p><strong>Status:</strong> ${toilet.is_open ? "Open" : "Closed"}</p>
//           ${
//             toilet.distance
//               ? `<p><strong>Distance:</strong> ${toilet.distance.toFixed(2)} km</p>`
//               : ""
//           }
//           <p> <strong>Description:</strong>${toilet.description}</p>
//         `);

//         new mapboxgl.Marker(el)
//           .setLngLat([toilet.longitude, toilet.latitude])
//           .setPopup(popup)
//           .addTo(mapRef.current!);
//       });

//       // Add user location marker if available
//       if (userLocation) {
//         const userMarker = document.createElement("div");
//         userMarker.className = "h-3 w-3 border-[1.5px] border-zinc-50 rounded-full bg-blue-400 shadow-[0px_0px_4px_2px_rgba(14,165,233,1)]";

//         new mapboxgl.Marker(userMarker)
//           .setLngLat([userLocation[0], userLocation[1]])
//           .addTo(mapRef.current);
//       }
//     }

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove();
//         mapRef.current = null;
//       }
//     };
//   }, [centerLat, centerLng, mapboxToken, toilets, loading, userLocation]);

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



"use client";
import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface ToiletDataFormat {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  is_male: boolean;
  is_female: boolean;
  is_accessible: boolean;
  is_open: boolean;
  cleaniness_rating: number;
  description: string;
  distance?: number;
}

interface MapProps {
  data: ToiletDataFormat[];
  userPosition: [number, number];
  handleMarkerClick: (building: string) => void;
}

export default function Map({
  data,
  userPosition,
  handleMarkerClick
}: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [center, setCenter] = useState<[number, number]>([3.9042, 7.44108]); // Default UI coordinates
  const [zoom, setZoom] = useState<number>(17.5);
  const [pitch, setPitch] = useState<number>(52);

  // Get the token from environment variable
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  function getColorByStatus(isOpen: boolean, isAccessible: boolean) {
    if (!isOpen)
      return "h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]";
    if (isAccessible)
      return "h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)]";
    return "h-2 w-2 rounded-full bg-amber-400 shadow-[0px_0px_4px_2px_rgba(245,158,11,0.9)]";
  }

  // Initialize map
  useEffect(() => {
    if (!mapboxToken) {
      console.error("Mapbox token is not defined in environment variables.");
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/adetokunbo/cm84el8s1002q01sebajs3ril", 
        center: center,
        zoom: zoom,
        pitch: pitch,
      });

      mapRef.current.on("move", () => {
        if (mapRef.current) {
          const mapCenter = mapRef.current.getCenter();
          setCenter([mapCenter.lng, mapCenter.lat]);
          setZoom(mapRef.current.getZoom());
          setPitch(mapRef.current.getPitch());
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapboxToken]);

  // Add markers when data or user position changes
  useEffect(() => {
    if (!mapRef.current || !data.length) return;

    // Clear existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    data.forEach((toilet) => {
      const el = document.createElement("div");
      el.className = getColorByStatus(toilet.is_open, toilet.is_accessible);

      el.addEventListener("click", () => {
        handleMarkerClick(toilet.name);
      });

      const cleanlinessDisplay = toilet.cleaniness_rating !== undefined
        ? toilet.cleaniness_rating.toFixed(1)
        : "No rating";
        
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h3>${toilet.name}</h3>
        <p><strong>Rating:</strong> ${cleanlinessDisplay}/5</p>
        <p><strong>Facilities:</strong>
           ${toilet.is_male ? "👨" : ""}
           ${toilet.is_female ? "👩" : ""}
           ${toilet.is_accessible ? "♿" : ""}
        </p>
        <p><strong>Status:</strong> ${toilet.is_open ? "Open" : "Closed"}</p>
        ${
          toilet.distance
            ? `<p><strong>Distance:</strong> ${toilet.distance.toFixed(2)} km</p>`
            : ""
        }
        <p><strong>Description:</strong> ${toilet.description}</p>
      `);

      new mapboxgl.Marker(el)
        .setLngLat([toilet.longitude, toilet.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);
    });

    // Add user location marker if available
    if (userPosition && userPosition[0] !== 0 && userPosition[1] !== 0) {
      const userMarker = document.createElement("div");
      userMarker.className = "h-3 w-3 border-[1.5px] border-zinc-50 rounded-full bg-blue-400 shadow-[0px_0px_4px_2px_rgba(14,165,233,1)]";

      new mapboxgl.Marker(userMarker)
        .setLngLat([userPosition[1], userPosition[0]])
        .addTo(mapRef.current);
        
      // Center map on user position if it's valid
      mapRef.current.flyTo({
        center: [userPosition[1], userPosition[0]],
        zoom: 17
      });
    }
  }, [data, userPosition, handleMarkerClick]);

  return (
    <div className="h-[60vh] sm:w-full sm:h-full relative bg-red-500/0 rounded-[20px] p-2 sm:p-0">
      <div
        id="map-container"
        ref={mapContainerRef}
        className="opacity-100 h-full w-full rounded-[20px] overflow-hidden"
      />
      <div className="bg-[#18181b]/90 absolute bottom-10 left-2 sm:bottom-8 sm:left-0 flex flex-col gap-2 m-1 py-2.5 p-2 rounded-[16px]">
        <div className="flex items-center gap-0">
          <div className="h-2 w-2 rounded-full bg-red-400 flex-none"></div>
          <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-red-700/30 text-red-300/90">
            Closed
          </div>
        </div>
        <div className="flex items-center gap-0">
          <div className="h-2 w-2 rounded-full bg-amber-400 flex-none"></div>
          <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-amber-800/30 text-amber-300/90">
            Open (Not Accessible)
          </div>
        </div>
        <div className="flex items-center gap-0">
          <div className="h-2 w-2 rounded-full bg-green-400 flex-none"></div>
          <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-green-800/30 text-green-300/90">
            Open & Accessible
          </div>
        </div>
      </div>
    </div>
  );
}