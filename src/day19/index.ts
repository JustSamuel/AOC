import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const towels = rawInput.split("\n\n")[0].split(",");
  towels.forEach((towel, index) => {
    towels[index] = towel.replace(/\s/g, "");
  });
  const designs = rawInput.split("\n\n")[1].split("\n");
  return { towels, designs };
};

const canMakeDesign = (towels: string[], design: string): number => {
  const dp: number[] = new Array(design.length + 1).fill(0);
  dp[0] = 1;
  for (let i = 0; i <= design.length; i++) {
    if (dp[i]) {
      for (const towel of towels) {
        const len = towel.length;
        const substr = design.slice(i, i + len);
        if (i + len <= design.length && substr === towel) {
          dp[i + len] += dp[i];
        }
      }
    }
  }

  return dp[design.length];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let s = 0;
  input.designs.forEach((design) => {
    if (canMakeDesign(input.towels, design)) {
      s++;
    }
  });
  return s;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let s = 0;
  input.designs.forEach((design) => {
    const options = canMakeDesign(input.towels, design);
    s += options;
  });
  return s;
};

run({
  part1: {
    tests: [
      {
        input: `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
        `,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
        `,
        expected: 16,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
