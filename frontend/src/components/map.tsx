
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
  opening_time?: string;
  closing_time?: string;
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
  const [center, setCenter] = useState<[number, number]>([3.9042, 7.44108]); 
  const [zoom, setZoom] = useState<number>(17.5);
  const [pitch, setPitch] = useState<number>(52);

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
  }, [mapboxToken ]);

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