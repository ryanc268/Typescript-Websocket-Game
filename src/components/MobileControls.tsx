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
      className="fixed bottom-0 grid w-full grid-cols-12 grid-rows-2 rounded-md bg-zinc-800 bg-opacity-70 md:invisible"
    >
      <button
        onTouchStart={() => controlsChange("left", true)}
        onTouchEnd={() => controlsChange("left", false)}
        className="col-start-1 col-end-4 row-start-1"
      >
        <ArrowLeftIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => controlsChange("jump", true)}
        onTouchEnd={() => controlsChange("jump", false)}
        className="col-start-4 col-end-10 row-start-1"
      >
        <p className="text-lg font-bold text-blue-500">Jump</p>
      </button>
      <button
        onTouchStart={() => controlsChange("right", true)}
        onTouchEnd={() => controlsChange("right", false)}
        className="col-start-10 col-end-13 row-start-1"
      >
        <ArrowRightIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => controlsChange("sprint", true)}
        onTouchEnd={() => controlsChange("sprint", false)}
        className="col-start-1 col-end-6 row-start-2"
      >
        <p className="text-lg font-bold text-blue-500">Sprint</p>
      </button>
      <button
        onTouchStart={() => controlsChange("down", true)}
        onTouchEnd={() => controlsChange("down", false)}
        className="col-start-6 col-end-8 row-start-2"
      >
        <ArrowDownIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => controlsChange("respawn", true)}
        onTouchEnd={() => controlsChange("respawn", false)}
        className="col-start-8 col-end-13 row-start-2"
      >
        <p className=" text-lg font-bold text-blue-500">Respawn</p>
      </button>
    </div>
  );
};

export default MobileControls;
