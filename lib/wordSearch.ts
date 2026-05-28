type Dir = readonly [number, number];

const DIRS: Dir[] = [
  [ 0,  1], // →
  [ 0, -1], // ←
  [ 1,  0], // ↓
  [-1,  0], // ↑
  [ 1,  1], // ↘
  [ 1, -1], // ↙
  [-1,  1], // ↗
  [-1, -1], // ↖
];

function canPlace(
  grid: (string | null)[][],
  word: string,
  r: number, c: number,
  dr: number, dc: number,
  rows: number, cols: number,
): boolean {
  const er = r + dr * (word.length - 1);
  const ec = c + dc * (word.length - 1);
  if (er < 0 || er >= rows || ec < 0 || ec >= cols) return false;
  for (let i = 0; i < word.length; i++) {
    const cell = grid[r + dr * i][c + dc * i];
    if (cell !== null && cell !== word[i]) return false;
  }
  return true;
}

function doPlace(
  grid: (string | null)[][],
  word: string,
  r: number, c: number,
  dr: number, dc: number,
) {
  for (let i = 0; i < word.length; i++) {
    grid[r + dr * i][c + dc * i] = word[i];
  }
}

function tryBuildGrid(
  words: string[],
  rows: number,
  cols: number,
): { grid: (string | null)[][], coords: Record<string, [number, number][]> } | null {
  const grid: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const coords: Record<string, [number, number][]> = {};
  const sorted = [...words].sort((a, b) => b.length - a.length);

  for (const word of sorted) {
    let placedAt: [number, number][] | null = null;

    for (let attempt = 0; attempt < 400 && !placedAt; attempt++) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (canPlace(grid, word, r, c, dr, dc, rows, cols)) {
        doPlace(grid, word, r, c, dr, dc);
        placedAt = Array.from({ length: word.length }, (_, i) => [r + dr * i, c + dc * i] as [number, number]);
      }
    }

    if (!placedAt) {
      outer: for (const [dr, dc] of DIRS) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (canPlace(grid, word, r, c, dr, dc, rows, cols)) {
              doPlace(grid, word, r, c, dr, dc);
              placedAt = Array.from({ length: word.length }, (_, i) => [r + dr * i, c + dc * i] as [number, number]);
              break outer;
            }
          }
        }
      }
    }

    if (!placedAt) return null; // word couldn't be placed — caller should retry
    coords[word] = placedAt;
  }

  return { grid, coords };
}

// Set of cells belonging to any placed word (must not be overwritten during fill or dedup)
function buildWordCellSet(coords: Record<string, [number, number][]>): Set<string> {
  const s = new Set<string>();
  for (const cells of Object.values(coords)) {
    for (const [r, c] of cells) s.add(`${r},${c}`);
  }
  return s;
}

// After filling nulls, check if any target word accidentally appears somewhere OTHER than its
// stored coords. If so, replace one non-word cell in that accidental run with a different letter.
function eliminateAccidentalWords(
  grid: string[][],
  words: string[],
  coords: Record<string, [number, number][]>,
  wordCells: Set<string>,
  fillAlpha: string,
  rows: number,
  cols: number,
) {
  for (const word of words) {
    const stored = coords[word];
    // Build a set-key for the stored occurrence so we can skip it
    const storedKey = stored.map(([r, c]) => `${r},${c}`).join('|');

    for (const [dr, dc] of DIRS) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const er = r + dr * (word.length - 1);
          const ec = c + dc * (word.length - 1);
          if (er < 0 || er >= rows || ec < 0 || ec >= cols) continue;

          // Check if word appears here
          let match = true;
          const runCells: [number, number][] = [];
          for (let i = 0; i < word.length; i++) {
            const rr = r + dr * i, cc = c + dc * i;
            if (grid[rr][cc] !== word[i]) { match = false; break; }
            runCells.push([rr, cc]);
          }
          if (!match) continue;

          // Is this the stored occurrence?
          const runKey = runCells.map(([rr, cc]) => `${rr},${cc}`).join('|');
          if (runKey === storedKey) continue;

          // Accidental occurrence — break it by replacing one non-word-cell letter
          for (const [rr, cc] of runCells) {
            if (!wordCells.has(`${rr},${cc}`)) {
              let replacement: string;
              do {
                replacement = fillAlpha[Math.floor(Math.random() * fillAlpha.length)];
              } while (replacement === grid[rr][cc]);
              grid[rr][cc] = replacement;
              break;
            }
          }
        }
      }
    }
  }
}

export function generateWordSearchWithCoords(
  words: string[],
  rows: number,
  cols: number,
  fillAlpha: string,
): { grid: string[][], coords: Record<string, [number, number][]> } {
  // Retry the whole grid up to 30 times to guarantee every word is placed
  for (let attempt = 0; attempt < 30; attempt++) {
    const result = tryBuildGrid(words, rows, cols);
    if (!result) continue;

    const { grid: sparseGrid, coords } = result;
    const wordCells = buildWordCellSet(coords);

    // Fill remaining nulls with random letters
    const grid = sparseGrid as string[][];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === null) {
          grid[r][c] = fillAlpha[Math.floor(Math.random() * fillAlpha.length)];
        }
      }
    }

    // Remove any accidental extra occurrences created by the fill
    eliminateAccidentalWords(grid, words, coords, wordCells, fillAlpha, rows, cols);

    return { grid, coords };
  }

  // Last-resort: place words sequentially in rows (never fails)
  const grid: string[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => fillAlpha[Math.floor(Math.random() * fillAlpha.length)])
  );
  const coords: Record<string, [number, number][]> = {};
  let row = 0; const col = 0;
  for (const word of words) {
    if (row >= rows) break;
    const cells: [number, number][] = [];
    for (let i = 0; i < word.length && col + i < cols; i++) {
      grid[row][col + i] = word[i];
      cells.push([row, col + i]);
    }
    coords[word] = cells;
    row++;
  }
  return { grid, coords };
}

export function generateWordSearch(
  words: string[],
  rows: number,
  cols: number,
  fillAlpha: string,
): string[][] {
  return generateWordSearchWithCoords(words, rows, cols, fillAlpha).grid;
}
