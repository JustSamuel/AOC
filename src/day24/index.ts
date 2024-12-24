import run from "aocrunner";
import {isNumber} from "node:util";
import chalk from 'chalk';

type Wires = Record<string, number>;
interface Gate {
  inputA: string;
  inputB: string;
  output: string;
  operation: "AND" | "OR" | "XOR";
}

const parseInput = (rawInput: string): [Wires, Gate[]] => {
  const [valuesStr, gatesStr] = rawInput.trim().split("\n\n");

  const initialValues: Wires = {};
  valuesStr.split("\n").forEach(line => {
    const [wire, value] = line.split(": ");
    initialValues[wire] = parseInt(value);
  });

  const gates: Gate[] = gatesStr.split("\n").map(line => {
    const [inpStr, output] = line.split(" -> ");
    const [inputA, operation, inputB] = inpStr.split(" ") as [
      string,
          "AND" | "OR" | "XOR",
      string,
    ];
    return {
      inputA,
      inputB,
      output,
      operation,
    };
  });

  return [initialValues, gates];
};

const simulate = (initialWires: Wires, gates: Gate[]): Wires => {
  const wires = { ...initialWires };

  const evaluate = (a: string, b: string, operation: string): number => {
    const valA = wires[a];
    const valB = wires[b];
    switch (operation) {
      case "AND":
        return valA & valB;
      case "OR":
        return valA | valB;
      case "XOR":
        return valA ^ valB;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  };

  // just keep trying
  while (gates.length > 0) {
    for (let i = gates.length - 1; i >= 0; i--) {
      const { inputA, inputB, output, operation } = gates[i];
      if (wires[inputA] !== undefined && wires[inputB] !== undefined) {
        wires[output] = evaluate(inputA, inputB, operation);
        gates.splice(i, 1);
      }
    }
  }

  return wires;
};

const getBinaryValue = (wires: Wires): string => {
  const zWires = Object.keys(wires)
      .filter(wire => wire.startsWith("z"))
      .sort((a, b) => parseInt(b.slice(1)) - parseInt(a.slice(1)));

  return zWires.map(wire => wires[wire]).join("");
};

const part1 = (rawInput: string): number => {
  const [initialWires, gates] = parseInput(rawInput);
  const finalWires = simulate(initialWires, gates);
  const binaryValue = getBinaryValue(finalWires);
  console.info(binaryValue);
  return parseInt(binaryValue, 2);
};



const part2 = (rawInput: string): string => {
  const [initialWires, gates] = parseInput(rawInput);

  // Simulate the addition system
  const finalWires = simulate(initialWires, gates);

  // Find the x, y, and z wires (assuming wires starting with 'x', 'y', and 'z' are of interest)
  const xWires = Object.keys(initialWires).filter(wire => wire.startsWith("x")).sort();
  const yWires = Object.keys(initialWires).filter(wire => wire.startsWith("y")).sort();
  const zWires = Object.keys(finalWires).filter(wire => wire.startsWith("z")).sort();

  let xBits = "";
  let yBits = "";
  let zBits = "";

  // To handle carryover from previous bit additions
  let carry = 0;

  let mismatchIndex: number[] = [];

  // Compare bit by bit for all the wires
  for (let i = 0; i < xWires.length; i++) {
    const xBit = initialWires[xWires[i]]; // x bit (from input)
    const yBit = initialWires[yWires[i]]; // y bit (from input)
    const zBit = finalWires[zWires[i]]; // z bit (from output)

    // Add the carry from the previous bit operation
    const sum = (xBit + yBit + carry) % 2; // Add carry to the sum of x and y
    carry = Math.floor((xBit + yBit + carry) / 2); // Set the carry for the next bit

    // Form the bit strings
    xBits += xBit;
    yBits += yBit;
    zBits += zBit;

    // Check if the sum matches the value on the corresponding z wire
    if (zBit !== sum) {
      mismatchIndex.push(i);
    }
  }

  // Highlight the mismatched bits in red using chalk
  let highlightedX = "";
  let highlightedY = "";
  let highlightedZ = "";

  for (let i = 0; i < xBits.length; i++) {
    if (mismatchIndex.includes(i)) {
      highlightedX += chalk.red(xBits[i]);
      highlightedY += chalk.red(yBits[i]);
      highlightedZ += chalk.red(zBits[i]);
    } else {
      highlightedX += xBits[i];
      highlightedY += yBits[i];
      highlightedZ += zBits[i];
    }
  }

  // Output the results with highlighted mismatches
  console.log(`x: ${highlightedX}`);
  console.log(`y: ${highlightedY}`);
  console.log(`z: ${highlightedZ}`);

  // Graphviz generation
  const generateGraphviz = (rawInput: string): string => {
    const [initialWires, gates] = parseInput(rawInput);

    // Start of the Graphviz string
    let graphviz = 'digraph gates {\n';

    // Define wire nodes
    Object.keys(initialWires).forEach(wire => {
      const value = initialWires[wire];
      graphviz += `  ${wire} [label="${wire}: ${value}" shape=circle];\n`;
    });

    // Define gates and edges for each gate
    gates.forEach(gate => {
      const { inputA, inputB, output, operation } = gate;

      // Add edges for each gate operation
      graphviz += `  ${inputA} -> ${output} [label="${operation}" style=dashed];\n`;
      graphviz += `  ${inputB} -> ${output} [label="${operation}" style=dashed];\n`;
    });

    // Add carryover node for each wire
    graphviz += `  carry [label="Carry" shape=ellipse style=dotted];\n`;
    graphviz += '}\n';

    return graphviz;
  };

  // Return the Graphviz code for the gates system (useful for visualization)
  // console.log(generateGraphviz(rawInput));

  return '';
};

run({
  part1: {
    tests: [
      {
        input: `
x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02        
        `,
        expected: 4,
      },
      {
        input: `
        x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`,
        expected: 2024,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z05
x01 AND y01 -> z02
x02 AND y02 -> z01
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z00
`,
        expected: "z00,z01,z02,z05",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
