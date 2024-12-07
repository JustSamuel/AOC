import run from "aocrunner";

interface Rules {
  [key: number]: Set<number>;
}

const parseInput = (
  rawInput: string,
): { after: Rules; before: Rules; pages: number[][] } => {
  const rows = rawInput.split("\n");
  const rulesBefore: Rules = {};
  const rulesAfter: Rules = {};
  const pag: number[][] = [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].includes("|")) {
      let [astring, bstring] = rows[i].split("|");
      let a = Number(astring.trim());
      let b = Number(bstring.trim());
      rulesBefore[a] = rulesBefore[a] || new Set<number>();
      rulesBefore[a].add(b);

      rulesAfter[b] = rulesAfter[b] || new Set<number>();
      rulesAfter[b].add(a);
    }
    // console.info(rules);
    if (rows[i].includes(",")) {
      const r = rows[i].split(",");
      const pages = r.map((ra) => Number(ra.trim()));
      pag.push(pages);
    }
  }

  // console.info(rows);
  return { after: rulesAfter, before: rulesBefore, pages: pag };
};

function isValid(before: Rules, after: Rules, page: number[]) {
  for (let i = 0; i < page.length; i++) {
    for (let j = 0; j < page.length; j++) {
      if (i !== j) {
        if (before[page[i]] && j > i) {
          if (!before[page[i]].has(page[j])) {
            return false;
          }
        } else if (after[page[j]] && i > j) {
          if (after[page[j]].has(page[i])) {
            return false;
          }
        }
      }
    }
  }
  return true;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let score = 0;

  const invalids = [];

  input.pages.forEach((page) => {
    const valid = isValid(input.before, input.after, page);

    if (valid) {
      const middle = page[Math.floor(page.length / 2)];
      score += middle;
    } else {
      invalids.push(page);
    }
  });

  return score;
};

function sortPage(page: number[], before: Rules, after: Rules) {
  // console.info(page);
  const inDegree: Record<string, number> = {};
  const localBefore: Record<string, Set<number>> = {};

  page.forEach((p) => {
    if (!before[p]) {
    } else {
      page.forEach((pp) => {
        if (before[p].has(pp)) {
          if (!inDegree[pp]) {
            inDegree[pp] = 0;
          }
          inDegree[pp] += 1;
          localBefore[pp] = localBefore[pp] || new Set<string>();
          localBefore[pp].add(p);
        }
      });
    }
    if (!inDegree[p]) {
      inDegree[p] = 0;
    }
  });

  const queue: string[] = [];
  for (const vertex of Object.keys(inDegree)) {
    if (inDegree[vertex] === 0) {
      queue.push(vertex);
    }
  }

  const topo: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    topo.push(current);
    for (const neighbor of Object.keys(inDegree)) {
      if (localBefore[neighbor] && localBefore[neighbor].has(Number(current))) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }
  }

  return topo;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let score = 0;

  const invalids: number[][] = [];

  input.pages.forEach((page) => {
    const valid = isValid(input.before, input.after, page);
    if (!valid) {
      invalids.push(page);
    }
  });

  invalids.forEach((p) => {
    const sorted = sortPage(p, input.before, input.after);
    const middle = Number(sorted[Math.floor(sorted.length / 2)]);
    score += middle;
  });

  return score;
};

run({
  part1: {
    tests: [
      {
        input: `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
        `,
        expected: 143,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
        `,
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
