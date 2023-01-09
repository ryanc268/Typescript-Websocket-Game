import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ControlsInterface, Player } from "../global/types/gameTypes";
import { KeyMap } from "../global/types/gameEnums";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TILE_SIZE, COIN_SIZE, PLAYER_SIZE } from "../global/constants";
import Controls from "./Controls";
import Leaderboard from "./Leaderboard";
import LoadingScreen from "./LoadingScreen";
import MobileControls from "./MobileControls";
import resourceJson from "../resources/gameresources.json";
import { useSocket } from "../components/SocketContext";

interface GameBoardProps {
  setIsCustomized: Dispatch<SetStateAction<boolean>>;
}

const GameBoard: React.FC<GameBoardProps> = ({ setIsCustomized }) => {
  let socket = useSocket();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [mobileControls, setMobileControls] = useState<Map<KeyMap, boolean>>(
    new Map()
  );

  let controlsRef = useRef<ControlsInterface>({
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
    respawn: false,
    sprint: false,
  });

  let players = useRef<Player[]>([]);
  let currentPlayer = useRef<Player>();

  let roundTransition = useRef<boolean>(false);
  let [loadScreenState, setLoadScreenState] = useState<boolean>(false);

  // let width = useRef<number>(window.innerWidth);
  // let height = useRef<number>(window.innerHeight);

  let coinImg = new Image();
  coinImg.src = resourceJson.blocks[0];

  let currentBlock: HTMLImageElement;
  //let playerSprite = new Image();
  //playerSprite.src = "";
  //let spriteState: number = 0;

  let coinAudio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("/coin.wav") : undefined
  );

  let bgMusic = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined"
      ? new Audio("/SonicIceCapRemixLoopable.mp3")
      : undefined
  );

  let victoryAudio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("/victory.wav") : undefined
  );

  let defeatAudio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("/defeat.wav") : undefined
  );

  let map: number[][] = [];
  let coins: any[] = [];

  let lastRender = 0;

  //sets up the game with the server and events
  useEffect((): any => {
    const isSupported = window && window.addEventListener;
    if (!isSupported) return;

    //playerSprite.src = setSprite();

    window.addEventListener("keydown", (e) => {
      setControls(e.key.toLowerCase() as KeyMap, true);
    });
    window.addEventListener("keyup", (e) => {
      setControls(e.key.toLowerCase() as KeyMap, false);
    });
    window.addEventListener("resize", () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    });

    // width = window.innerWidth;
    // height = window.innerHeight;

    coinAudio.current!.volume = 0.05;
    victoryAudio.current!.volume = 0.1;
    defeatAudio.current!.volume = 0.1;

    if (bgMusic.current) {
      bgMusic.current!.volume = 0.1;
      bgMusic.current!.autoplay = true;
      bgMusic.current!.loop = true;
    }

    socketInitializer();
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d");
    canvas!.width = window.innerWidth;
    canvas!.height = window.innerHeight;
    contextRef.current = context;
    //waits for the callback to start drawing the canvas
    //this callback will have meant that the server has sent the block and map to the client
    socket.emit("ready", () => {
      startCanvas();
    });

    //cleans up events
    return () => {
      window.removeEventListener("keydown", (e) =>
        setControls(e.key as KeyMap, true)
      );
      window.removeEventListener("keyup", (e) =>
        setControls(e.key as KeyMap, false)
      );
      window.removeEventListener("resize", () => {
        canvas!.width = window.innerWidth;
        canvas!.height = window.innerHeight;
      });
      // bgMusic.current!.pause();
      // bgMusic.current!.srcObject = null;
      console.log("Game Dismounting");
      //socket.close();
    };
  });

  useEffect(() => {
    mobileControls.forEach((value, key) => {
      setControls(key, value);
    });
  }, [mobileControls]);

  const startCanvas = () => {
    contextRef.current!.fillStyle = "red";
    window.requestAnimationFrame(loop);
  };

  // const setSprite = () => {
  //   spriteState++;
  //   let spriteNum = Number.isInteger(spriteState / SPRITE_CHANGE_SPEED)
  //     ? spriteState / SPRITE_CHANGE_SPEED
  //     : Math.floor(spriteState / SPRITE_CHANGE_SPEED);

  //   if (controlsRef.current.left) {
  //     spriteNum += 3;
  //   } else if (controlsRef.current.right) {
  //     spriteNum += 6;
  //   }

  //   if (spriteState >= SPRITE_CHANGE_SPEED * 3 - 1) spriteState = 0;

  //   return resourceJson.characters[1][spriteNum];
  // };

  const setControls = (key: KeyMap, active: boolean) => {
    let controls = controlsRef.current;
    if (key === KeyMap.Down) {
      controls.down = active;
    }
    if (key === KeyMap.Left) {
      controls.left = active;
    }
    if (key === KeyMap.Right) {
      controls.right = active;
    }
    if (key === KeyMap.Jump) {
      controls.jump = active;
    }
    if (key === KeyMap.Respawn) {
      controls.respawn = active;
    }
    if (key === KeyMap.Sprint) {
      controls.sprint = active;
    }
  };

  const isMobile = () => window.innerWidth < 768;

  const socketInitializer = () => {
    // fetch("/api/socket");
    // socket = SocketIOClient(window.location.origin, {
    //   query: { name: name, colour: colour },
    // });

    // socket.on("connect", () => {
    //   console.log("Connected to the server.");
    // });

    // socket.off("disconnect").on("disconnect", () => {
    //   console.log("Disconnected from the server.");
    //   bgMusic.current!.pause();
    //   bgMusic.current!.srcObject = null;
    //   setIsCustomized(false);
    // });

    //TODO: .off is a (maybe?) quickfix. Find out why the .off works and if there is a way to not need it to prevent multiple event calls

    socket.off("block").on("block", (serverBlock) => {
      currentBlock = blockChange(serverBlock);
    });

    socket.off("map").on("map", (serverMap) => {
      map = serverMap;
    });

    socket.off("players").on("players", (serverPlayers) => {
      players.current = serverPlayers;
    });

    socket.off("coins").on("coins", (serverCoins) => {
      coins = serverCoins;
    });

    socket.off("playerJoin").on("playerJoin", (player) => {
      toast(`Player ${player} joined`, {
        position: isMobile() ? "top-center" : "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    });
    socket.off("playerLeave").on("playerLeave", (player) => {
      toast(`Player ${player} left`, {
        position: isMobile() ? "top-center" : "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    });

    socket.off("playCoinSound").on("playCoinSound", () => {
      coinAudio.current!.currentTime = 0;
      coinAudio.current!.play();
    });
    socket.off("playVictorySound").on("playVictorySound", (name: string) => {
      endGame(name);
      victoryAudio.current!.currentTime = 0;
      victoryAudio.current!.play();
    });
    socket.off("playDefeatSound").on("playDefeatSound", (name: string) => {
      endGame(name);
      defeatAudio.current!.currentTime = 0;
      defeatAudio.current!.play();
    });
    socket.off("ping").on("ping", (callback) => {
      callback();
    });
  };

  const endGame = (name: string) => {
    toast(`${name} the winner!`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
    });
    roundTransition.current = true;
    setLoadScreenState(true);
    contextRef.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
    Object.keys(controlsRef.current).forEach(
      (v) => (controlsRef.current[v as keyof ControlsInterface] = false)
    );
    socket.emit("controls", controlsRef.current);
    //currentBlock = blockChange();
    const roundChange = setInterval(() => {
      setLoadScreenState(false);
      roundTransition.current = false;
      window.clearInterval(roundChange);
    }, 2000);
  };

  const blockChange = (blockChoice: number) => {
    const block = new Image();
    //will need to be careful with this since doing it this way assume I know what is being loaded into each array slot
    block.src = resourceJson.blocks[blockChoice];

    return block;
  };

  const getPlayer = () => {
    const player = players.current.find(
      (player: Player) => player.id === socket.id
    );
    currentPlayer.current = player;
    return player;
  };

  function update() {
    if (!roundTransition.current) socket.emit("controls", controlsRef.current);
  }

  function draw() {
    contextRef.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let cx = 0;
    let cy = 0;

    const playerToFocus = getPlayer();

    if (playerToFocus) {
      cx = playerToFocus.x - canvasRef.current!.width / 2 + 140;
      cy = playerToFocus.y - canvasRef.current!.height / 2;
    }

    contextRef.current!.fillStyle = "#7ca6e4";
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const tileType = map[row][col];
        if (tileType === 1) {
          contextRef.current!.drawImage(
            currentBlock,
            col * TILE_SIZE - cx,
            row * TILE_SIZE - cy,
            TILE_SIZE,
            TILE_SIZE
          );
          // contextRef.current!.fillRect(
          //   col * TILE_SIZE - cx,
          //   row * TILE_SIZE - cy,
          //   TILE_SIZE,
          //   TILE_SIZE
          // );
        }
      }
    }
    contextRef.current!.fillStyle = "#d4ba22";
    for (const coin of coins) {
      contextRef.current!.drawImage(
        coinImg,
        coin.x - cx,
        coin.y - cy,
        COIN_SIZE,
        COIN_SIZE
      );
      // contextRef.current!.fillRect(
      //   coin.x - cx,
      //   coin.y - cy,
      //   COIN_SIZE,
      //   COIN_SIZE
      // );
    }

    for (let player of players.current) {
      if (player.id === socket.id) {
        contextRef.current!.fillStyle = "#ff0000";
        contextRef.current!.fillRect(
          player.x - 1 - cx,
          player.y - 1 - cy,
          PLAYER_SIZE + 2,
          PLAYER_SIZE + 2
        );
      }

      // playerSprite.src = setSprite();
      // contextRef.current!.drawImage(
      //   playerSprite,
      //   player.x - cx,
      //   player.y - cy - 10,
      //   PLAYER_SIZE + 10,
      //   PLAYER_SIZE + 10
      // );

      contextRef.current!.fillStyle = player.colour;
      contextRef.current!.fillRect(
        player.x - cx,
        player.y - cy,
        PLAYER_SIZE,
        PLAYER_SIZE
      );
      contextRef.current!.fillStyle = "#eeeeee";
      contextRef.current!.fillText(
        player.name,
        player.x - 10 - cx,
        player.y - 10 - cy
      );
    }
  }

  function loop(timestamp: number) {
    //const delta = timestamp - lastRender;

    if (!roundTransition.current) {
      update();
      draw();
      //lastRender = timestamp;
    }

    window.requestAnimationFrame(loop);
  }

  return (
    <div>
      <canvas
        className="absolute bg-zinc-900"
        id="canvas"
        ref={canvasRef}
      ></canvas>
      {loadScreenState ? (
        <LoadingScreen />
      ) : (
        <>
          <Leaderboard players={players} currentPlayer={currentPlayer} />
          {isMobile() ? (
            <MobileControls setMobileControls={setMobileControls} />
          ) : (
            <Controls />
          )}
        </>
      )}
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        limit={5}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default GameBoard;
