import run from "aocrunner";

interface Sum {
  sum: number;
  num: number[];
}

const parseInput = (rawInput: string) => {
  const input = rawInput.split("\n");
  const sums: Sum[] = [];
  input.forEach((line) => {
    const lineArr = line.split(":");
    const s = lineArr[0];
    const nums: number[] = [];
    lineArr[1].split(" ").forEach((n) => {
      if (n !== "") {
        nums.push(parseInt(n));
      }
    });
    sums.push({ sum: parseInt(s), num: nums });
  });
  return sums;
};

function isPossible(sum: number, nums: number[], part2 = false): boolean {
  function search(index: number, current: number): boolean {
    if (index === nums.length) {
      return current === sum;
    }

    if (current > sum) {
      return false;
    }

    if (search(index + 1, current + nums[index])) {
      return true;
    }

    if (search(index + 1, current * nums[index])) {
      return true;
    }

    if (!part2) return false;
    const concat = parseInt(`${current}${nums[index]}`);
    return search(index + 1, concat);
  }

  return search(1, nums[0]);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let s = 0;
  input.forEach((sum) => {
    if (isPossible(sum.sum, sum.num, false)) {
      s += sum.sum;
    }
  });

  return s;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let s = 0;
  input.forEach((sum) => {
    if (isPossible(sum.sum, sum.num, true)) {
      s += sum.sum;
    } else {
    }
  });

  return s;
};

run({
  part1: {
    tests: [
      {
        input: `
        190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
        `,
        expected: 3749,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
                190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 11387,
      },
    ], // {
    //   input: ``,
    //   expected: "",
    // },
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
