import run from "aocrunner";

type Position = { x: number; y: number };

function parseInput(rawInput: string): string[][] {
  return rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));
}

function pos(grid: string[][]): {
  start: Position;
  end: Position;
} {
  let start = { x: 0, y: 0 };
  let end = { x: 0, y: 0 };

  grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell === "S") start = { x, y };
      else if (cell === "E") end = { x, y };
    }),
  );

  return { start, end };
}

function neighbours(x: number, y: number, grid: string[][]): Position[] {
  const neighbors: Position[] = [];

  if (x > 0) neighbors.push({ x: x - 1, y });
  if (x < grid[0].length - 1) neighbors.push({ x: x + 1, y });
  if (y > 0) neighbors.push({ x, y: y - 1 });
  if (y < grid.length - 1) neighbors.push({ x, y: y + 1 });

  return neighbors;
}

function bfs(grid: string[][], start: Position, end: Position): Position[] {
  const path: Position[] = [];
  const queue: Position[] = [start];

  const visited = new Set<string>();

  while (queue.length) {
    const pos = queue.shift()!;
    path.push(pos);

    if (pos.x === end.x && pos.y === end.y) break;

    visited.add(`${pos.x},${pos.y}`);

    const neighbors = neighbours(pos.x, pos.y, grid);

    for (const neighbor of neighbors) {
      if (
        grid[neighbor.y][neighbor.x] !== "#" &&
        !visited.has(`${neighbor.x},${neighbor.y}`)
      ) {
        queue.push(neighbor);
      }
    }
  }

  return path;
}

function skips(path: Position[], maxDistance: number): number {
  let skips = 0;
  const savedArr: Record<number, number> = {};

  for (let first = 0; first < path.length - 1; first++) {
    for (let second = first + 1; second < path.length; second++) {
      const saved = second - first;

      const xDiff = Math.abs(path[first].x - path[second].x);
      const yDiff = Math.abs(path[first].y - path[second].y);

      if (xDiff + yDiff <= maxDistance) {
        const s = saved - (xDiff + yDiff);
        if (s >= 100) {
          skips++;
          savedArr[s] = (savedArr[s] || 0) + 1;
        }
      }
    }
  }

  return skips;
}

const solution = (rawInput: string, maxDistance: number) => {
  const grid = parseInput(rawInput);
  const { start, end } = pos(grid);
  const path = bfs(grid, start, end);
  return skips(path, maxDistance);
};

run({
  part1: {
    tests: [
      {
        input: `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
        `,
        expected: 0,
      },
    ],
    solution: (rawInput: string) => solution(rawInput, 2),
  },
  part2: {
    tests: [
      {
        input: `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
        `,
        expected: 0,
      },
    ],
    solution: (rawInput: string) => solution(rawInput, 20),
  },
  trimTestInputs: true,
});
