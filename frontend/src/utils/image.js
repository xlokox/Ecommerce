// Frontend image helpers
import placeholder from '../assets/error.png';

export const getImageSrc = (images) => {
  const url = Array.isArray(images) && images[0] ? String(images[0]).trim() : '';
  return url ? url : placeholder;
};

export const onImgError = (e) => {
  if (e && e.target) {
    e.target.onerror = null;
    e.target.src = placeholder;
  }
};

