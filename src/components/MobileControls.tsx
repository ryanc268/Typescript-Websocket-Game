import { Dispatch, MutableRefObject, SetStateAction } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";
import { KeyMap } from "../global/types/gameEnums";
import { ControlsInterface } from "../global/types/gameTypes";

interface MobileControlsProps {
  controlsRef: MutableRefObject<ControlsInterface>;
}

const MobileControls: React.FC<MobileControlsProps> = ({ controlsRef }) => {
  const setControls = (key: KeyMap, active: boolean) => {
    if (key === KeyMap.Down) {
      controlsRef.current.down = active;
    }
    if (key === KeyMap.Left) {
      controlsRef.current.left = active;
    }
    if (key === KeyMap.Right) {
      controlsRef.current.right = active;
    }
    if (key === KeyMap.Jump) {
      controlsRef.current.jump = active;
    }
    if (key === KeyMap.Respawn) {
      controlsRef.current.respawn = active;
    }
    if (key === KeyMap.Sprint) {
      controlsRef.current.sprint = active;
    }
  };

  return (
    <div
      id="mobilecontrols"
      className="fixed bottom-0 grid w-full grid-cols-12 grid-rows-2 rounded-md bg-zinc-800 bg-opacity-70 md:invisible"
    >
      <button
        onTouchStart={() => setControls(KeyMap.Left, true)}
        onTouchEnd={() => setControls(KeyMap.Left, false)}
        className="col-start-1 col-end-4 row-start-1"
      >
        <ArrowLeftIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => setControls(KeyMap.Jump, true)}
        onTouchEnd={() => setControls(KeyMap.Jump, false)}
        className="col-start-4 col-end-10 row-start-1"
      >
        <p className="text-lg font-bold text-blue-500">Jump</p>
      </button>
      <button
        onTouchStart={() => setControls(KeyMap.Right, true)}
        onTouchEnd={() => setControls(KeyMap.Right, false)}
        className="col-start-10 col-end-13 row-start-1"
      >
        <ArrowRightIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => setControls(KeyMap.Sprint, true)}
        onTouchEnd={() => setControls(KeyMap.Sprint, false)}
        className="col-start-1 col-end-6 row-start-2"
      >
        <p className="text-lg font-bold text-blue-500">Sprint</p>
      </button>
      <button
        onTouchStart={() => setControls(KeyMap.Down, true)}
        onTouchEnd={() => setControls(KeyMap.Down, false)}
        className="col-start-6 col-end-8 row-start-2"
      >
        <ArrowDownIcon className="text-blue-500" />
      </button>
      <button
        onTouchStart={() => setControls(KeyMap.Respawn, true)}
        onTouchEnd={() => setControls(KeyMap.Respawn, false)}
        className="col-start-8 col-end-13 row-start-2"
      >
        <p className=" text-lg font-bold text-blue-500">Respawn</p>
      </button>
    </div>
  );
};

export default MobileControls;
