import SocketIOClient, { Socket } from "socket.io-client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ControlsInterface, Player } from "../global/types/gameTypes";
import { KeyMap } from "../global/types/gameEnums";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TILE_SIZE, COIN_SIZE, PLAYER_SIZE } from "../global/constants";
import Controls from "./Controls";
import Leaderboard from "./Leaderboard";

interface GameBoardProps {
  name: string;
  setIsCustomized: Dispatch<SetStateAction<boolean>>;
}

const GameBoard: React.FC<GameBoardProps> = ({ name, setIsCustomized }) => {
  let socket: Socket; //SocketIOClient();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const leaderboardElRef = useRef<HTMLDivElement | null>(null);

  let players = useRef<Player[]>([]);

  let width: number;
  let height: number;

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

    window.addEventListener("keydown", (e) => {
      if (bgMusic.current!.paused) bgMusic.current!.play();
      setControls(e.key.toLowerCase() as KeyMap, true);
    });
    window.addEventListener("keyup", (e) =>
      setControls(e.key.toLowerCase() as KeyMap, false)
    );
    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
    });

    width = window.innerWidth;
    height = window.innerHeight;

    coinAudio.current!.volume = 0.05;
    victoryAudio.current!.volume = 0.1;
    defeatAudio.current!.volume = 0.1;

    bgMusic.current!.volume = 0.1;
    bgMusic.current!.autoplay = true;
    bgMusic.current!.loop = true;

    socketInitializer();
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d");
    canvas!.width = width;
    canvas!.height = height;
    contextRef.current = context;
    startCanvas();

    //cleans up events
    return () => {
      window.removeEventListener("keydown", (e) =>
        setControls(e.key as KeyMap, true)
      );
      window.removeEventListener("keyup", (e) =>
        setControls(e.key as KeyMap, false)
      );
      window.removeEventListener("resize", () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas!.width = width;
        canvas!.height = height;
      });
      bgMusic.current!.pause();
      socket.disconnect();
    };
  }, []);

  const startCanvas = () => {
    contextRef.current!.fillStyle = "red";
    // drawLeaderboard();
    // setInterval(drawLeaderboard, 2000);
    window.requestAnimationFrame(loop);
  };

  const controls: ControlsInterface = {
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
    respawn: false,
    sprint: false,
  };

  const setControls = (key: KeyMap, active: boolean) => {
    if (key == KeyMap.Down) {
      controls.down = active;
    }
    if (key == KeyMap.Left) {
      controls.left = active;
    }
    if (key == KeyMap.Right) {
      controls.right = active;
    }
    if (key == KeyMap.Jump) {
      controls.jump = active;
    }
    if (key == KeyMap.Respawn) {
      controls.respawn = active;
    }
    if (key == KeyMap.Sprint) {
      controls.sprint = active;
    }
  };

  const socketInitializer = () => {
    fetch("/api/socket");
    socket = SocketIOClient(window.location.origin, { query: { name: name } });

    socket.on("connect", () => {
      console.log("Connected to the server.");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from the server.");
      bgMusic.current!.pause();
      //setIsCustomized(false);
    });

    socket.on("map", (serverMap) => {
      map = serverMap;
    });

    socket.on("players", (serverPlayers) => {
      players.current = serverPlayers;
    });

    socket.on("coins", (serverCoins) => {
      coins = serverCoins;
    });

    socket.on("playerJoin", (player) => {
      toast(`Player ${player} joined`, {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
    socket.on("playerLeave", (player) => {
      toast(`Player ${player} left`, {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });

    socket.on("playCoinSound", () => {
      coinAudio.current!.currentTime = 0;
      coinAudio.current!.play();
    });
    socket.on("playVictorySound", () => {
      victoryAudio.current!.currentTime = 0;
      victoryAudio.current!.play();
    });
    socket.on("playDefeatSound", () => {
      defeatAudio.current!.currentTime = 0;
      defeatAudio.current!.play();
    });
    socket.on("ping", (callback) => {
      callback();
    });
  };

  function update(delta: number) {
    socket.emit("controls", controls);
  }

  function draw() {
    contextRef.current!.clearRect(0, 0, width, height);

    let cx = 0;
    let cy = 0;

    const playerToFocus = players.current.find(
      (player: Player) => player.id === socket.id
    );

    if (playerToFocus) {
      cx = playerToFocus.x - canvasRef.current!.width / 2 + 140;
      cy = playerToFocus.y - canvasRef.current!.height / 2;
    }

    contextRef.current!.fillStyle = "#7ca6e4";
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const tileType = map[row][col];
        if (tileType === 1) {
          contextRef.current!.fillRect(
            col * TILE_SIZE - cx,
            row * TILE_SIZE - cy,
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }
    }
    for (const coin of coins) {
      contextRef.current!.fillStyle = "#d4ba22";
      contextRef.current!.fillRect(
        coin.x - cx,
        coin.y - cy,
        COIN_SIZE,
        COIN_SIZE
      );
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
    const delta = timestamp - lastRender;

    update(delta);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
  }

  return (
    <div>
      <canvas className=" bg-zinc-900" id="canvas" ref={canvasRef}></canvas>
      {/* <LeaderboardComponent /> */}
      <Leaderboard players={players} />
      <Controls />
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
