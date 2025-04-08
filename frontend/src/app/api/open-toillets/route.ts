import { NextResponse } from "next/server";

interface ToiletDataFormat {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  is_male: boolean;
  is_female: boolean;
  is_accessible: boolean;
  is_open: boolean;
  cleanliness_rating: number;
  description: string;
  distance?: number;
}

export async function POST(req: Request) {
  try {
    // Extract user location from the request body
    const { lat, lng } = await req.json();

    // Using correct parameter names in the query string
    const response = await fetch(
      `http://localhost:5000/api/toilets?latitude=${lat}&longitude=${lng}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache"
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch toilet data" },
        { status: response.status }
      );
    }

    // Get data from backend
    const data: ToiletDataFormat[] = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in toilet POST route:", error);
    return NextResponse.json(
      { error: "Failed to process toilet request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Fetch the default toilet data without location
    const response = await fetch(
      "http://localhost:5000/api/toilets",
      {
        method: "GET",
        cache: "no-cache",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch toilet data" },
        { status: response.status }
      );
    }

    // Get data from backend
    const data: ToiletDataFormat[] = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in toilet GET route:", error);
    return NextResponse.json(
      { error: "Failed to process toilet request" },
      { status: 500 }
    );
  }
}