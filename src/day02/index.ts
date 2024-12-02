import run from "aocrunner";

const parseInput = (rawInput: string): number[][] => {
  const rows = rawInput.split("\n");
  const r: any[][] = rows.map((row) => row.split(" "));
  for (let i = 0; i < r.length; i++) {
    r[i] = r[i].map((value) => parseInt(value));
  }
  return r;
};

function increasing(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false;
    }
  }
  return true;
}

function decreasing(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1]) {
      return false;
    }
  }
  return true;
}

function monotonic(arr: number[]) {
  return increasing(arr) || decreasing(arr);
}

const isSafe = (arr: number[]) => {
  if (!monotonic(arr)) {
    return false;
  }

  for (let i = 0; i < arr.length; i++) {
    if (
      Math.abs(arr[i] - arr[i + 1]) === 0 ||
      Math.abs(arr[i] - arr[i + 1]) > 3
    ) {
      return false;
    }
  }
  return true;
};

const part1 = (rawInput: string) => {
  let safecount = 0;
  const input = parseInput(rawInput);
  for (let i = 0; i < input.length; i++) {
    if (isSafe(input[i])) safecount++;
  }
  return safecount;
};

const part2 = (rawInput: string) => {
  let safecount = 0;
  const input = parseInput(rawInput);
  for (let i = 0; i < input.length; i++) {
    if (isSafe(input[i])) {
      safecount++;
      continue;
    }

    let passed = false;
    for (let k = 0; k < input[i].length; k++) {
      if (passed) break;
      const slicedInput = input[i].slice(0, k).concat(input[i].slice(k + 1));
      if (isSafe(slicedInput)) {
        safecount++;
        passed = true;
        break;
      }
    }
  }
  return safecount;
};

run({
  part1: {
    tests: [
      {
        input: `7 6 4 2 1`,
        expected: 1,
      },
      {
        input: `1 3 6 7 9`,
        expected: 1,
      },
      {
        input: `
        1 2 7 8 9
        9 7 6 2 1
        1 3 2 4 5
        8 6 4 4 1`,
        expected: 0,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        8 6 4 4 1`,
        expected: 1,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
