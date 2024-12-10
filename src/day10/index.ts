import run from "aocrunner";

const parseInput = (rawInput: string): number[][] => {
  return rawInput
    .trim()
    .split("\n")
    .map((row) => row.split("").map(Number));
};

function getKey(row: number, col: number): string {
  return `${row},${col}`;
}

const bfsc =
  (input: number[][], part1 = true) =>
  (row: number, col: number): number => {
    const rows = input.length;
    const cols = input[0].length;
    const dirs: [number, number][] = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    const queue: [number, number][] = [[row, col]];
    const visited = new Set<string>();
    visited.add(getKey(row, col));
    let count = 0;

    while (queue.length) {
      const [y, x] = queue.shift()!;
      for (const [dy, dx] of dirs) {
        const newy = y + dy;
        const newx = x + dx;
        if (
          newy >= 0 &&
          newy < rows &&
          newx >= 0 &&
          newx < cols &&
          input[newy][newx] === input[y][x] + 1
        ) {
          if (part1 && visited.has(getKey(newy, newx))) continue;
          if (part1) visited.add(getKey(newy, newx));
          queue.push([newy, newx]);
          if (input[newy][newx] === 9) count++;
        }
      }
    }
    return count;
  };

function solve(rawInput: string, part1 = true) {
  const input = parseInput(rawInput);

  let s = 0;

  const bfs = bfsc(input, part1);
  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[0].length; c++) {
      if (input[r][c] === 0) {
        s += bfs(r, c);
      }
    }
  }

  return s;
}

run({
  part1: {
    tests: [
      {
        input: `
 89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
        `,
        expected: 36,
      },
    ],
    solution: (rawInput: string) => solve(rawInput, true),
  },
  part2: {
    tests: [
      {
        input: `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
        `,
        expected: 81,
      },
    ],
    solution: (rawInput: string) => solve(rawInput, false),
  },
  trimTestInputs: true,
  onlyTests: false,
});
