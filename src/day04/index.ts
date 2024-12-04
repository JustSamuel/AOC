import run from "aocrunner";

interface Board {
  horizontal: string[];
  vertical: string[];
  diagonal: string[];
}

const parseInput = (rawInput: string) => {
  const rows = rawInput.split("\n");

  const board: Board = {
    horizontal: [],
    vertical: [],
    diagonal: [],
  };

  for (let i = 0; i < rows.length; i++) {
    board.vertical.push("");
  }

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    board.horizontal.push(row);
    for (let c = 0; c < row.length; c++) {
      const char = row[c];
      board.vertical[c] += char;
    }
  }

  const gridSize = rows.length;
  // Collect all diagonals
  const diagonals: string[] = [];

  for (let startRow = 0; startRow < gridSize; startRow++) {
    let diagonal = "";
    for (
      let offset = 0;
      startRow + offset < gridSize && offset < rows[startRow + offset].length;
      offset++
    ) {
      diagonal += rows[startRow + offset][offset];
    }
    diagonals.push(diagonal);
  }
  for (let startCol = 1; startCol < rows[0].length; startCol++) {
    let diagonal = "";
    for (
      let offset = 0;
      offset + startCol < rows[0].length && offset < gridSize;
      offset++
    ) {
      diagonal += rows[offset][startCol + offset];
    }
    diagonals.push(diagonal);
  }

  for (let startRow = 0; startRow < gridSize; startRow++) {
    let diagonal = "";
    for (
      let offset = 0;
      startRow + offset < gridSize && offset < rows[startRow + offset].length;
      offset++
    ) {
      diagonal +=
        rows[startRow + offset][rows[startRow + offset].length - 1 - offset];
    }
    diagonals.push(diagonal);
  }
  for (let startCol = rows[0].length - 2; startCol >= 0; startCol--) {
    let diagonal = "";
    for (
      let offset = 0;
      startCol - offset >= 0 && offset < gridSize;
      offset++
    ) {
      diagonal += rows[offset][startCol - offset];
    }
    diagonals.push(diagonal);
  }

  board.diagonal = diagonals;

  return board;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let score = 0;
  const regex = /XMAS/g;
  const reverseRegex = /SAMX/gi;

  const strings = input.horizontal.concat(input.vertical).concat(input.diagonal);
  strings.forEach((row) => {
    const matches = row.match(regex);
    const count = matches ? matches.length : 0;
    score += count;

    const reverseMatches = row.match(reverseRegex);
    const reverseCount = reverseMatches ? reverseMatches.length : 0;
    score += reverseCount;
  })

  return score;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let score = 0;
  const rows = rawInput.split("\n");
  const gridSize = rows.length;

  const hits = new Set<string>();

  for (let startRow = 0; startRow < gridSize; startRow++) {
    let diagonal = "";
    const coords = [];

    for (
      let offset = 0;
      startRow + offset < gridSize && offset < rows[startRow + offset].length;
      offset++
    ) {
      diagonal += rows[startRow + offset][offset];
      coords.push({ x: startRow + offset, y: offset });
    }

    for (let i = 0; i <= diagonal.length - 3; i++) {
      if (
        diagonal[i] === "M" &&
        diagonal[i + 1] === "A" &&
        diagonal[i + 2] === "S"
      ) {
        const center = coords[i + 1];
        hits.add(`${center.x}-${center.y}`);
      }
      if (
        diagonal[i] === "S" &&
        diagonal[i + 1] === "A" &&
        diagonal[i + 2] === "M"
      ) {
        const center = coords[i + 1];
        hits.add(`${center.x}-${center.y}`);
      }
    }
  }

  for (let startCol = 1; startCol < rows[0].length; startCol++) {
    let diagonal = "";
    const coords = [];

    for (
      let offset = 0;
      offset + startCol < rows[0].length && offset < gridSize;
      offset++
    ) {
      diagonal += rows[offset][startCol + offset];
      coords.push({ x: offset, y: startCol + offset });
    }

    for (let i = 0; i <= diagonal.length - 3; i++) {
      if (
        diagonal[i] === "M" &&
        diagonal[i + 1] === "A" &&
        diagonal[i + 2] === "S"
      ) {
        const center = coords[i + 1];
        hits.add(`${center.x}-${center.y}`);
      }
      if (
        diagonal[i] === "S" &&
        diagonal[i + 1] === "A" &&
        diagonal[i + 2] === "M"
      ) {
        const center = coords[i + 1];
        hits.add(`${center.x}-${center.y}`);
      }
    }
  }

  for (let startRow = 0; startRow < gridSize; startRow++) {
    let diagonal = "";
    const coords = [];
    for (
      let offset = 0;
      startRow + offset < gridSize && offset < rows[startRow + offset].length;
      offset++
    ) {
      diagonal +=
        rows[startRow + offset][rows[startRow + offset].length - 1 - offset];
      coords.push({
        x: startRow + offset,
        y: rows[startRow + offset].length - 1 - offset,
      });
    }
    for (let i = 0; i <= diagonal.length - 3; i++) {
      if (
        diagonal[i] === "M" &&
        diagonal[i + 1] === "A" &&
        diagonal[i + 2] === "S"
      ) {
        const center = coords[i + 1];
        if (hits.has(`${center.x}-${center.y}`)) {
          score++;
        }
        hits.add(`${center.x}-${center.y}`);
      }
      if (
        diagonal[i] === "S" &&
        diagonal[i + 1] === "A" &&
        diagonal[i + 2] === "M"
      ) {
        const center = coords[i + 1];
        if (hits.has(`${center.x}-${center.y}`)) {
          score++;
        }
        hits.add(`${center.x}-${center.y}`);
      }
    }
  }

  for (let startCol = rows[0].length - 2; startCol >= 0; startCol--) {
    let diagonal = "";
    const coords = [];
    for (
      let offset = 0;
      startCol - offset >= 0 && offset < gridSize;
      offset++
    ) {
      diagonal += rows[offset][startCol - offset];
      coords.push({ x: offset, y: startCol - offset });
    }

    for (let i = 0; i <= diagonal.length - 3; i++) {
      if (
        diagonal[i] === "M" &&
        diagonal[i + 1] === "A" &&
        diagonal[i + 2] === "S"
      ) {
        const center = coords[i + 1];
        if (hits.has(`${center.x}-${center.y}`)) {
          score++;
        }
        hits.add(`${center.x}-${center.y}`);
      }
      if (
        diagonal[i] === "S" &&
        diagonal[i + 1] === "A" &&
        diagonal[i + 2] === "M"
      ) {
        const center = coords[i + 1];
        if (hits.has(`${center.x}-${center.y}`)) {
          score++;
        }
        hits.add(`${center.x}-${center.y}`);
      }
    }

    // diagonals.push(diagonal);
  }

  return score;
};

run({
  part1: {
    tests: [
      {
        input: `
..X...
.SAMX.
.A..A.
XMAS.S
.X....`,
        expected: 4,
      },
      {
        input: `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
        `,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........
        `,
        expected: 9,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
