import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n");
};

const part1 = (rawInput: string) => {
  const grid: string[] = parseInput(rawInput);
  const r = grid.length,
    c = grid[0].length;

  const locs = new Set();
  const res: Record<string, string[]> = {};
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (grid[i][j] !== ".")
        res[grid[i][j]]
          ? res[grid[i][j]].push([i, j])
          : (res[grid[i][j]] = [[i, j]]);
    }
  }

  for (const antenna in res) {
    for (let i = 0; i < res[antenna].length; i++) {
      for (let j = 0; j < res[antenna].length; j++) {
        if (i === j) continue;
        const x = 2 * res[antenna][i][0] - res[antenna][j][0];
        const y = 2 * res[antenna][i][1] - res[antenna][j][1];
        if (x < 0 || x >= r || y < 0 || y >= c) continue;
        locs.add(`${x},${y}`);
      }
    }
  }

  return locs.size;
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const r = grid.length,
    c = grid[0].length;

  const locs = new Set();
  const res: Record<string, string[]> = {};
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (grid[i][j] !== ".")
        res[grid[i][j]]
          ? res[grid[i][j]].push([i, j])
          : (res[grid[i][j]] = [[i, j]]);
    }
  }

  for (const antenna in res) {
    for (let i = 0; i < res[antenna].length; i++) {
      for (let j = 0; j < res[antenna].length; j++) {
        if (i !== j) {
          const antenna1 = res[antenna][i];
          const antenna2 = res[antenna][j];

          let k = 1;
          while (true) {
            const x = (1 - k) * antenna1[0] + k * antenna2[0];
            const y = (1 - k) * antenna1[1] + k * antenna2[1];

            if (x < 0 || x >= r || y < 0 || y >= c) {
              break;
            }

            locs.add(`${x},${y}`);
            k++;
          }
        }
      }
    }
  }

  return locs.size;
};

run({
  part1: {
    tests: [
      {
        input: `
        ......#....#
...#....0...
....#0....#.
..#....0....
....0....#..
.#....A.....
...#........
#......#....
........A...
.........A..
..........#.
..........#.`,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ##....#....#
.#.#....0...
..#.#0....#.
..##...0....
....0....#..
.#...#A....#
...#..#.....
#....#.#....
..#.....A...
....#....A..
.#........#.
...#......##`,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
