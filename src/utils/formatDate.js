import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Format a timestamp (Firebase Timestamp, Date, string, or number) into a human-friendly relative or absolute string.
 */
export function formatSessionTime(timestamp) {
  if (!timestamp) return '';

  let date;
  if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    return '';
  }

  if (isNaN(date.getTime())) return '';

  try {
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (err) {
    return '';
  }
}

/**
 * Format message timestamp into "3:45 PM" or full date if older
 */
export function formatMessageTime(timestamp) {
  if (!timestamp) return '';

  let date;
  if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    return '';
  }

  if (isNaN(date.getTime())) return '';

  try {
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    return format(date, 'MMM d, h:mm a');
  } catch (err) {
    return '';
  }
}
