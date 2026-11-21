/**
 * Helper to ensure names displayed in Priority Lists and child health modules
 * use female names as requested.
 */

const FEMALE_NAME_MAP = {
  'ravi jadhav': 'Radha Jadhav',
  'aarav sam test': 'Aarohi SAM Test',
  'ravi': 'Radha',
  'aarav': 'Aarohi',
  'rahul': 'Radha',
  'amit': 'Amita',
  'rohan': 'Rohini',
  'aditya': 'Aditi',
  'aryan': 'Arya',
  'kunal': 'Komal',
  'sai': 'Sailee',
  'om': 'Gauri',
  'yash': 'Yashashree',
  'pranav': 'Pranali',
  'vivek': 'Vidya',
  'siddharth': 'Siddhi',
  'harsh': 'Harshita',
  'aniket': 'Ankita',
  'ajay': 'Anjali',
  'vijay': 'Vaishnavi',
  'sanjay': 'Sanjana',
  'sachin': 'Sneha',
  'deepak': 'Deepa',
  'vikas': 'Kavita',
  'ganesh': 'Gauri',
  'sunil': 'Sunita',
  'anil': 'Anita',
  'rajesh': 'Rajeshree',
  'nitin': 'Nikita',
  'child': 'Radha'
};

const DEFAULT_FEMALE_NAMES = [
  'Radha Jadhav',
  'Aarohi SAM Test',
  'Ananya Shinde',
  'Priya Patil',
  'Sneha Deshmukh',
  'Diya Kadam',
  'Gauri Pawar',
  'Kavita More'
];

export function toFemaleName(name, fallbackIndex = 0) {
  if (!name || typeof name !== 'string') {
    return DEFAULT_FEMALE_NAMES[fallbackIndex % DEFAULT_FEMALE_NAMES.length];
  }

  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  // Direct exact match
  if (FEMALE_NAME_MAP[lower]) {
    return FEMALE_NAME_MAP[lower];
  }

  // Word-by-word replacement for first name
  const parts = trimmed.split(/\s+/);
  if (parts.length > 0) {
    const firstLower = parts[0].toLowerCase();
    if (FEMALE_NAME_MAP[firstLower]) {
      parts[0] = FEMALE_NAME_MAP[firstLower];
      return parts.join(' ');
    }
  }

  // Check if starts with a known key
  for (const [male, female] of Object.entries(FEMALE_NAME_MAP)) {
    if (lower.startsWith(male)) {
      return female + trimmed.slice(male.length);
    }
  }

  return trimmed;
}

export function transformPriorityItem(item, index = 0) {
  if (!item) return item;
  return {
    ...item,
    name: toFemaleName(item.name, index)
  };
}
