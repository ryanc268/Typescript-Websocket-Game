import React, { Dispatch, SetStateAction, useRef } from "react";
const random = require("random-name");
const Filter = require("bad-words");

interface CustomizeCharProps {
  setIsCustomized: Dispatch<SetStateAction<boolean>>;
  setName: Dispatch<SetStateAction<string>>;
}

const CustomizeChar: React.FC<CustomizeCharProps> = ({
  setIsCustomized,
  setName,
}) => {
  const username = useRef<HTMLInputElement | null>(null);
  const filter = new Filter();

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
    setIsCustomized(true);
  };

  return (
    <div className="relative h-screen w-full">
      <div className="flex h-full items-center justify-center">
        <form
          className="mx-auto w-full max-w-[400px] rounded-lg bg-zinc-800 p-8"
          onSubmit={handleSubmit}
        >
          <h2 className="py-4 text-center text-4xl font-bold">
            Ryans Cube Game
          </h2>
          <div className="mb-4 flex flex-col">
            <label>Username</label>
            <input
              className="relative rounded-lg border bg-zinc-600 p-2"
              type="text"
              placeholder="Name"
              ref={username}
            />
          </div>
          <button
            className="relative mt-6 w-full rounded-lg bg-indigo-900 py-3 text-white hover:bg-indigo-800"
            type="submit"
          >
            Load Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomizeChar;
function userRef() {
  throw new Error("Function not implemented.");
}
