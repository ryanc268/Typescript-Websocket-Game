import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import SocketIOClient, { Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import { ControlsInterface, Player } from "../types/gameTypes";
import { KeyMap } from "../types/gameEnums";

const Home: NextPage = () => {
  let socket: Socket = SocketIOClient();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const leaderboardElRef = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  let width: number;
  let height: number;

  let coinAudio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("/coin.mp3") : undefined
  );

  const TILE_SIZE = 32;
  const COIN_SIZE = 10;
  const PLAYER_SIZE = 16;

  let map: number[][] = [];
  let players: Player[] = [];
  let coins: any[] = [];

  let lastRender = 0;

  //sets up the game with the server and events
  useEffect((): any => {
    const isSupported = window && window.addEventListener;
    if (!isSupported) return;

    window.addEventListener("keydown", (e) =>
      setControls(e.key as KeyMap, true)
    );
    window.addEventListener("keyup", (e) =>
      setControls(e.key as KeyMap, false)
    );

    width = window.innerWidth;
    height = window.innerHeight;

    coinAudio.current!.volume = 0.1;

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
      socket.disconnect();
    };
  }, []);

  const startCanvas = () => {
    contextRef.current!.fillStyle = "red";
    setInterval(drawLeaderboard, 2000);
    drawLeaderboard();
    window.requestAnimationFrame(loop);
  };

  const drawLeaderboard = () => {
    leaderboardElRef.current!.innerHTML = "Scores!";
    const sortedScores = [...players].sort((p1, p2) => p2.score - p1.score);
    for (const player of sortedScores) {
      const scoreEl = document.createElement("div");
      scoreEl.innerText = `${player.name}: ${player.score}`;
      leaderboardElRef.current!.append(scoreEl);
    }
  };

  const controls: ControlsInterface = {
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
    respawn: false,
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
  };

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = SocketIOClient();

    socket.on("connect", () => {
      console.log("Connected to the server.");
    });

    socket.on("map", (serverMap) => {
      //console.log("Generating New Map!");
      map = serverMap;
    });

    socket.on("players", (serverPlayers) => {
      players = serverPlayers;
    });

    socket.on("coins", (serverCoins) => {
      coins = serverCoins;
    });

    socket.on("playCoinSound", () => {
      coinAudio.current!.currentTime = 0;
      coinAudio.current!.play();
    });
  };

  function update(delta: number) {
    socket.emit("controls", controls);
  }

  function draw() {
    contextRef.current!.clearRect(0, 0, width, height);

    let cx = 0;
    let cy = 0;

    const playerToFocus = players.find(
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

    for (let player of players) {
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
      <canvas id="canvas" ref={canvasRef}></canvas>
      <div
        id="leaderboard"
        ref={leaderboardElRef}
        className={styles.leaderboard}
      ></div>
    </div>
  );
};

export default Home;
