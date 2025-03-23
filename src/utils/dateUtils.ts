
/**
 * Formats a date to a readable format
 * @param dateString The date string to format
 * @returns Formatted date string (e.g. "Jan 1, 2023")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Returns a relative time string (e.g., "2 hours ago")
 * @param dateString The date string to format
 * @returns Relative time string
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return diffSecs + ' second' + (diffSecs !== 1 ? 's' : '') + ' ago';
  } else if (diffMins < 60) {
    return diffMins + ' minute' + (diffMins !== 1 ? 's' : '') + ' ago';
  } else if (diffHours < 24) {
    return diffHours + ' hour' + (diffHours !== 1 ? 's' : '') + ' ago';
  } else if (diffDays < 7) {
    return diffDays + ' day' + (diffDays !== 1 ? 's' : '') + ' ago';
  } else {
    return formatDate(dateString);
  }
};
