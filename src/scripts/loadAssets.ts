import { useEffect, useState } from "react";

export const useLoadAssets = (currentSrc: string) => {
  const [imageSrc, _setImageSrc] = useState<string>("");

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      console.log(`${currentSrc} loaded`);
      _setImageSrc(currentSrc);
    };
    img.src = currentSrc;
  }, [currentSrc]);

  return imageSrc;
};

export default useLoadAssets;
