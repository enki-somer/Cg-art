/**
 * Helper functions for working with images in the application
 */

/**
 * Gets the full URL for an image by its ID or path
 * @param imageIdOrPath The ID or path of the image to retrieve
 * @returns The full URL to the image
 */
export function getImageUrl(imageIdOrPath: string): string {
  if (!imageIdOrPath) return '';
  
  // Check if it's already a full URL
  if (imageIdOrPath.startsWith('http')) {
    return imageIdOrPath;
  }
  
  // Check if it's an app-relative public image
  if (imageIdOrPath.startsWith('/')) {
    return imageIdOrPath;
  }
  
  // Assume it's an image ID, convert to public path
  return `/uploads/${imageIdOrPath}`;
}

/**
 * Extracts the image ID from a URL
 * @param url The URL to extract from
 * @returns The image ID or null if not found
 */
export function getImageIdFromUrl(url: string): string | null {
  if (!url) return null;
  
  // Check if it's an uploads URL
  if (url.includes('/uploads/')) {
    return url.split('/uploads/')[1];
  }
  
  return null;
} 