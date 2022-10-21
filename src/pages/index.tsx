import type { NextPage } from "next";
import { useState } from "react";
import CustomizeChar from "../components/CustomizeChar";
import GameBoard from "../components/GameBoard";

const Home: NextPage = () => {
  const [isCustomized, setIsCustomized] = useState<boolean>(false);
  let [name, setName] = useState<string>("");
  return (
    <div>
      {!isCustomized ? (
        <CustomizeChar setIsCustomized={setIsCustomized} setName={setName} />
      ) : (
        <GameBoard name={name} setIsCustomized={setIsCustomized} />
      )}
    </div>
  );
};

export default Home;
