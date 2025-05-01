
export function isToiletOpen(toilet: {
    opening_time?: string;
    closing_time?: string;
    open_monday?: boolean;
    open_tuesday?: boolean;
    open_wednesday?: boolean;
    open_thursday?: boolean;
    open_friday?: boolean;
    open_saturday?: boolean;
    open_sunday?: boolean;
  }): boolean {
    // Get current date and time
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Check if toilet is open on current day
    let isOpenToday = false;
    switch(currentDay) {
      case 0: isOpenToday = toilet.open_sunday ?? false; break;
      case 1: isOpenToday = toilet.open_monday ?? false; break;
      case 2: isOpenToday = toilet.open_tuesday ?? false; break;
      case 3: isOpenToday = toilet.open_wednesday ?? false; break;
      case 4: isOpenToday = toilet.open_thursday ?? false; break;
      case 5: isOpenToday = toilet.open_friday ?? false; break;
      case 6: isOpenToday = toilet.open_saturday ?? false; break;
    }
    
    // If not open today, return false immediately
    if (!isOpenToday) return false;
    
    // If no opening/closing times specified, assume it's open all day
    if (!toilet.opening_time || !toilet.closing_time) return true;
    
    // Parse opening time
    const [openingHour, openingMinute] = toilet.opening_time.split(':').map(part => parseInt(part));
    
    // Parse closing time
    const [closingHour, closingMinute] = toilet.closing_time.split(':').map(part => parseInt(part));
    
    // Convert current time, opening time, and closing time to minutes for easier comparison
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const openingTimeInMinutes = openingHour * 60 + openingMinute;
    const closingTimeInMinutes = closingHour * 60 + closingMinute;
    
    // Check if current time is within opening hours
    return currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes <= closingTimeInMinutes;
  }