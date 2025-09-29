"use client";
import { useState, useEffect } from "react";

import Left from "@/components/left";
import { ScrollArea } from "@/components/ui/scroll-area";
import Map from "@/components/map";
import Loading from "@/components/loading";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

export default function Home() {
  const [toilets, setToilets] = useState<ToiletDataFormat[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeBuilding, setActiveBuilding] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMarkerClick = (building: string) => {
    setActiveBuilding(building);
  };

  useEffect(() => {
    const fetchToiletData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;

              setUserPosition([lat, lng]);

              // Call the backend API with user coordinates
              try {
                const response = await fetch(
                  `http://localhost:5000/api/toilets`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ lat, lng }),
                  }
                );
                
                if (!response.ok) {
                  throw new Error(
                    `Failed to fetch toilet data: ${response.status}`
                  );
                }

                const data = await response.json();

                // Ensure data is an array
                if (Array.isArray(data)) {
                  setToilets(data);
                } else if (data.error) {
                  setError(data.error);
                  setToilets([]);
                } else {
                  setToilets([]);
                  setError("Received invalid data format from server");
                }
              } catch (error) {
                console.error("Error fetching toilets with location:", error);
                setError(
                  `Error fetching data: ${
                    error instanceof Error ? error.message : "Unknown error"
                  }`
                );

                // Fallback to default fetching without coordinates
                try {
                  const defaultResponse = await fetch(
                    `http://localhost:5000/api/toilets`
                  );
                  if (!defaultResponse.ok) {
                    throw new Error(
                      `Failed to fetch default toilet data: ${defaultResponse.status}`
                    );
                  }
                  const defaultData = await defaultResponse.json();
                  if (Array.isArray(defaultData)) {
                    setToilets(defaultData);
                  } else {
                    setToilets([]);
                  }
                } catch (fallbackError) {
                  console.error("Fallback fetch failed:", fallbackError);
                  setToilets([]);
                }
              }
            },
            async (error) => {
              setError(`Geolocation error: ${error.message}`);

              // Fallback: fetch all toilets without location filtering
              try {
                const response = await fetch(
                  `http://localhost:5000/api/toilets`
                );
                if (!response.ok) {
                  throw new Error(
                    `Failed to fetch toilet data: ${response.status}`
                  );
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                  setToilets(data);
                } else {
                  setToilets([]);
                }
              } catch (fallbackError) {
                console.error("Fallback fetch failed:", fallbackError);
                setToilets([]);
              }
            }
          );
        } else {
          console.warn("Geolocation is not supported by this browser");
          setError("Geolocation is not supported by this browser");

          // Fetch all toilets without location filtering
          try {
            const response = await fetch(
              `http://localhost:5000/api/toilets`
            );
            if (!response.ok) {
              throw new Error(
                `Failed to fetch toilet data: ${response.status}`
              );
            }
            const data = await response.json();
            console.log(data);
            if (Array.isArray(data)) {
              setToilets(data);
            } else {
              setToilets([]);
            }
          } catch (error) {
            console.error("Error fetching toilets:", error);
            setToilets([]);
          }
        }
      } catch (error) {
        console.error("Error in toilet data fetching:", error);
        setError(
          `Error: ${error instanceof Error ? error.message : String(error)}`
        );
        setToilets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchToiletData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="flex flex-col sm:flex-row sm:gap-4 h-screen">
      <div className="basis-2/5 sm-h-full order-last sm:order-first py-4 sm:px-0 sm:py-2 bg-[#18181b]/90 overflow-hidden sm:flex sm:flex-col">
        <div className="w-full h-20 pl-8 pr-4 hidden sm:flex sm:justify-between items-center">
          {/* {error && <div className="text-red-500">Error: {error}</div>} */}
          <Popover>
            <PopoverTrigger className=" cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={28}
                height={28}
                fill={"none"}
              >
                <path
                  d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                  stroke="white"
                  strokeWidth="1.7"
                />
                <path
                  d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11"
                  stroke="white"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.992 8H12.001"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </PopoverTrigger>
            <PopoverContent className="bg-zinc-950 border-zinc-600 text-zinc-100 w-72">
              <div className="font-bold mb-1">Important Notes:</div>
              <ul className="list-disc pl-4">
                <li>Some toilets may require special access or keys</li>
                <li>
                  Opening hours may vary during holidays and special events
                </li>
                <li>Click on map markers to see detailed information</li>
                <li>
                  For emergencies, look for toilets marked as &quot;Open&quot;
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
        <ScrollArea className="h-full">
          <div className="w-full h-20 pl-8 pr-8 sm:hidden flex justify-between items-center">
            {error && <div className="text-red-500">Error: {error}</div>}
            <Popover>
              <PopoverTrigger className=" cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={28}
                  height={28}
                  fill={"white"}
                >
                  <path
                    d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.992 8H12.001"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </PopoverTrigger>
              <PopoverContent className="bg-zinc-900 border-zinc-600 text-zinc-200 w-72">
                <div className="font-bold mb-1">Important Notes:</div>
                <ul className="list-disc pl-4">
                  <li>Some toilets may require special access or keys</li>
                  <li>Click on indicators to view toilet details</li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
          <Left
            data={toilets}
            activeBuilding={activeBuilding || ""}
            setActiveBuilding={setActiveBuilding}
          />
        </ScrollArea>
      </div>
      <div className="h-[60vh] basis-3/5 sm:h-screen">
        <Map
          data={toilets}
          userPosition={userPosition}
          handleMarkerClick={handleMarkerClick}
        />
      </div>
    </main>
  );
}
