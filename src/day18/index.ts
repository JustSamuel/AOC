import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map(line => line.split(",").map(Number));
};

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];

const getKey = (x: number, y: number) => `${x},${y}`;

// Yet another, never seen before, BFS
const bfs = (bytes: number[][], count: number, size: number): number => {
  const grid = Array.from({ length: size }, () => Array(size).fill('.'));

  for (let i = 0; i < count && i < bytes.length; i++) {
    const [x, y] = bytes[i];
    grid[y][x] = '#';
  }

  const queue = [[0, 0, 0]];
  const visited = new Set<string>();
  visited.add(getKey(0, 0));

  while (queue.length > 0) {
    const [x, y, dist] = queue.shift()!;
    if (x === size - 1 && y === size - 1) {
      return dist;
    }

    for (const [dx, dy] of dirs) {
      const newX = x + dx;
      const newY = y + dy;
      if (
          newX >= 0 && newX < size &&
          newY >= 0 && newY < size &&
          !visited.has(getKey(newX,newY)) && grid[newY][newX] === '.'
      ) {
        visited.add(getKey(newX, newY));
        queue.push([newX, newY, dist + 1]);
      }
    }
  }

  return -1;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const size = 71;
  return bfs(input, 1024, size);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const size = 71;
  // We know that 1024 works
  let left = 1024;
  let right = input.length
  let s = 0;

  // Finally a binary search this AoC <3
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (bfs(input, mid, size) !== -1) {
      s = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return input[s].join(',');
};

run({
  part1: {
    tests: [
    ],
    solution: part1,
  },
  part2: {
    tests: [
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
