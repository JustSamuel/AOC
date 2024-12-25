import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const schematics = rawInput.split("\n\n");
  const keys: number[][] = [];
  const locks: number[][] = [];
  schematics.forEach(schematic => {
    const s = schematic.split("\n");
    const [heights, isLock] = toHeights(s);
    if (isLock) {
      locks.push(heights);
    } else {
      keys.push(heights);
    }
  });
  return { keys, locks };
};

const toHeights = (schematic: string[]): [number[], boolean] => {
  const isLock = schematic[0][0] === "#"; // Locks have top filled
  const cols = schematic[0].length;
  const heights = Array(cols).fill(0);

  if (isLock) {
    for (let col = 0; col < cols; col++) {
      let height = 0;
      for (const row of schematic) {
        if (row[col] === "#") height++;
        else break;
      }
      heights[col] = height;
    }
  } else {
    for (let col = 0; col < cols; col++) {
      let height = 0;
      for (let row = schematic.length - 1; row >= 0; row--) {
        if (schematic[row][col] === "#") height++;
        else break;
      }
      heights[col] = height;
    }
  }
  return [heights, isLock];
};

const part1 = (rawInput: string): number => {
  const { keys, locks } = parseInput(rawInput);

  let validPairs = 0;
  for (const lock of locks) {
    for (const key of keys) {
      const test = lock.every((l, i) => l + key[i] <= 7)
      // console.info(lock, key, test);
      if (test) {
        validPairs++;
      }
    }
  }

  return validPairs;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
        `,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
