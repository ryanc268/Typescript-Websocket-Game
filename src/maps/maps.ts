export const mainMap = () => {
  return [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
};

let blockInARow = 0;
let spaceInARow = 0;

export const randomMap = () => {
  const max = Math.floor(Math.random() * 10) + 20;
  const BLOCK_WEIGHT = Math.floor(Math.random() * 7) + 3;
  const SPACE_WEIGHT = Math.floor(Math.random() * 25) + 30;
  console.log(`Block`, BLOCK_WEIGHT);
  console.log(`Space`, SPACE_WEIGHT);
  const columns = max;
  const rows = max;
  let mapArr: number[][] = [];
  for (let i = 0; i < rows; i++) {
    mapArr[i] = [];
    for (let j = 0; j < columns; j++) {
      const tile: number = tileAlgorithm(i, j, BLOCK_WEIGHT, SPACE_WEIGHT);
      mapArr[i][j] = tile;
    }
  }
  return mapArr;
};

const tileAlgorithm = (
  i: number,
  j: number,
  BLOCK_WEIGHT: number,
  SPACE_WEIGHT: number
) => {
  let tile: number = 0;
  if (isUnderSpawn(i, j)) {
    return 1;
  } else if (!isSpawn(i, j)) {
    if (blockInARow > 0) {
      if (Math.floor(Math.random() * BLOCK_WEIGHT) > blockInARow) {
        tile = 1;
      } else {
        tile = 0;
      }
    } else if (spaceInARow > 0) {
      if (Math.floor(Math.random() * SPACE_WEIGHT) > spaceInARow) {
        tile = 0;
      } else {
        tile = 1;
      }
    } else {
      tile = Math.floor(Math.random() * 2);
    }
  } else {
    tile = 0;
  }
  tile === 1 ? blockInARow++ : (blockInARow = 0);
  tile === 0 ? spaceInARow++ : (spaceInARow = 0);
  return tile;
};

const isSpawn = (i: number, j: number) => {
  if (i === 3 || (i === 4 && j === 3) || j === 4) {
    return true;
  } else {
    return false;
  }
};

const isUnderSpawn = (i: number, j: number) => {
  if (i === 4 && j === 3) {
    return true;
  } else {
    return false;
  }
};
