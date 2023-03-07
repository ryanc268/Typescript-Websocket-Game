import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Image from "next/image";

const random = require("random-name");
const Filter = require("bad-words");

interface CustomizeCharProps {
  setIsCustomized: Dispatch<SetStateAction<boolean>>;
  setName: Dispatch<SetStateAction<string>>;
  setColour: Dispatch<SetStateAction<string>>;
}

const CustomizeChar: React.FC<CustomizeCharProps> = ({
  setIsCustomized,
  setName,
  setColour,
}) => {
  const username = useRef<HTMLInputElement | null>(null);
  const colour = useRef<HTMLInputElement | null>(null);
  const filter = new Filter();

  useEffect(() => {
    colour.current!.value = `#${Math.floor(
      Math.random() * (0xffffff + 1)
    ).toString(16)}`;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = username.current?.value
      ? username.current?.value
      : random.first();
    if (filter.isProfane(name)) {
      alert("Username may not be a profane word!");
      return;
    }
    setName(name);
    setColour(colour.current!.value);
    setIsCustomized(true);
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            className="mx-auto h-12 w-auto"
            src="/img/ryanlogo.png"
            alt="Ryanc268 logo"
            width="100"
            height="100"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-300">
            Ryans Cube Game
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter you account info below
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-zinc-800 py-8 px-4 shadow rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Nickname
                </label>
                <div className="mt-1">
                  <input
                    id="nickname"
                    type="text"
                    placeholder="Enter Your Nickname"
                    ref={username}
                    //required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-300"
                >
                  Colour
                </label>
                <div className="mt-1 flex">
                  <input
                    id="color"
                    type="color"
                    ref={colour}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Load Game
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomizeChar;
