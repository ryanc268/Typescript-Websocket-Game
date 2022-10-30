import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const Controls: React.FC = () => {
  return (
    <Popover className="absolute top-0 right-0">
      {({ open }) => (
        <>
          <Popover.Button
            onKeyDown={(e: any) => e.preventDefault()}
            className={classNames(
              open ? "text-black" : "text-white",
              "group inline-flex items-center rounded-md bg-zinc-800 px-3 text-base font-medium hover:text-gray-900"
            )}
          >
            <span className="py-2 px-4 text-white">Controls</span>
            <ChevronDownIcon
              className={classNames(
                open ? "text-gray-600" : "text-gray-400",
                "ml-2 h-5 w-5 group-hover:text-gray-500"
              )}
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 mx-1 mt-2 w-max rounded-md bg-zinc-800 p-4">
              <div className="">
                <ul id="controls">
                  <li>A = Left</li>
                  <li>D = Right</li>
                  <li>S = Fast Fall</li>
                  <li>R = Respawn</li>
                  <li>Shift = Sprint</li>
                  <li>Space = Jump</li>
                </ul>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default Controls;
