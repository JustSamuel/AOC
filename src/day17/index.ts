import run from "aocrunner";

const parseInput = (
  rawInput: string,
): { registers: bigint[]; opcodes: bigint[] } => {
  const registers = rawInput
    .split("\n\n")[0]
    .split("\n")
    .map((r) => r.split(":")[1])
    .map((r) => BigInt(r));
  const opcodes = rawInput
    .split("\n\n")[1]
    .split("Program: ")[1]
    .split("\n")[0]
    .split(",")
    .map((o) => BigInt(o));
  return {
    registers: registers,
    opcodes: opcodes,
  };
};

function comboOperand(operand: bigint, registers: bigint[]): bigint {
  switch (operand) {
    case 0n:
      return operand;
    case 1n:
      return operand;
    case 2n:
      return operand;
    case 3n:
      return operand;
    case 4n:
      return registers[0];
    case 5n:
      return registers[1];
    case 6n:
      return registers[2];
    case 7n:
      throw new Error("Invalid opcode");
  }
  throw new Error("Invalid opcode");
}

const execute = (registers: bigint[], opcodes: bigint[]) => {
  const result = [];
  let ip = 0;

  while (ip < opcodes.length) {
    const opcode = opcodes[ip];
    const operand = BigInt(opcodes[ip + 1]); // Convert operand to BigInt

    switch (opcode) {
      case 0n: {
        const numerator = registers[0];
        const denominator =
          BigInt(2) ** BigInt(comboOperand(operand, registers));
        registers[0] = numerator / denominator;
        ip += 2;
        break;
      }
      case 1n: {
        registers[1] = registers[1] ^ BigInt(operand);
        ip += 2;
        break;
      }
      case 2n: {
        registers[1] = BigInt(comboOperand(operand, registers)) % 8n;
        ip += 2;
        break;
      }
      case 3n: {
        if (registers[0] === BigInt(0)) {
          ip += 2;
        } else {
          ip = Number(operand);
        }
        break;
      }
      case 4n: {
        registers[1] = registers[1] ^ registers[2];
        ip += 2;
        break;
      }
      case 5n: {
        result.push(BigInt(comboOperand(operand, registers)) % BigInt(8));
        ip += 2;
        break;
      }
      case 6n: {
        const numerator = registers[0];
        const denominator =
          BigInt(2) ** BigInt(comboOperand(operand, registers));
        registers[1] = numerator / denominator;
        ip += 2;
        break;
      }
      case 7n: {
        const numerator = registers[0];
        const denominator =
          BigInt(2) ** BigInt(comboOperand(operand, registers));
        registers[2] = numerator / denominator;
        ip += 2;
        break;
      }
      default: {
        throw new Error(`Unknown opcode: ${opcode}`);
      }
    }
  }
  return result;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const res = execute(input.registers, input.opcodes);
  console.info(input.registers);
  console.log(res);
  return res.join(",");
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const valids: Record<string, boolean> = {};

  let min = 8n ** 17n; // Large enough number such that the output lengths match

  // Use DFS to match the output, starting from the last opcode
  const check = (depth: number, score: bigint) => {
    if (depth == 16) {
      valids[String(score)] = true;
      if (score < min) min = score;
      return;
    }
    let target = [...input.opcodes];
    for (let i = 0; i < 8; i++) {
      if (
        execute([BigInt(i) + 8n * score, 0n, 0n], input.opcodes)[0] ==
        target[15 - depth]
      ) {
        check(depth + 1, BigInt(i) + 8n * score);
      }
    }
  };

  check(0, 0n);
  return min;
};

run({
  part1: {
    tests: [
      {
        input: `
Register A: 0
Register B: 0
Register C: 9

Program: 2,6`,
        expected: "",
      },
      {
        input: `
Register A: 10
Register B: 0
Register C: 9

Program: 5,0,5,1,5,4`,
        expected: "0,1,2",
      },
      {
        input: `
Register A: 0
Register B: 29
Register C: 0

Program: 1,7`,
        expected: "",
      },
      {
        input: `
Register A: 0
Register B: 2024
Register C: 43690

Program: 4,0`,
        expected: "",
      },
      {
        input: `
Register A: 2024
Register B: 0
Register C: 9

Program: 0,1,5,4,3,0`,
        expected: "4,2,5,6,7,7,7,7,3,1,0",
      },
      {
        input: `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
        `,
        expected: "4,6,3,5,6,3,5,2,1,0",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
