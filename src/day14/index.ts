import run from "aocrunner";

interface Robot {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

const parseInput = (rawInput: string): Robot[] => {
  return rawInput.split("\n").map((raw) => {
    const line = raw.split(" ");
    const p = line[0].split("=")[1].split(",");
    const v = line[1].split("=")[1].split(",");
    return {
      position: { x: parseInt(p[0]), y: parseInt(p[1]) },
      velocity: { x: parseInt(v[0]), y: parseInt(v[1]) },
    };
  });
};

const WIDTH = 101;
const HEIGHT = 103;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let i = 0; i < 100; i++) {
    input.forEach((robot) => {
      robot.position.x = (robot.position.x + robot.velocity.x + WIDTH) % WIDTH;
      robot.position.y =
        (robot.position.y + robot.velocity.y + HEIGHT) % HEIGHT;
    });
  }

  const quadrants = [0, 0, 0, 0];

  input.forEach((robot) => {
    if (robot.position.x === 50 || robot.position.y === 51) return;

    const left = robot.position.x < 50;
    const top = robot.position.y < 51;

    if (top && left) quadrants[0]++;
    else if (top && !left) quadrants[1]++;
    else if (!top && left) quadrants[2]++;
    else if (!top && !left) quadrants[3]++;
  });

  return quadrants.reduce((product, count) => product * count, 1);
};

const part2 = (rawInput: string) => {
  const robots = parseInput(rawInput);
  let s = 0;

  const unique = () => {
    const seen = new Set();
    for (const robot of robots) {
      const positionKey = `${robot.position.x},${robot.position.y}`;
      if (seen.has(positionKey)) {
        return false;
      }
      seen.add(positionKey);
    }
    return true;
  };

  while (true) {
    robots.forEach((robot) => {
      robot.position.x = (robot.position.x + robot.velocity.x + WIDTH) % WIDTH;
      robot.position.y =
        (robot.position.y + robot.velocity.y + HEIGHT) % HEIGHT;
    });

    s++;

    if (unique()) {
      print(robots);
      return s;
    }
  }
};

const print = (input: Robot[]) => {
  const grid: string[][] = Array.from({ length: HEIGHT }, () =>
    Array(WIDTH).fill("."),
  );
  input.forEach((r) => {
    grid[r.position.y][r.position.x] = "#";
  });

  console.log(grid.map((row) => row.join("")).join("\n"));
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
