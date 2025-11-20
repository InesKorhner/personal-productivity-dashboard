import type { Sections } from '@/types';
import { SECTIONS } from '@/types';

/**
 * Gets the display name for a section.
 * Separates data value ('Other') from presentation value ('Others')
 * 
 * @param section - The section value from the data
 * @returns The display name for the section
 * 
 * @example
 * getSectionDisplayName('Other') // returns 'Others'
 * getSectionDisplayName('Morning') // returns 'Morning'
 */
export function getSectionDisplayName(section: Sections): string {
  return section === 'Other' ? 'Others' : section;
}

/**
 * Returns the SECTIONS constant as a single source of truth.
 * Use this whenever you need to iterate over all sections.
 */
export { SECTIONS };

