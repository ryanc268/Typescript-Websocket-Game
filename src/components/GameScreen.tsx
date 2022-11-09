import { Dispatch, SetStateAction, useEffect, useState } from "react";
import GameBoard from "../components/GameBoard";
import LoadingScreen from "../components/LoadingScreen";
import resourceJson from "../resources/gameresources.json";
import { useSocket } from "../components/SocketContext";

interface GameScreenProps {
  isCustomized: boolean;
  setIsCustomized: Dispatch<SetStateAction<boolean>>;
}

const GameScreen: React.FC<GameScreenProps> = ({
  isCustomized,
  setIsCustomized,
}) => {
  let socket = useSocket();

  const [isPreLoading, setIsPreLoading] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);

  useEffect(() => {
    let characterResources: string[] = [];
    Object.values(resourceJson.characters).forEach((val) => {
      characterResources = [...characterResources, ...val];
    });

    cacheImages([...resourceJson.blocks, ...characterResources]);
  }, []);

  useEffect(() => {
    if (Object.keys(socket).length > 0) {
      socket.on("connect", () => {
        console.log("Connected to the server.");
        setIsConnecting(false);
      });
    }
  }, [socket]);

  //caching the images used in the game
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

    setTimeout(() => {
      setIsPreLoading(false);
    }, 2000);
  };

  return (
    <>
      {!isPreLoading && !isConnecting ? (
        <GameBoard setIsCustomized={setIsCustomized} />
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default GameScreen;
