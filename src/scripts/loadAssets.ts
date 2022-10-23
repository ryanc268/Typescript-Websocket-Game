import { useEffect, useState } from "react";

export const useLoadAssets = (initialSrc: string, currentSrc: string) => {
  const [imageSrc, _setImageSrc] = useState(initialSrc);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      _setImageSrc(currentSrc);
    };
    img.src = currentSrc;
  }, [currentSrc]);

  return imageSrc;
};

export default useLoadAssets;
