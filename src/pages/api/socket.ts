// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest } from "next";
import { Server as ServerIO, Socket } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiResponseServerIO } from "../../global/types/next";
import {
  Coin,
  Collidable,
  ControlsInterface,
  Player,
  Rect,
} from "../../global/types/gameTypes";
import { mainMap, randomMap } from "../../maps/maps";
import {
  TILE_SIZE,
  PLAYER_SIZE,
  COIN_SIZE,
  END_GAME_SCORE,
} from "../../global/constants";
const random = require("random-name");

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket Server initializing...");

    //Higher = more pull
    const GRAVITY = 0.0218;
    const TICK_RATE = 40;
    //Higher = faster
    const PLAYER_SPEED = 9.0;
    const COIN_SPAWN_RATE = 1250;
    const MAX_COINS = 10;
    //Lower = faster
    const JUMP_SPEED = -13;
    let map: number[][] = randomMap();

    let coins: Coin[] = [];
    let players: Player[] = [];
    const playerSocketMap: Map<String, Player> = new Map();
    const socketMap: Map<String, Socket> = new Map();
    const controlsMap: Map<String, ControlsInterface> = new Map();
    const ipMap: Map<String | String[], boolean> = new Map();

    const httpServer: NetServer = res.socket.server as any;
    const io: ServerIO = new ServerIO(httpServer);
    res.socket.server.io = io;

    const sendMap = (socket: Socket) => {
      socket.emit("map", map);
    };

    io.on("connection", (socket: Socket) => {
      const playerName = socket.handshake.query.name ?? random.first();
      console.log(`Player ${playerName} connected`);

      const ipAddress =
        socket.handshake.headers["x-forwarded-for"] ??
        socket.handshake.headers["x-real-ip"] ??
        socket.handshake.address;

      // if (ipMap.get(ipAddress)) {
      //   console.log(`Player already connected`);
      //   socket.disconnect();
      //   return;
      // }
      ipMap.set(ipAddress, true);

      sendMap(socket);

      const player: Player = {
        x: 100,
        y: 100,
        vx: 0,
        vy: 0,
        score: 0,
        name: playerName,
        id: socket.id,
        colour: `#${Math.floor(Math.random() * (0xffffff + 1)).toString(16)}`,
        jumps: { 1: true, 2: true },
        ping: 0,
      };

      ping();
      setInterval(() => ping(), 5000);

      socketMap.forEach((value, key) => {
        if (key !== player.id) {
          value.emit("playerJoin", player.name);
        }
      });

      playerSocketMap.set(socket.id, player);
      socketMap.set(socket.id, socket);
      players.push(player);

      socket.on("disconnect", () => {
        console.log(`${player.name} disconnected`);
        socketMap.forEach((value, key) => {
          if (key !== player.id) {
            value.emit("playerLeave", player.name);
          }
        });
        ipMap.delete(ipAddress);
        playerSocketMap.delete(socket.id);
        players = players.filter((player) => player.id !== socket.id);
      });

      socket.on("controls", (controls) => {
        controlsMap.set(socket.id, controls);
      });
    });

    const ping = () => {
      socketMap.forEach((value, key) => {
        const start = Date.now();
        value.emit("ping", () => {
          const duration = Date.now() - start;
          playerSocketMap.get(key)!.ping = duration;
        });
      });
    };

    const collidables = (): Collidable[] => {
      const collisions: Collidable[] = [];
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
          if (map[row][col] !== 0) {
            collisions.push({
              y: row * TILE_SIZE,
              x: col * TILE_SIZE,
            });
          }
        }
      }
      return collisions;
    };

    const isCollidingWithMap = (player: Player) => {
      for (const collidable of collidables()) {
        if (
          isOverlap(
            getPlayerBoundingBoxFactory(player),
            getTileBoundingBoxFactory(collidable)
          )
        ) {
          return true;
        }
      }
      return false;
    };

    const isOverlap = (rect1: Rect, rect2: Rect) => {
      if (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      ) {
        return true;
      } else {
        return false;
      }
    };

    const getPlayerBoundingBoxFactory = (entity: Player) => {
      return {
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        x: entity.x,
        y: entity.y,
      };
    };
    const getTileBoundingBoxFactory = (entity: Collidable) => {
      return {
        width: TILE_SIZE,
        height: TILE_SIZE,
        x: entity.x,
        y: entity.y,
      };
    };
    const getCoinBoundingBoxFactory = (entity: Coin) => {
      return {
        width: COIN_SIZE,
        height: COIN_SIZE,
        x: entity.x,
        y: entity.y,
      };
    };

    const resetGame = () => {
      for (const player of players) {
        player.score = 0;
        player.x = 100;
        player.y = 100;
        player.vx = 0;
        player.vy = 0;
      }
      coins = [];
      map = randomMap();
      socketMap.forEach((value, key) => {
        sendMap(value);
      });
    };

    const spawnCoin = () => {
      if (coins.length > MAX_COINS) return;
      const randomRow = Math.floor(Math.random() * map.length);
      const randomCol = Math.floor(Math.random() * map[0].length);
      if (map[randomRow][randomCol] !== 0) return;
      coins.push({
        x: randomCol * TILE_SIZE,
        y: randomRow * TILE_SIZE,
      });
    };
    setInterval(spawnCoin, COIN_SPAWN_RATE);

    const tick = (delta: number) => {
      for (const player of players) {
        const playerControls: ControlsInterface | undefined = controlsMap.get(
          player.id
        );

        for (let i = coins.length - 1; i >= 0; i--) {
          const coin = coins[i];
          if (
            isOverlap(
              getCoinBoundingBoxFactory(coin),
              getPlayerBoundingBoxFactory(player)
            )
          ) {
            player.score++;
            coins.splice(i, 1);
            if (player.score >= END_GAME_SCORE) {
              socketMap.forEach((value, key) => {
                if (key === player.id) {
                  value.emit("playVictorySound");
                } else {
                  value.emit("playDefeatSound");
                }
              });
              resetGame();
              return;
            }
            socketMap.get(player.id)!.emit("playCoinSound");
          }
        }

        if (playerControls) {
          if (playerControls.respawn) {
            player.x = 100;
            player.y = 100;
            player.vy = 0;
          }
          if (playerControls.right) {
            player.x += playerControls.sprint
              ? PLAYER_SPEED * 1.5
              : PLAYER_SPEED;

            if (isCollidingWithMap(player)) {
              player.x -= playerControls.sprint
                ? PLAYER_SPEED * 1.5
                : PLAYER_SPEED;
            }
          } else if (playerControls.left) {
            player.x -= playerControls.sprint
              ? PLAYER_SPEED * 1.5
              : PLAYER_SPEED;

            if (isCollidingWithMap(player)) {
              player.x += playerControls.sprint
                ? PLAYER_SPEED * 1.5
                : PLAYER_SPEED;
            }
          }

          //The higher vy is, the more gravity downwards you have
          player.vy += playerControls.down
            ? GRAVITY * delta * 4
            : GRAVITY * delta;
          player.y += player.vy;

          //Landing on terrain after a jump
          if (isCollidingWithMap(player)) {
            if (player.vy > 0) {
              player.jumps = { 1: true, 2: true };
            }
            player.y -= player.vy;
            player.vy = 0;
          }
          //TODO: fix double jumps
          if (playerControls.jump && player.jumps[1] && player.jumps[2]) {
            player.jumps[1] = false;
            player.vy = JUMP_SPEED;
          } else if (
            playerControls.jump &&
            !player.jumps[1] &&
            player.jumps[2]
          ) {
            player.jumps[1] = false;
            player.jumps[2] = false;
            player.vy = JUMP_SPEED;
          }

          if (player.y > map.length * TILE_SIZE * 2) {
            player.x = 100;
            player.y = 100;
            player.vy = 0;
          }
        }
      }

      io.emit("players", players);
      io.emit("coins", coins);
    };

    let lastUpdate = Date.now();
    setInterval(() => {
      const now = Date.now();
      tick(now - lastUpdate);
      lastUpdate = now;
    }, 1000 / TICK_RATE);
  }

  res.end();
};

export default SocketHandler;
