import run from "aocrunner";

interface Game {
  buttonA: {
    x: number;
    y: number;
  };
  buttonB: {
    x: number;
    y: number;
  };
  prize: {
    x: number;
    y: number;
  };
}

const parseInput = (rawInput: string) => {
  const ga = rawInput.split("\n\n");
  const games: Game[] = [];
  ga.forEach((g) => {
    const [buttonA, buttonB, prize] = g.split("\n");
    const buttonA_ = buttonA.split(":")[1].split(",");
    const buttonB_ = buttonB.split(":")[1].split(",");
    const prize_ = prize.split(":")[1].split(",");
    games.push({
      buttonA: {
        x: Number(buttonA_[0].split("+")[1]),
        y: Number(buttonA_[1].split("+")[1]),
      },
      buttonB: {
        x: Number(buttonB_[0].split("+")[1]),
        y: Number(buttonB_[1].split("+")[1]),
      },
      prize: {
        x: Number(prize_[0].split("=")[1]),
        y: Number(prize_[1].split("=")[1]),
      },
    });
  })
  return games;
};

function determinant(matrix: number[][]) {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

function inverse(matrix: number[][]) {
  return [
    [matrix[1][1], -matrix[0][1]],
    [-matrix[1][0], matrix[0][0]]
  ];
}

const solve = (rawInput: string, part1: boolean) => {
  const input = parseInput(rawInput);
  let s = 0;
  input.forEach((g) => {
    if (!part1) {
      g.prize.x += 10000000000000
      g.prize.y += 10000000000000
    }
    const matrix = [[g.buttonA.x, g.buttonB.x], [g.buttonA.y, g.buttonB.y]];
    const det = determinant(matrix);
    if (det === 0) {
      return;
    }
    const inv = inverse(matrix);
    let [x, y] = inv.map((r) => r[0] * g.prize.x + r[1] * g.prize.y);
    x = x / det;
    y = y / det;

    if (x >= 0 && y >= 0 && Number.isInteger(x) && Number.isInteger(y)) {
      s += x * 3 + y;
    }
  });
  return s;
}

run({
  part1: {
    tests: [
      {
        input: `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
        `,
        expected: 480,
      },
    ],
    solution: (rawInput) => solve(rawInput, true),
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: (rawInput) => solve(rawInput, false),
  },
  trimTestInputs: true,
  onlyTests: false,
});
