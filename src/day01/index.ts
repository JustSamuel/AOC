import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const left = [],
    right = [],
    numbers = rawInput.split("\n");
  for (let i = 0; i < numbers.length; i++) {
    let entry = numbers[i].split("  ");
    left.push(parseInt(entry[0]));
    right.push(parseInt(entry[1]));
  }
  return { left, right };
};

const part1 = (rawInput: string) => {
  const { left, right } = parseInput(rawInput);
  let distance = 0;

  left.sort();
  right.sort();
  for (let i = 0; i < left.length; i++) {
    distance += Math.abs(left[i] - right[i]);
  }
  return distance;
};

function count(array: number[], value: number) {
  return array.reduce(
    (count, current) => (current === value ? count + 1 : count),
    0,
  );
}

const part2 = (rawInput: string) => {
  const { left, right } = parseInput(rawInput);
  let score = 0;

  left.forEach((value, index) => {
    const c = count(right, value);
    score += value * c;
  });

  return score;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
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
