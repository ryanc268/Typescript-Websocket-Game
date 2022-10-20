import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import SocketIOClient, { Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import { ControlsInterface, Player } from "../global/types/gameTypes";
import { KeyMap } from "../global/types/gameEnums";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TILE_SIZE,
  COIN_SIZE,
  PLAYER_SIZE,
  END_GAME_SCORE,
} from "../global/constants";

const Home: NextPage = () => {
  let socket: Socket; //SocketIOClient();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const leaderboardElRef = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

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
  let players: Player[] = [];
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
      bgMusic.current!.pause();
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
    leaderboardElRef.current!.innerHTML = "Scoreboard!";
    const lineBreak = document.createElement("hr");
    leaderboardElRef.current!.append(lineBreak);
    const sortedScores = [...players].sort((p1, p2) => p2.score - p1.score);
    for (const player of sortedScores) {
      const scoreEl = document.createElement("div");
      const label = document.createElement("div");
      const ping = document.createElement("span");
      label.innerText = `${player.name}: ${player.score}/${END_GAME_SCORE}`;
      ping.className = `${styles.ping}`;
      ping.style.color = pingColourPicker(player.ping);
      ping.innerHTML = `${player.ping}ms`;
      scoreEl.append(label);
      scoreEl.append(ping);
      leaderboardElRef.current!.append(scoreEl);
    }
  };

  const pingColourPicker = (ping: number) => {
    switch (true) {
      case ping < 50:
        return "#2ac237";
      case ping < 100:
        return "#186e1f";
      case ping < 150:
        return "#d0f05d";
      case ping < 200:
        return "#e7ba3e";
      case ping < 250:
        return "#e6873b";
      case ping >= 250:
        return "#aa3229";
      default:
        return "#2ac237";
    }
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
    socket = SocketIOClient();

    socket.on("connect", () => {
      console.log("Connected to the server.");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from the server.");
      bgMusic.current!.pause();
    });

    socket.on("map", (serverMap) => {
      map = serverMap;
    });

    socket.on("players", (serverPlayers) => {
      players = serverPlayers;
    });

    socket.on("coins", (serverCoins) => {
      coins = serverCoins;
    });

    socket.on("playerJoin", (player) => {
      console.log(`showing join toast`);
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
      console.log(`showing leave toast`);
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
      <ul id="controls" className={styles.controls}>
        <li>A = Left</li>
        <li>D = Right</li>
        <li>S = Fast Fall</li>
        <li>R = Respawn</li>
        <li>Shift = Sprint</li>
        <li>Space = Jump</li>
      </ul>
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

export default Home;