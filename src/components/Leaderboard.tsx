import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { MutableRefObject, useEffect, Fragment, useState } from "react";
import Image from "next/image";
import { END_GAME_SCORE } from "../global/constants";
import { Player } from "../global/types/gameTypes";

interface LeaderboardProps {
  players: MutableRefObject<Player[]>;
  currentPlayer: MutableRefObject<Player | undefined>;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  currentPlayer,
}) => {
  const [sortedScoresRef, setSortedScoresRef] = useState<Player[]>();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const LEADERBOARD_REFRESH_RATE = 200;

  useEffect(() => {
    const interval = setInterval(updateLeaderboard, LEADERBOARD_REFRESH_RATE);
    return () => window.clearInterval(interval);
  });

  const updateLeaderboard = () => {
    setSortedScoresRef(
      [...players.current].sort((p1, p2) => p2.score - p1.score)
    );
  };

  const pingColourPicker = (ping: number) => {
    switch (true) {
      case ping < 70:
        return "text-green-800"; //"#186e1f"
      case ping < 110:
        return "text-green-500"; //"#2ac237"
      case ping < 160:
        return "text-lime-300"; //"#d0f05d"
      case ping < 210:
        return "text-amber-400"; //"#e7ba3e"
      case ping < 260:
        return "text-orange-400"; //"#e6873b"
      case ping >= 260:
        return "text-orange-800"; //"#aa3229"
      default:
        return "text-green-800"; //"#186e1f"
    }
  };
  const bgColourPicker = (playerColour: string) => {
    return { background: playerColour } as React.CSSProperties;
  };

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <Image
                        className="h-8 w-auto"
                        src="/img/ryanlogo.png"
                        alt="ryanc268 logo"
                        width="100"
                        height="100"
                      />
                      <p className="ml-5 text-xl">Leaderboard</p>
                    </div>
                    <nav className="mt-5 flex-1 space-y-1 px-2">
                      {sortedScoresRef?.map((p, i) => (
                        <div key={i} className="flex flex-col py-1">
                          <div className="flex">
                            <div
                              style={bgColourPicker(p.colour)}
                              className="mr-1 scale-75 p-4"
                            />
                            <h3 className="text-xl">{`${p.name}: ${p.score}/${END_GAME_SCORE}`}</h3>
                          </div>
                          <h4 className={`text-xs ${pingColourPicker(p.ping)}`}>
                            {p.ping}ms
                          </h4>
                        </div>
                      ))}
                    </nav>
                  </div>
                  <div className="flex flex-shrink-0 bg-gray-700 p-4">
                    <div className="flex items-center">
                      <div
                        style={bgColourPicker(
                          currentPlayer.current
                            ? currentPlayer.current?.colour
                            : ""
                        )}
                        className="inline-block h-9 w-9 rounded-full"
                      />
                      <div className="ml-3">
                        <h3 className="text-base font-medium text-white">
                          {`${currentPlayer.current?.name ?? "Loading..."} - ${
                            currentPlayer.current?.score ?? "0"
                          }/${END_GAME_SCORE}`}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <Image
                  className="h-8 w-auto"
                  src="/img/ryanlogo.png"
                  alt="ryanc268 logo"
                  width="100"
                  height="100"
                />
                <p className="ml-5 text-xl">Leaderboard</p>
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {sortedScoresRef?.map((p, i) => (
                  <div key={i} className="flex flex-col py-1">
                    <div className="flex">
                      <div
                        style={bgColourPicker(p.colour)}
                        className="mr-1 scale-75 p-4"
                      />
                      <h3 className="text-xl">{`${p.name}: ${p.score}/${END_GAME_SCORE}`}</h3>
                    </div>
                    <h4 className={`text-xs ${pingColourPicker(p.ping)}`}>
                      {p.ping}ms
                    </h4>
                  </div>
                ))}
              </nav>
            </div>
            <div className="flex flex-shrink-0 bg-gray-700 p-4">
              <div className="flex items-center">
                <div
                  style={bgColourPicker(
                    currentPlayer.current ? currentPlayer.current?.colour : ""
                  )}
                  className="inline-block h-9 w-9 rounded-full"
                ></div>

                <div className="ml-3">
                  <h3 className="text-lg font-medium text-white">
                    {`${currentPlayer.current?.name ?? "Loading..."} - ${
                      currentPlayer.current?.score ?? "0"
                    }/${END_GAME_SCORE}`}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 flex items-center bg-gray-700 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-100 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h3 className="text-lg text-white">
              {`${currentPlayer.current?.name ?? "Loading..."} - ${
                currentPlayer.current?.score ?? "0"
              }/${END_GAME_SCORE}`}
            </h3>
          </div>
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {/* Replace with your content */}
                <div className="py-4">
                  <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
                </div>
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
