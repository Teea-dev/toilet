"use client";
import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { isToiletOpen } from "./isToiletOpenUtility";
import type { Point } from 'geojson'; // Add this import

interface ToiletDataFormat {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  is_male: boolean;
  is_female: boolean;
  is_accessible: boolean;
  is_open: boolean; // We'll keep this in the interface but ignore it
  cleaniness_rating: number;
  description: string;
  opening_time?: string;
  closing_time?: string;
  open_monday?: boolean;
  open_tuesday?: boolean;
  open_wednesday?: boolean;
  open_thursday?: boolean;
  open_friday?: boolean;
  open_saturday?: boolean;
  open_sunday?: boolean;
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
  handleMarkerClick,
}: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [center, setCenter] = useState<[number, number]>([3.9042, 7.44108]);
  const [zoom, setZoom] = useState<number>(17.5);
  const [pitch, setPitch] = useState<number>(52);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Initialize map
  useEffect(() => {
    if (!mapboxToken) {
      console.error("Mapbox token is not defined in environment variables.");
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    if (!mapRef.current && mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/adetokunbo/cm84el8s1002q01sebajs3ril",
        center: center,
        zoom: zoom,
        pitch: pitch,
      });

      mapRef.current = map;

      map.on("move", () => {
        const mapCenter = map.getCenter();
        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(map.getZoom());
        setPitch(map.getPitch());
      });

      // Initialize map with toilet data
      map.on('load', () => {
        // We'll add the data source and layers here when data changes
      });

      // Error logging
      map.on('error', (e) => console.error('Mapbox error:', e));
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapboxToken]);

  // Update toilet markers when data changes
  useEffect(() => {
    if (!mapRef.current || !data.length) return;

    const map = mapRef.current;

    // Convert toilet data to GeoJSON format
    const geojsonData = {
      type: 'FeatureCollection' as const,
      features: data.map((toilet) => ({
        type: 'Feature' as const,
        properties: {
          id: toilet.id,
          name: toilet.name,
          description: toilet.description,
          is_accessible: toilet.is_accessible,
          is_male: toilet.is_male,
          is_female: toilet.is_female,
          cleaniness_rating: toilet.cleaniness_rating,
          opening_time: toilet.opening_time,
          closing_time: toilet.closing_time,
          distance: toilet.distance,
          isOpen: isToiletOpen(toilet),
          status: isToiletOpen(toilet) ? 
            (toilet.is_accessible ? 'accessible' : 'open') : 'closed'
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [toilet.longitude, toilet.latitude]
        }
      }))
    };

    // Helper function to add toilets source and layers
    function addToiletsSourceAndLayers(map: mapboxgl.Map, geojsonData: GeoJSON.FeatureCollection) {
      // Remove existing source and layers if they exist
      if (map.getSource('toilets')) {
        if (map.getLayer('toilets-closed')) map.removeLayer('toilets-closed');
        if (map.getLayer('toilets-open')) map.removeLayer('toilets-open');
        if (map.getLayer('toilets-accessible')) map.removeLayer('toilets-accessible');
        map.removeSource('toilets');
      }

      // Add the data source
      map.addSource('toilets', {
        type: 'geojson',
        data: geojsonData
      });

      // Add layers for different toilet statuses with larger circles
      // Closed toilets (red)
      map.addLayer({
        id: 'toilets-closed',
        type: 'circle',
        source: 'toilets',
        filter: ['==', ['get', 'status'], 'closed'],
        paint: {
          'circle-color': '#f87171', // red-400
          'circle-radius': 6, // Larger size
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9
        }
      });

      // Open toilets (amber)
      map.addLayer({
        id: 'toilets-open',
        type: 'circle',
        source: 'toilets',
        filter: ['==', ['get', 'status'], 'open'],
        paint: {
          'circle-color': '#fbbf24', // amber-400
          'circle-radius': 6, // Larger size
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9
        }
      });

      // Accessible toilets (green)
      map.addLayer({
        id: 'toilets-accessible',
        type: 'circle',
        source: 'toilets',
        filter: ['==', ['get', 'status'], 'accessible'],
        paint: {
          'circle-color': '#4ade80', // green-400
          'circle-radius': 5, // Larger size
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9
        }
      });
    }

    // Update toilets source and layers
    if (!mapRef.current) return;
    // const map = mapRef.current;
    const doAdd = () => addToiletsSourceAndLayers(map, geojsonData);

    if (!map.isStyleLoaded || !map.isStyleLoaded()) {
      // Wait for style load
      map.once('load', doAdd);
    } else {
      doAdd();
    }

    // Add click interactions for all toilet layers
    const layerIds = ['toilets-closed', 'toilets-open', 'toilets-accessible'];
    
    layerIds.forEach(layerId => {
      // Click handler
      map.on('click', layerId, (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const coordinates = (feature.geometry as Point).coordinates.slice() as [number, number];
          const properties = feature.properties!;

          // Handle marker click
          handleMarkerClick(properties.name);

          const cleanlinessDisplay = properties.cleaniness_rating !== undefined
            ? properties.cleaniness_rating.toFixed(1)
            : "No rating";

          // Create popup with larger close button
          const popup = new mapboxgl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: true  
          }).setHTML(`
            <div style="min-width: 220px; font-family: system-ui;">
              <h3 style="margin: 0 0 12px 0; font-weight: bold; font-size: 18px; color: #1f2937;">${properties.name}</h3>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Rating:</strong> ${cleanlinessDisplay}/5</p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Facilities:</strong>
                 ${properties.is_male ? "👨 " : ""}
                 ${properties.is_female ? "👩 " : ""}
                 ${properties.is_accessible ? "♿ " : ""}
              </p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Status:</strong> 
                <span style="color: ${properties.isOpen ? '#059669' : '#dc2626'}; font-weight: 600;">
                  ${properties.isOpen ? "Open" : "Closed"}
                </span>
              </p>
              ${properties.distance ? `<p style="margin: 6px 0; font-size: 14px;"><strong>Distance:</strong> ${properties.distance.toFixed(2)} km</p>` : ""}
              <p style="margin: 6px 0; font-size: 14px;"><strong>Description:</strong> ${properties.description}</p>
              ${properties.opening_time && properties.closing_time ? 
                `<p style="margin: 6px 0; font-size: 14px;"><strong>Hours:</strong> ${properties.opening_time} - ${properties.closing_time}</p>` : ""
              }
            </div>
          `);

          popup.setLngLat(coordinates).addTo(map);
        }
      });

      // Cursor pointer on hover
      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
      });
    });

  }, [data, handleMarkerClick]);

  // Update user position marker
  useEffect(() => {
    if (!mapRef.current || !userPosition || userPosition[0] === 0) return;

    const map = mapRef.current;

    // Remove existing user marker
    if (map.getSource('user-location')) {
      if (map.getLayer('user-location')) map.removeLayer('user-location');
      map.removeSource('user-location');
    }

    // Add user location
    map.addSource('user-location', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [userPosition[1], userPosition[0]]
        },
        properties: {} // Add empty properties object to satisfy GeoJSON type
      }
    });

    map.addLayer({
      id: 'user-location',
      type: 'circle',
      source: 'user-location',
      paint: {
        'circle-color': '#3b82f6', // blue-500
        'circle-radius': 10,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.8
      }
    });

    // Center map on user position
    map.flyTo({
      center: [userPosition[1], userPosition[0]],
      zoom: 17,
    });
  }, [userPosition]);

  return (
    <div className="h-[60vh] sm:w-full sm:h-full relative bg-red-500/0 rounded-[20px] p-2 sm:p-0">
      <div
        id="map-container"
        ref={mapContainerRef}
        className="opacity-100 h-full w-full rounded-[20px] overflow-hidden"
      />
      
      {/* Updated legend with larger indicators */}
      <div className="bg-[#18181b]/90 absolute bottom-10 left-2 sm:bottom-8 sm:left-0 flex flex-col gap-2 m-1 py-2.5 p-2 rounded-[16px]">
        <div className="flex items-center gap-0">
          <div className="h-3 w-3 rounded-full bg-red-400 flex-none border-1 border-white"></div>
          <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-red-700/30 text-red-300/90">
            Closed
          </div>
        </div>
        <div className="flex items-center gap-0">
          <div className="h-3 w-3 rounded-full bg-amber-400 flex-none border-1 border-white"></div>
          <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-amber-800/30 text-amber-300/90">
            Open (Not Accessible)
          </div>
        </div>
        <div className="flex items-center gap-0">
          <div className="h-3 w-3 rounded-full bg-green-400 flex-none border-1 border-white"></div>
          <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-green-800/30 text-green-300/90">
            Open & Accessible
          </div>
        </div>
      </div>
    </div>
  );
}
