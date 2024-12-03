import run from "aocrunner";

const part1 = (rawInput: string) => {

  const regex = /mul\((\d+),(\d+)\)/g;
  const matches = [...rawInput.matchAll(regex)];

  let score = 0;
  matches.forEach((match) => {
    const [, a, b] = match;
    score += Number(a) * Number(b);
  });

  return score;
};

const part2 = (rawInput: string) => {
  // It would be possible to do this with a single regex, but I am afraid of
  // regexes and complexity, therefore I prefer to do it in multiple smaller regex steps.
  const regexMult = /mul\((\d+),(\d+)\)/g;
  const matches = [...rawInput.matchAll(regexMult)];

  const regexDos = /do\(\)/g;
  const dos = [...rawInput.matchAll(regexDos)];

  const regexDonts = /don't\(\)/g;
  const donts = [...rawInput.matchAll(regexDonts)];

  const merged = matches.concat(dos).concat(donts);
  merged.sort((a, b) => a.index - b.index)

  // We now have our do()'s, don't()'s and mul()'s in the correct order.
  // Notice that the do's and don't are not nested, so its just a linear loop over all the matches
  // keeping track of whether we are in a do or don't block.

  let isDo = true;
  let score = 0;
  for (let i = 0; i < merged.length; i++) {
    const token = merged[i];
    if (token[0] === "do()") {
      isDo = true;
      continue;
    }

    if (token[0] === "don't()") {
      isDo = false;
      continue;
    }

    if (isDo) {
      const [, a, b] = token;
      score += Number(a) * Number(b);
    }
  }
  return score;
};

run({
  part1: {
    tests: [
      {
        input: `
        xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
        `,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 48,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
