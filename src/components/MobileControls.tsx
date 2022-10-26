import { Dispatch, MutableRefObject, SetStateAction } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
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
    if (key === "jump") {
      controls.set(KeyMap.Jump, state);
    }
    if (key === "left") {
      controls.set(KeyMap.Left, state);
    }
    if (key === "right") {
      controls.set(KeyMap.Right, state);
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
      className="fixed bottom-0 right-0 grid grid-cols-3 gap-3 rounded-md bg-zinc-800 p-5 "
    >
      <button
        onTouchStart={() => controlsChange("left", true)}
        onTouchEnd={() => controlsChange("left", false)}
        //onClick={() => controlsChange("left", true)}
        className="h-15 w-15 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <ArrowLeftIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => controlsChange("jump", true)}
        onTouchEnd={() => controlsChange("jump", false)}
        //onClick={() => controlsChange("jump", true)}
        className="h-15 w-15 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <p className="font-bold text-blue-500">Jump</p>
      </button>
      <button
        onTouchStart={() => controlsChange("right", true)}
        onTouchEnd={() => controlsChange("right", false)}
        //onClick={() => controlsChange("right", true)}
        className="h-15 w-15 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <ArrowRightIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => controlsChange("sprint", true)}
        onTouchEnd={() => controlsChange("sprint", false)}
        //onClick={() => controlsChange("sprint", true)}
        className="h-15 w-15 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <p className="font-bold text-blue-500">Sprint</p>
      </button>
      <button
        onTouchStart={() => controlsChange("down", true)}
        onTouchEnd={() => controlsChange("down", false)}
        //onClick={() => controlsChange("down", true)}
        className="h-15 w-15 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <ArrowDownIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => controlsChange("respawn", true)}
        onTouchEnd={() => controlsChange("respawn", false)}
        //onClick={() => controlsChange("respawn", true)}
        className="h-15 w-15 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <p className="font-bold text-blue-500">Respawn</p>
      </button>
    </div>
  );
};

export default MobileControls;
