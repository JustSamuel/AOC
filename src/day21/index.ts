import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n");
};

const arrows = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
};

const keypad: Record<string, { x: number; y: number }> = {
  7: { x: 0, y: 0 },
  8: { x: 1, y: 0 },
  9: { x: 2, y: 0 },
  4: { x: 0, y: 1 },
  5: { x: 1, y: 1 },
  6: { x: 2, y: 1 },
  1: { x: 0, y: 2 },
  2: { x: 1, y: 2 },
  3: { x: 2, y: 2 },
  X: { x: 0, y: 3 },
  0: { x: 1, y: 3 },
  A: { x: 2, y: 3 },
};

const dirs: Record<string, { x: number; y: number }> = {
  X: { x: 0, y: 0 },
  "^": { x: 1, y: 0 },
  A: { x: 2, y: 0 },
  "<": { x: 0, y: 1 },
  v: { x: 1, y: 1 },
  ">": { x: 2, y: 1 },
};

const paths = (
  input: Record<string, { x: number; y: number }>,
  start: string,
  end: string,
) => {
  const queue = [{ ...input[start], path: "" }];
  const distances: { [key: string]: number } = {};

  if (start === end) return ["A"];

  let allPaths: string[] = [];
  while (queue.length) {
    const current = queue.shift();
    if (current === undefined) break;

    if (current.x === input[end].x && current.y === input[end].y)
      allPaths.push(current.path + "A");
    if (
      distances[`${current.x},${current.y}`] !== undefined &&
      distances[`${current.x},${current.y}`] < current.path.length
    )
      continue;

    Object.entries(arrows).forEach(([direction, vector]) => {
      const position = { x: current.x + vector.x, y: current.y + vector.y };
      if (input.X.x === position.x && input.X.y === position.y) return;

      const button = Object.values(input).find(
        (button) => button.x === position.x && button.y === position.y,
      );
      if (button !== undefined) {
        const newPath = current.path + direction;
        if (
          distances[`${position.x},${position.y}`] === undefined ||
          distances[`${position.x},${position.y}`] >= newPath.length
        ) {
          queue.push({ ...position, path: newPath });
          distances[`${position.x},${position.y}`] = newPath.length;
        }
      }
    });
  }

  return allPaths.sort((a, b) => a.length - b.length);
};

const presses = (
  input: Record<string, { x: number; y: number }>,
  code: string,
  robot: number,
  memo: Record<string, number>,
): number => {
  const key = `${code},${robot}`;
  if (memo[key] !== undefined) return memo[key];

  let current = "A";
  let length = 0;
  for (let i = 0; i < code.length; i++) {
    const moves = paths(input, current, code[i]);
    if (robot === 0) length += moves[0].length;
    else
      length += Math.min(
        ...moves.map((move) => presses(dirs, move, robot - 1, memo)),
      );
    current = code[i];
  }

  memo[key] = length;
  return length;
};

const solve = (rawInput: string, count: number) => {
  const keycodes = parseInput(rawInput);
  const memo: { [key: string]: number } = {};

  return keycodes.reduce((sum, code) => {
    const numerical = parseInt(
      code
        .split("")
        .filter((character) => character.match(/\d/))
        .join(""),
    );
    return sum + numerical * presses(keypad, code, count, memo);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
029A
980A
179A
456A
379A        `,
        expected: 126384,
      },
    ],
    solution: (rawInput: string) => solve(rawInput, 2),
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: (rawInput: string) => solve(rawInput, 25),
  },
  trimTestInputs: true,
  onlyTests: false,
});
