import type { NextPage } from "next";
import { useState, useEffect, useRef } from "react";
import CustomizeChar from "../components/CustomizeChar";
import GameBoard from "../components/GameBoard";
import LoadingScreen from "../components/LoadingScreen";
import resourceJson from "../resources/gameresources.json";

const Home: NextPage = () => {
  const [isCustomized, setIsCustomized] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [colour, setColour] = useState<string>("");
  const [isPreLoading, setIsPreLoading] = useState<boolean>(true);

  useEffect(() => {
    let characterResources: string[] = [];
    Object.values(resourceJson.characters).forEach((val) => {
      characterResources = [...characterResources, ...val];
    });

    cacheImages([...resourceJson.blocks, ...characterResources]);
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

    setIsPreLoading(false);
  };

  return (
    <div>
      {!isCustomized ? (
        <CustomizeChar
          setIsCustomized={setIsCustomized}
          setName={setName}
          setColour={setColour}
        />
      ) : isPreLoading ? (
        <LoadingScreen />
      ) : (
        <GameBoard
          name={name}
          colour={colour}
          setIsCustomized={setIsCustomized}
        />
      )}
    </div>
  );
};

export default Home;
