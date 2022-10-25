import { Dispatch, MutableRefObject, SetStateAction } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";
import { KeyMap } from "../global/types/gameEnums";

interface MobileControlsProps {
  setMobileControls: Dispatch<SetStateAction<Map<KeyMap, boolean>>>;
}

const MobileControls: React.FC<MobileControlsProps> = ({
  setMobileControls,
}) => {
  const controlsChange = (key: string, state: boolean) => {
    let controls: Map<KeyMap, boolean> = new Map();
    if (key === "up") {
      controls.set(KeyMap.Jump, state);
    }
    if (key === "left") {
      controls.set(KeyMap.Left, state);
      controls.set(KeyMap.Right, false);
      controls.set(KeyMap.Down, false);
    }
    if (key === "right") {
      controls.set(KeyMap.Right, state);
      controls.set(KeyMap.Left, false);
      controls.set(KeyMap.Down, false);
    }
    if (key === "down") {
      controls.set(KeyMap.Down, state);
    }
    if (key === "respawn") {
      controls.set(KeyMap.Respawn, state);
    }
    if (key === "sprint") {
      controls.set(KeyMap.Sprint, state);
    }
    setMobileControls(controls);
  };

  return (
    <div
      id="mobilecontrols"
      className="fixed bottom-0 right-1/3 grid w-1/2 place-items-center rounded-md bg-zinc-800 p-3 font-serif text-gray-300 md:invisible"
    >
      <div id="middleRow">
        <button
          onClick={() => controlsChange("left", true)}
          className="h-10 w-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowLeftIcon className="text-blue-500" />
        </button>
        <button
          onClick={() => controlsChange("up", true)}
          className="h-10 w-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <p className="text-blue-500">Jump</p>
        </button>
        <button
          onClick={() => controlsChange("right", true)}
          className="h-10 w-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowRightIcon className="text-blue-500" />
        </button>
      </div>
      <div id="bottomRow">
        <button
          onClick={() => controlsChange("sprint", true)}
          className="h-10 w-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <p className="text-blue-500">Sprint</p>
        </button>
        <button
          onClick={() => controlsChange("down", true)}
          className="h-10 w-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowDownIcon className="text-blue-500" />
        </button>
        <button
          onClick={() => controlsChange("respawn", true)}
          className="h-10 w-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <p className="text-blue-500">Respawn</p>
        </button>
      </div>
    </div>
  );
};

export default MobileControls;
