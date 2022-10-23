import type { NextPage } from "next";
import { useState, useEffect, useRef } from "react";
import CustomizeChar from "../components/CustomizeChar";
import GameBoard from "../components/GameBoard";
import LoadingScreen from "../components/LoadingScreen";

const Home: NextPage = () => {
  const [isCustomized, setIsCustomized] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [isPreLoading, setIsPreLoading] = useState<boolean>(true);

  let imageSrcs = useRef<string[]>([]);

  useEffect(() => {
    const imgs: string[] = [
      "/img/coin.png",
      "/img/block.png",
      "/img/block2.png",
      "/img/block3.png",
      "/img/block4.png",
    ];
    cacheImages(imgs);
  }, []);

  const cacheImages = async (srcArray: string[]) => {
    const promises = await srcArray.map((src) => {
      return new Promise(function (resolve, reject) {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    await Promise.all(promises);

    imageSrcs.current = srcArray;
    setIsPreLoading(false);
  };

  return (
    <div>
      {!isCustomized ? (
        <CustomizeChar setIsCustomized={setIsCustomized} setName={setName} />
      ) : isPreLoading ? (
        <LoadingScreen />
      ) : (
        <GameBoard
          name={name}
          setIsCustomized={setIsCustomized}
          imageSrcs={imageSrcs}
        />
      )}
    </div>
  );
};

export default Home;
