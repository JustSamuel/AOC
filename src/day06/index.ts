import run from "aocrunner";

interface Coord {
  x: number;
  y: number;
}

const parseInput = (rawInput: string): {grid: string[][], start: Coord, dirOfTravel: Record<string, Set<string>>} => {
  const grid: string[][] = [];
  const input = rawInput.split("\n");
  input.forEach((line) => {
    const lineArr = line.split("");
    grid.push(lineArr);
  });

  loopLocations = new Set<string>();
  let start: Coord = findStart(grid);

  let dirOfTravel: Record<string, Set<string>> = {};
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      dirOfTravel[toKey(j, i)] = new Set<string>();
    }
  }

  return {grid, start, dirOfTravel};
};

function findStart(grid: string[][]) {
  let start: Coord = { x: 0, y: 0 };
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const current = grid[i][j];
      if (current === "<" || current === ">" || current === "^" || current === "v") {
        start = { x: j, y: i };
        break;
      }
    }
  }
  return start;
}

function turn(dir: string): string {
  switch (dir) {
    case "^":
      return ">";
    case ">":
      return "v";
    case "<":
      return "^";
    case "v":
      return "<";
  }
  return dir;
}

function getNextCoord(grid: string[][], start: Coord, char: string) {
  switch (char) {
    case "^":
      return {y: start.y - 1, x: start.x};
    case ">":
      return {y: start.y, x: start.x + 1};
      break;
    case "<":
      return {y: start.y, x: start.x - 1};
      break;
    case "v":
      return {y: start.y + 1, x: start.x};
      break;
  }
  return {x: 0, y: 0};
}

function nextInBounds(grid: string[][], start: Coord, char: string): boolean {
  const next = getNextCoord(grid, start, char);
  return next.y >= 0 && next.y < grid.length && next.x >= 0 && next.x < grid[0].length;
}

function toKey(x: number, y: number) {
  return `${x},${y}`;
}

let loopLocations = new Set<string>();
let distinct = new Set<string>();

function walk(grid: string[][], start: Coord, dirOfTravel: Record<string, Set<string>>, allowRecurse = true, part1 = false): boolean {
  let char = grid[start.y][start.x];
  let location = start;

  dirOfTravel[toKey(start.x, start.y)].add(char);

  const isInBounds =
    start.x >= 0 &&
    start.x < grid[0].length &&
    start.y >= 0 &&
    start.y < grid.length;
  if (!isInBounds) return false;

  while (true) {
    dirOfTravel[toKey(location.x, location.y)].add(char);
    const c = nextInBounds(grid, location, char);
    if (!c) return false;

    if(part1) distinct.add(toKey(location.x, location.y));

    let next = getNextCoord(grid, location, char);
    const nextChar = grid[next.y][next.x];
    if (nextChar === "#") {
      char = turn(char);
      grid[location.y][location.x] = char;
      next = location;
    }

    if (dirOfTravel[toKey(next.x, next.y)].has(char)) {
      return true;
    }

    if (allowRecurse) {
      if (
        !(
          next.x === start.x &&
          next.y === start.y
        ) && grid[next.y][next.x] !== "#"
      ) {
        const gridClone: string[][] = [];
        for (let i = 0; i < grid.length; i++) {
          gridClone[i] = Array(grid[i].length);
          for (let j = 0; j < grid[i].length; j++) {
            gridClone[i][j] = grid[i][j];
          }
        }

        const dirOfTravelClone: Record<string, Set<string>> = {};
        for (let key in dirOfTravel) {
          dirOfTravelClone[key] = new Set();
        }
        gridClone[next.y][next.x] = "#";
        gridClone[location.y][location.x] = char;

        const loop = walk(
          gridClone,
          { x: start.x, y: start.y },
          dirOfTravelClone,
          false,
          false,
        );
        if (loop) {
          loopLocations.add(toKey(next.x, next.y));
        }
      }
    }


    grid[next.y][next.x] = char;
    location = next;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  walk(input.grid, input.start, input.dirOfTravel, false, true);
  return distinct.size + 1;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let res = walk(input.grid, input.start, input.dirOfTravel);
  let score = loopLocations.size;
  if (res) {
    score = score + 1;
  }
  return score;
};

run({
  part1: {
    tests: [
      {
        input: `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
        `,
        expected: 41,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 6,
      },
      {
        input: `
        .#...
        ....#
        .....
        #^...
        .....
        `,
        expected: 1
      },
      {
        input: `
        ..#...
        .#...#
        .#....
        .#^...
        ......
        `,
        expected: 3
      },
      {
        input: `
        ..#...
        .#...#
        ......
        .#^.#.
        ......
        `,
        expected: 2
      },
      {
        input: `
        ......
        .....#
        ......
        .#^...
        ....#.
        `,
        expected: 1
      },
      {
        input: `
>......
......#
......#
......#
......#
......#
        `,
        expected: 0
      },{
        input: `
        .#....
.#....
.#....
.#^...
......
        `,
        expected: 0
      },
      {
        input: `
        #...#.......#...
        ............#...
        ................
        ...........#....
        ^...............`,
        expected: 1
      },
      {
        input: `
..#.#.....
.......#..
..........
.#..^.....
........#.
..........
..........
#......#..
......#...`,
        expected: 7,
      },
      {
        input: `
        ################
        #...#.......#...
        ............#...
        ................
        ...........#....
        ^...............`,
        expected: 8
      },
      {
        input: `
        .#..#.
        #....#
        #^....
        .#....`,
        expected: 3
      },
      {
        input: `
        #...
        ...#
        ^...
        ..#.`,
        expected: 0
      },
      {
        input: `
        ..#..
        .#.#.
        .#..<
        ...#.
        ..#..`,
        expected: 3
      }
    ],

    solution: part2,

  },
  trimTestInputs: true,
  onlyTests: false,
});
