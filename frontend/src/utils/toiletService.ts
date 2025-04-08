// Create a new file called toiletService.ts in your utils or services folder

export async function fetchToilets(latitude?: number, longitude?: number, filters?: {
    is_male?: boolean;
    is_female?: boolean;
    is_accessible?: boolean;
    is_open?: boolean;
  }) {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (latitude) params.append('latitude', latitude.toString());
    if (longitude) params.append('longitude', longitude.toString());
    
    // Add any filters if provided
    if (filters) {
      if (filters.is_male !== undefined) params.append('is_male', filters.is_male.toString());
      if (filters.is_female !== undefined) params.append('is_female', filters.is_female.toString());
      if (filters.is_accessible !== undefined) params.append('is_accessible', filters.is_accessible.toString());
      if (filters.is_open !== undefined) params.append('is_open', filters.is_open.toString());
    }
    
    // Make API request
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/toilets?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch toilet data');
    }
    
    return await response.json();
  }