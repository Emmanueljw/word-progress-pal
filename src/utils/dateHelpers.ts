
export function getCurrentStreak(lastReadDate: string, currentStreak: number): number {
  if (!lastReadDate) return 0;
  
  const today = new Date();
  const lastRead = new Date(lastReadDate);
  const diffTime = Math.abs(today.getTime() - lastRead.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // If last read was today or yesterday, streak continues
  if (diffDays <= 1) {
    return currentStreak;
  } else {
    // Streak is broken
    return 0;
  }
}

export function updateStreak(lastReadDate: string): number {
  const today = new Date().toISOString().split('T')[0];
  
  if (!lastReadDate) {
    // First time reading
    return 1;
  }
  
  if (lastReadDate === today) {
    // Already read today, don't increment
    return getCurrentStreak(lastReadDate, 1);
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];
  
  if (lastReadDate === yesterdayString) {
    // Read yesterday, increment streak
    return getCurrentStreak(lastReadDate, 1) + 1;
  } else {
    // Streak broken, start new
    return 1;
  }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isToday(dateString: string): boolean {
  return dateString === new Date().toISOString().split('T')[0];
}

export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}
