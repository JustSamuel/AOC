import run from "aocrunner";

interface Coord {
  x: number;
  y: number;
}

enum Side {
  Left,
  Right,
}

interface Box {
  x: number;
  y: number;
  side?: Side;
}

function getKey(c: Coord) {
  return `${c.x},${c.y}`;
}

const parseInput = (
  rawInput: string,
): {
  steps: string[];
  grid: string[][];
  robot: Coord;
  boxes: Map<string, Box>;
} => {
  const steps = rawInput.split("\n\n")[1].split("");
  const grid = rawInput
    .split("\n\n")[0]
    .split("\n")
    .map((l) => l.split(""));

  const boxes = new Map<string, Box>();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "O") {
        boxes.set(getKey({ x, y }), {
          y: y,
          x: x,
        });
        grid[y][x] = ".";
      }
      if (grid[y][x] === "[") {
        boxes.set(getKey({ x, y }), {
          y: y,
          x: x,
          side: Side.Left,
        });
        grid[y][x] = ".";
      } else if (grid[y][x] === "]") {
        boxes.set(getKey({ x, y }), {
          y: y,
          x: x,
          side: Side.Right,
        });
        grid[y][x] = ".";
      }
    }
  }

  const robot = {
    x: 0,
    y: 0,
  };

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "@") {
        robot.x = x;
        robot.y = y;
        grid[y][x] = ".";
      }
    }
  }

  return {
    steps,
    grid,
    boxes,
    robot,
  };
};

function print(grid: string[][], boxes: Map<string, Box>, robot: Coord) {
  const gridClone = grid.map((row) => [...row]);
  for (const box of boxes.values()) {
    if (box.side === Side.Left) {
      gridClone[box.y][box.x] = "[";
    } else if (box.side === Side.Right) {
      gridClone[box.y][box.x] = "]";
    } else {
      gridClone[box.y][box.x] = "O";
    }
  }
  gridClone[robot.y][robot.x] = "@";
  gridClone.forEach((row) => {
    console.log(row.join(""));
  });
}

function findPushableBoxes(
  grid: string[][],
  boxes: Map<string, Box>,
  current: Coord,
  step: string,
  chain: Set<string>,
): Set<string> {
  let isBox = boxes.has(getKey(current));
  if (isBox) {
    chain.add(getKey(current));
  }

  switch (step) {
    case "^":
      current.y--;
      break;
    case "v":
      current.y++;
      break;
    case "<":
      current.x--;
      break;
    case ">":
      current.x++;
      break;
  }

  isBox = boxes.has(getKey(current));
  if (isBox) {
    const b = boxes.get(getKey(current))!;
    chain.add(getKey(b));

    if (step === "^" || step === "v") {
      const other = { x: current.x, y: current.y };
      if (b.side === Side.Left) {
        other.x++;
      } else if (b.side === Side.Right) {
        other.x--;
      }
      findPushableBoxes(grid, boxes, other, step, chain);
    }
    findPushableBoxes(grid, boxes, current, step, chain);
  } else {
    const cell = grid[current.y][current.x];
    if (cell === "#") {
      throw new Error("Box is blocked");
    } else if (cell === ".") {
      return chain;
    }
  }
  return chain;
}

function move(
  grid: string[][],
  robot: Coord,
  boxes: Map<string, Coord>,
  step: string,
) {
  const target = { x: -1, y: -1 };
  switch (step) {
    case "^":
      target.y = robot.y - 1;
      target.x = robot.x;
      break;
    case "v":
      target.y = robot.y + 1;
      target.x = robot.x;
      break;
    case "<":
      target.y = robot.y;
      target.x = robot.x - 1;
      break;
    case ">":
      target.y = robot.y;
      target.x = robot.x + 1;
      break;
  }

  if (
    target.x < 0 ||
    target.y < 0 ||
    target.x >= grid[0].length ||
    target.y >= grid.length
  )
    return;
  let targetCell = grid[target.y][target.x];
  if (targetCell === "#") return;

  if (boxes.has(getKey(target))) {
    try {
      const keys = findPushableBoxes(
        grid,
        boxes,
        { x: robot.x, y: robot.y },
        step,
        new Set(),
      );
      const bxs = Array.from(keys).map((k) => boxes.get(k)!);

      if (bxs.length === 0) return;
      robot.x = target.x;
      robot.y = target.y;

      bxs.forEach((box) => {
        grid[box.y][box.x] = ".";
        boxes.delete(getKey(box));
        switch (step) {
          case "^":
            box.y--;
            break;
          case "v":
            box.y++;
            break;
          case "<":
            box.x--;
            break;
          case ">":
            box.x++;
            break;
        }
      });
      bxs.forEach((box) => {
        boxes.set(getKey(box), box);
      });
      return;
    } catch (e) {
      // Using errors as part of the execution flow? Sure its bad practice, but its advent of code not a job.
      return;
    }
  }

  if (targetCell === ".") {
    robot.x = target.x;
    robot.y = target.y;
    return;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // console.info(input);
  input.steps.forEach((step) => {
    // console.info('robot at', input.robot, step);
    move(input.grid, input.robot, input.boxes, step);
  });
  print(input.grid, input.boxes, input.robot);
  let s = 0;

  input.boxes.forEach((box) => {
    s += 100 * box.y + box.x;
  });

  return s;
};

const part22 = (rawInput: string): number => {
  let [xmap, _] = rawInput.split("\n\n");
  // @ts-ignore
  xmap = xmap
    .replaceAll(".", "..")
    .replaceAll("@", "@.")
    .replaceAll("#", "##")
    .replaceAll("O", "[]");
  const input = parseInput([xmap, _].join("\n\n"));
  print(input.grid, input.boxes, input.robot);

  input.steps.forEach((step) => {
    // console.info('robot at', input.robot, step);
    move(input.grid, input.robot, input.boxes, step);
  });
  print(input.grid, input.boxes, input.robot);
  let s = 0;

  input.boxes.forEach((box) => {
    if (box.side === Side.Left) {
      s += 100 * box.y + box.x;
    }
  });

  return s;
};

run({
  part1: {
    tests: [
      {
        input: `
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
        `,
        expected: 2028,
      },
      //       { input: `
      // ##########
      // #..O..O.O#
      // #......O.#
      // #.OO..O.O#
      // #..O@..O.#
      // #O#..O...#
      // #O..O..O.#
      // #.OO.O.OO#
      // #....O...#
      // ##########
      //
      // <vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
      // vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
      // ><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
      // <<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
      // ^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
      // ^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
      // >^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
      // <><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
      // ^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
      // v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
      //       `,
      //         expected: 10092,
      //       }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      //       {
      //         input: `
      // #######
      // #...#.#
      // #.....#
      // #..OO@#
      // #..O..#
      // #.....#
      // #######
      //
      // <vv<<^^<<^^`,
      //         expected: 9021,
      //       },
      {
        input: `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
      `,
        expected: 9021,
      },
      {
        input: `
        #######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`,
        expected: 105 + 207 + 306,
      },
    ],
    solution: part22,
  },
  trimTestInputs: true,
  onlyTests: true,
});
