import run from "aocrunner";

const parseInput = (rawInput: string): bigint[] => {
  return rawInput.split("\n").map(l => BigInt(parseInt(l)));
};

const mix = (secret: bigint, value: bigint): bigint => secret ^ value;

const prune = (secret: bigint): bigint => secret % 16777216n;

const calculate = (start: bigint): bigint => {
  let secret = start;
  secret = prune(mix(secret, secret * 64n));
  secret = prune(mix(secret, secret / 32n));
  secret = prune(mix(secret, secret * 2048n));
  return secret;
};

const part1 = (rawInput: string): string => {
  const input = parseInput(rawInput);
  let s = 0n;
  for (const number of input) {
    let n = number;
    for (let i = 0; i < 2000; i++) {
      n = calculate(n);
    }
    s += n;
  }
  return s.toString();
};

const precompute = (secrets: bigint[], count: number): number[][] => {
  return secrets.map(secret => {
    const prices = [Number(secret % 10n)];
    for (let i = 0; i < count; i++) {
      secret = calculate(secret);
      prices.push(Number(secret % 10n));
    }
    return prices;
  });
};

const options = (priceArrays: number[][]): Set<string> => {
  const possibleSequences = new Set<string>();

  priceArrays.forEach(prices => {
    let prevPrice = prices[0];
    const changeBuffer: number[] = [];

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prevPrice;
      changeBuffer.push(change);

      if (changeBuffer.length > 4) changeBuffer.shift();

      if (changeBuffer.length === 4) {
        possibleSequences.add(changeBuffer.join(","));
      }

      prevPrice = prices[i];
    }
  });

  return possibleSequences;
};

const findSequence = (priceArrays: number[][], possibleSequences: Set<string>): { sequence: number[], bananas: number } => {
  let maxBananas = 0;
  let bestSequence: number[] = [];
  let i = 0;
  possibleSequences.forEach((sequenceString) => {
    i++;
    if (i % 100 === 0) console.info(`Processing sequence ${i}/${possibleSequences.size}`);
    const seq = sequenceString.split(",").map(Number);
    let totalBananas = 0;

    priceArrays.forEach(prices => {
      let prevPrice = prices[0];
      const changeBuffer: number[] = [];

      for (let i = 1; i < prices.length; i++) {
        const change = prices[i] - prevPrice;
        changeBuffer.push(change);
        if (changeBuffer.length > seq.length) changeBuffer.shift();

        if (changeBuffer.length === seq.length && changeBuffer.every((val, idx) => val === seq[idx])) {
          totalBananas += prices[i];
          break;
        }

        prevPrice = prices[i];
      }
    });

    if (totalBananas > maxBananas) {
      console.info(`Found new best sequence: ${sequenceString}, ${totalBananas}`);
      maxBananas = totalBananas;
      bestSequence = seq;
    }
  });

  return { sequence: bestSequence, bananas: maxBananas };
};

const part2 = (rawInput: string) => {
  const secrets = parseInput(rawInput);
  const priceArrays = precompute(secrets, 2000);
  const possibleSequences = options(priceArrays);
  return findSequence(priceArrays, possibleSequences).bananas;
};

run({
  part1: {
    tests: [
      {
        input: `
1
10
100
2024
        `,
        expected: (8685429 + 4700978 + 15273692 +8667524).toString(),
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
//       {
//         input: `
// 1
// 2
// 3
// 2024
//         `,
//         expected: 23,
//       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
