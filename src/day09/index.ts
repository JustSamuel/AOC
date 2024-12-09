import run from "aocrunner";

interface Block {
  index: number;
  size: number;
  num: number | null;
}

const parseInput = (
  rawInput: string,
  part1 = true,
): { empty: Block[]; pages: Block[] } => {
  const empty = [];
  const pages = [];
  let index = 0;
  let c = 0;

  for (let i = 0; i < rawInput.length; i++) {
    const n = parseInt(rawInput[i]);
    const num = i % 2 === 1 ? null : c;

    const r = part1 ? 1 : n;
    for (let j = 0; j < n; j += r) {
      const b: Block = {
        index,
        size: r,
        num,
      };
      index += r;
      if (num !== null) pages.push(b);
      else empty.push(b);
    }
    if (num !== null) c++;
  }

  return { empty, pages };
};

function fits(source: Block, target: Block): boolean {
  return target.size >= source.size;
}

function value(block: Block): number {
  if (block.num == null) return 0;

  let s = 0;
  for (let i = 0; i < block.size; i++) {
    s += block.num * (i + block.index);
  }
  return s;
}

function solve(rawInput: string, part1 = true) {
  const input = parseInput(rawInput, part1);

  for (let i = input.pages.length - 1; i >= 0; i--) {
    const page = input.pages[i];
    for (let j = 0; j < input.empty.length; j++) {
      const empty = input.empty[j];
      if (page.index < empty.index) continue;

      if (fits(page, empty)) {
        const newBlock: Block = {
          index: page.index,
          size: page.size,
          num: null,
        };
        page.index = empty.index;
        empty.size -= page.size;
        empty.index += page.size;
        if (empty.size == 0) input.empty.splice(j, 1);
        input.empty.push(newBlock);
        break;
      }
    }
  }

  return input.pages.reduce((a, x) => a + value(x), 0);
}

run({
  part1: {
    tests: [
      {
        input: `
2333133121414131402
`,
        expected: 1928,
      },
    ],
    solution: (rawInput: string) => solve(rawInput, true),
  },
  part2: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 2858,
      },
    ],
    solution: (rawInput: string) => solve(rawInput, false),
  },
  trimTestInputs: true,
  onlyTests: false,
});
