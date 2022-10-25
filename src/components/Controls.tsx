const Controls: React.FC = () => {
  return (
    <ul
      id="controls"
      className="invisible fixed top-0 right-0 list-none rounded-md bg-zinc-800 p-3 font-serif text-gray-300 md:visible"
    >
      <li>A = Left</li>
      <li>D = Right</li>
      <li>S = Fast Fall</li>
      <li>R = Respawn</li>
      <li>Shift = Sprint</li>
      <li>Space = Jump</li>
    </ul>
  );
};

export default Controls;
