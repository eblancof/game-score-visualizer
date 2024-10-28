export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getValidImageUrl = (url: string | undefined, placeholder: string): string => {
  if (!url || !isValidUrl(url)) {
    return placeholder;
  }
  return url;
};