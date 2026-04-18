export const getOptimizedImageUrl = (url: string, width = 400): string => {
  if (!url) return '';
  
  if (!url.includes('cloudinary')) return url;
  
  return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
};

export const getImageUrls = (
  pictures: string[] | null, 
  options: { thumbnail?: number; medium?: number; large?: number } = {}
): { thumbnail?: string; medium?: string; large?: string } => {
  if (!pictures || pictures.length === 0) return {};
  
  const { thumbnail = 200, medium = 400, large = 800 } = options;
  
  return {
    thumbnail: getOptimizedImageUrl(pictures[0], thumbnail),
    medium: getOptimizedImageUrl(pictures[0], medium),
    large: getOptimizedImageUrl(pictures[0], large),
  };
};