import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  return lines.map((l) => l.split(""));
};

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const isPerim = (x: number, y: number, grid: string[][], symbol: string): boolean => {
  if (x < 0 || x > grid.length - 1 || y < 0 || y > grid[0].length - 1) return true
  return grid[x][y] !== symbol;
}

function solve(rawInput: string, part1 = false): number {
  const grid = parseInput(rawInput);
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  const isValid = (x: number, y: number, symbol: string): boolean => {
    return (
        x >= 0 &&
        y >= 0 &&
        x < rows &&
        y < cols &&
        !visited[x][y] &&
        grid[x][y] === symbol
    );
  };

  const dfs = (x: number, y: number, symbol: string, component: [number, number][]) => {
    const stack = [[x, y]];
    visited[x][y] = true;
    component.push([x, y]);

    while (stack.length > 0) {
      const [currX, currY] = stack.pop()!;

      for (const [dx, dy] of dirs) {
        const newX = currX + dx;
        const newY = currY + dy;

        if (isValid(newX, newY, symbol)) {
          visited[newX][newY] = true;
          stack.push([newX, newY]);
          component.push([newX, newY]);
        }
      }
    }
  };

  function getKey(c: [number, number]) {
    return `${c[0]},${c[1]}`;
  }

  let s = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!visited[i][j]) {
        const component: [number, number][] = [];
        dfs(i, j, grid[i][j], component);
        const perims = new Set<[number, number]>();

        const componentKeys = new Set<string>();
        component.forEach((c) => componentKeys.add(getKey(c)));


        for (const [x, y] of component) {
          for (const [dx, dy] of dirs) {
            if(isPerim(x + dx, y + dy, grid, grid[i][j])) {
              perims.add([x, y]);
            }
          }
        }

        if (part1) {
          s += perims.size * component.length;
        } else {
          const xwall: Record<string, number[]> = {};
          const ywall: Record<string, number[]> = {};

          for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
              if (!componentKeys.has(getKey([x, y]))) continue;
              if (!componentKeys.has(getKey([x-1, y]))) {
                if (!xwall[`${x-1},left`]) xwall[`${x-1},left`] = [];
                xwall[`${x-1},left`].push(y);
              }
              if(!componentKeys.has(getKey([x+1, y]))) {
                if (!xwall[`${x-1},right`]) xwall[`${x-1},right`] = [];
                xwall[`${x-1},right`].push(y);
              }
              if(!componentKeys.has(getKey([x, y-1]))) {
                if (!ywall[`${y-1},bottom`]) ywall[`${y-1},bottom`] = [];
                ywall[`${y-1},bottom`].push(x);
              }
              if(!componentKeys.has(getKey([x, y+1]))) {
                if (!ywall[`${y-1},top`]) ywall[`${y-1},top`] = [];
                ywall[`${y-1},top`].push(x);
              }
            }
          }

          function countSides(arr: number[]) {
            arr.sort((a, b) => a - b);
            let count = 0;
            for (let i = 0; i < arr.length; i++) {
              if (arr[i] - arr[i - 1] !== 1) {
                count++;
              }
            }
            return count;
          }

          let sides = 0;
          for (let key in xwall) {
            sides += countSides(xwall[key]);
          }
          for (let key in ywall) {
            sides += countSides(ywall[key]);
          }
          s += sides * component.length;
        }
      }
    }
  }

  return s;
}

run({
  part1: {
    tests: [
      {
        input: `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
        expected: 772,
      },
      {
        input: `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1930,
      },
    ],
    solution: (rawInput) => solve(rawInput, true),
  },
  part2: {
    tests: [
      {
        input: `
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
        expected: 236,
      },
    ],
    solution: (rawInput) => solve(rawInput, false),
  },
  trimTestInputs: true,
  onlyTests: true,
});
