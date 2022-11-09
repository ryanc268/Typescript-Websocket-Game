import type { NextPage } from "next";
import { useState } from "react";
import SocketProvider from "../components/SocketContext";
import CustomizeChar from "../components/CustomizeChar";
import GameScreen from "../components/GameScreen";

const Home: NextPage = () => {
  const [isCustomized, setIsCustomized] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [colour, setColour] = useState<string>("");

  return (
    <div>
      {!isCustomized ? (
        <CustomizeChar
          setIsCustomized={setIsCustomized}
          setName={setName}
          setColour={setColour}
        />
      ) : (
        <SocketProvider name={name} colour={colour}>
          <GameScreen
            isCustomized={isCustomized}
            setIsCustomized={setIsCustomized}
          />
        </SocketProvider>
      )}
    </div>
  );
};

export default Home;
