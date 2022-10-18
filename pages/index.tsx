import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import io from "socket.io-client";
import { useEffect, useRef } from "react";
import startWebsocket from "./websocket/server"

const Home: NextPage = () => {
  const socket = io();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const leaderboardElRef = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const width = typeof window !== "undefined" ? window.innerWidth : 500;
  const height = typeof window !== "undefined" ? window.innerHeight : 500;

  const coinAudio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("../public/coin.mp3") : undefined
  );

  const TILE_SIZE = 32;
  const COIN_SIZE = 6;
  const PLAYER_SIZE = 16;

  let map = [[]];
  let players: any = [];
  let coins: any = [];

  let lastRender = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d");
    contextRef.current = context;
    startCanvas();
  }, []);

  const startCanvas = () => {
    contextRef.current!.fillStyle = "red";
    setInterval(drawLeaderboard, 2000);
    drawLeaderboard();
    window.requestAnimationFrame(loop);
    startWebsocket();
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

  interface controlsInterface {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
  }

  const controls: controlsInterface = {
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
  };

  enum KeyMap {
    Up = "w",
    Down = "s",
    Left = "a",
    Right = "d",
    Jump = " ",
  }

  const setControls = (key: KeyMap) => {
    switch (key) {
      case KeyMap.Up:
        controls.up = false;
      case KeyMap.Down:
        controls.down = false;
      case KeyMap.Up:
        controls.up = false;
      case KeyMap.Up:
        controls.up = false;
      case KeyMap.Up:
        controls.up = false;
    }
  };

  socket.on("map", (serverMap) => {
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

  function update(delta: any) {
    socket.emit("controls", controls);
  }

  function draw() {
    contextRef.current!.clearRect(0, 0, width, height);

    let cx = 0;
    let cy = 0;

    const playerToFocus = players.find(
      (player: any) => player.id === socket.id
    );
    if (playerToFocus) {
      cx = playerToFocus.x - canvasRef.current!.width / 2 + 140;
      cy = playerToFocus.y - canvasRef.current!.height / 2;
    }

    contextRef.current!.fillStyle = "#000000";
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
      contextRef.current!.fillStyle = "#FF00FF";
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

      contextRef.current!.fillStyle = player.color;
      contextRef.current!.fillRect(
        player.x - cx,
        player.y - cy,
        PLAYER_SIZE,
        PLAYER_SIZE
      );
      contextRef.current!.fillStyle = "#000000";
      contextRef.current!.fillText(
        player.name,
        player.x - 10 - cx,
        player.y - 10 - cy
      );
    }
  }

  function loop(timestamp: any) {
    const delta = timestamp - lastRender;

    update(delta);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
  }

  return (
    <div>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={width}
        height={height}
        onKeyDown={(e) => setControls(e.key as KeyMap)}
        onKeyUp={(e) => setControls(e.key as KeyMap)}
      ></canvas>

      <div
        id="leaderboard"
        ref={leaderboardElRef}
        className={styles.leaderboard}
      ></div>
    </div>
  );
};

export default Home;
