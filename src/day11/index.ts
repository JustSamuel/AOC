import run from "aocrunner";

type Stones = Map<string, number>;

const parseInput = (rawInput: string): Stones => {
  const input = rawInput.split(" ");
  const stoneCounts: Stones = new Map();

  for (const stone of input) {
    stoneCounts.set(stone, (stoneCounts.get(stone) || 0) + 1);
  }

  return stoneCounts;
};

const stoneMemo: Map<string, string[]> = new Map();

function handle(stone: string): string[] {
  if (stoneMemo.has(stone)) {
    return stoneMemo.get(stone)!;
  }

  const result: string[] = [];
  if (stone === "0") {
    result.push("1");
  } else if (stone.length % 2 === 0) {
    const left = parseInt(stone.slice(0, stone.length / 2));
    const right = parseInt(stone.slice(stone.length / 2));
    result.push(left.toString());
    result.push(right.toString());
  } else {
    result.push((parseInt(stone) * 2024).toString());
  }

  stoneMemo.set(stone, result);
  return result;
}

function blink(stones: Map<string, number>): Stones {
  const newStones: Stones = new Map();

  for (const [stone, count] of stones) {
    const blinkedStones = handle(stone);

    for (const blinked of blinkedStones) {
      newStones.set(blinked, (newStones.get(blinked) || 0) + count);
    }
  }

  return newStones;
}

const solve = (rawInput: string, iterations: number): number => {
  let stones = parseInput(rawInput);

  for (let i = 0; i < iterations; i++) {
    stones = blink(stones);
  }

  let totalStones = 0;
  let length = 0;
  console.info(stones.size, stoneMemo.size);
  for (const stone of stones.keys()) {
    length += stone.length * stones.get(stone)!;
  }
  console.info(length);
  for (const count of stones.values()) {
    totalStones += count;
  }

  return totalStones;
};

run({
  part1: {
    tests: [
      {
        input: `
        125 17
        `,
        expected: 55312,
      },
    ],
    solution: (rawInput: string) => solve(rawInput, 25),
  },
  part2: {
    tests: [],
    solution: (rawInput: string) => solve(rawInput, 75),
  },
  trimTestInputs: true,
  onlyTests: false,
});
