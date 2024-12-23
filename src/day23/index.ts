import run from "aocrunner";

const parseInput = (rawInput: string): Map<string, Set<string>> => {
  const connections = rawInput.trim().split("\n");
  const graph = new Map<string, Set<string>>();

  connections.forEach((connection) => {
    const [a, b] = connection.split("-");
    if (!graph.has(a)) graph.set(a, new Set());
    if (!graph.has(b)) graph.set(b, new Set());
    graph.get(a)!.add(b);
    graph.get(b)!.add(a);
  });

  return graph;
};

const trios = (graph: Map<string, Set<string>>): string[][] => {
  const trios: string[][] = [];

  for (const [node, neighbors] of graph) {
    const neighborArray = Array.from(neighbors);

    for (let i = 0; i < neighborArray.length; i++) {
      for (let j = i + 1; j < neighborArray.length; j++) {
        const [n1, n2] = [neighborArray[i], neighborArray[j]];
        if (graph.get(n1)?.has(n2)) {
          const trio = [node, n1, n2].sort();
          trios.push(trio);
        }
      }
    }
  }

  return Array.from(new Set(trios.map((trio) => trio.join(",")))).map((trio) =>
    trio.split(","),
  );
};

const bronKerbosch = (
  clique: Set<string>,
  options: Set<string>,
  excluded: Set<string>,
  graph: Map<string, Set<string>>,
  maxClique: Set<string>,
) => {
  if (options.size === 0 && excluded.size === 0) {
    if (clique.size > maxClique.size) {
      maxClique.clear();
      clique.forEach((node) => maxClique.add(node));
    }
    return;
  }

  const arr = Array.from(options);
  for (const vertex of arr) {
    clique.add(vertex);
    const neighbors = graph.get(vertex) || new Set();
    bronKerbosch(
      clique,
      new Set([...options].filter((v) => neighbors.has(v))),
      new Set([...excluded].filter((v) => neighbors.has(v))),
      graph,
      maxClique,
    );
    clique.delete(vertex);
    options.delete(vertex);
    excluded.add(vertex);
  }
};

const maxClique = (graph: Map<string, Set<string>>): string[] => {
  const maxClique = new Set<string>();
  bronKerbosch(new Set(), new Set(graph.keys()), new Set(), graph, maxClique);
  return Array.from(maxClique);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return trios(input).filter((trio) =>
    trio.some((node) => node.startsWith("t")),
  ).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return maxClique(input).sort().join(",");
};

run({
  part1: {
    tests: [
      {
        input: `
 kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
 `,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn        
        `,
        expected: "co,de,ka,ta",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
