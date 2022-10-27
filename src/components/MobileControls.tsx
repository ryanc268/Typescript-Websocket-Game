import { Dispatch, SetStateAction } from "react";
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
  const controlsChange = (key: KeyMap, state: boolean) => {
    let controls: Map<KeyMap, boolean> = new Map();
    controls.set(key, state);
    setMobileControls(controls);
  };

  return (
    <div
      id="mobilecontrols"
      className="fixed bottom-0 grid w-full grid-cols-12 grid-rows-2 rounded-md bg-zinc-800 bg-opacity-70 md:invisible"
    >
      <button
        onTouchStart={() => controlsChange(KeyMap.Left, true)}
        onTouchEnd={() => controlsChange(KeyMap.Left, false)}
        className="col-start-1 col-end-4 row-start-1"
      >
        <ArrowLeftIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => controlsChange(KeyMap.Jump, true)}
        onTouchEnd={() => controlsChange(KeyMap.Jump, false)}
        className="col-start-4 col-end-10 row-start-1"
      >
        <p className="text-lg font-bold text-blue-500">Jump</p>
      </button>
      <button
        onTouchStart={() => controlsChange(KeyMap.Right, true)}
        onTouchEnd={() => controlsChange(KeyMap.Right, false)}
        className="col-start-10 col-end-13 row-start-1"
      >
        <ArrowRightIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => controlsChange(KeyMap.Sprint, true)}
        onTouchEnd={() => controlsChange(KeyMap.Sprint, false)}
        className="col-start-1 col-end-6 row-start-2"
      >
        <p className="text-lg font-bold text-blue-500">Sprint</p>
      </button>
      <button
        onTouchStart={() => controlsChange(KeyMap.Down, true)}
        onTouchEnd={() => controlsChange(KeyMap.Down, false)}
        className="col-start-6 col-end-8 row-start-2"
      >
        <ArrowDownIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => controlsChange(KeyMap.Respawn, true)}
        onTouchEnd={() => controlsChange(KeyMap.Respawn, false)}
        className="col-start-8 col-end-13 row-start-2"
      >
        <p className=" text-lg font-bold text-blue-500">Respawn</p>
      </button>
    </div>
  );
};

export default MobileControls;
