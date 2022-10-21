//TODO: Fix this to not crash the game

import { MutableRefObject, useEffect, useRef } from "react";
import { END_GAME_SCORE } from "../global/constants";
import { Player } from "../global/types/gameTypes";
import styles from "../styles/Home.module.css";

interface LeaderboardProps {
  players: MutableRefObject<Player[]>;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const leaderboardElRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(drawLeaderboard, 2000);
    drawLeaderboard();
    return () => window.clearInterval(interval);
  }, []);

  const drawLeaderboard = () => {
    leaderboardElRef.current!.innerHTML = "";
    const sortedScores = [...players.current].sort(
      (p1, p2) => p2.score - p1.score
    );
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
      case ping < 70:
        return "#186e1f";
      case ping < 110:
        return "#2ac237";
      case ping < 160:
        return "#d0f05d";
      case ping < 210:
        return "#e7ba3e";
      case ping < 260:
        return "#e6873b";
      case ping >= 260:
        return "#aa3229";
      default:
        return "#186e1f";
    }
  };
  return (
    <div className="fixed right-0 top-0 h-full w-48 space-y-1 bg-zinc-800 p-3 text-base text-gray-300">
      <h1 className="text-2xl font-bold text-slate-300">Scoreboard</h1>
      <hr />
      <div id="leaderboard" ref={leaderboardElRef}></div>
    </div>
  );
};

export default Leaderboard;
