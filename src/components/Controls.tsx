const Controls: React.FC = () => {
  return (
    <ul
      id="controls"
      className="fixed top-0 left-0 list-none rounded-md bg-zinc-800 p-3 font-serif text-gray-300"
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
