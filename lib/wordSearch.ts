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

export function generateWordSearch(
  words: string[],
  rows: number,
  cols: number,
  fillAlpha: string,
): string[][] {
  const grid: (string | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null),
  );

  // Longest words first to maximize placement success
  const sorted = [...words].sort((a, b) => b.length - a.length);

  for (const word of sorted) {
    let placed = false;

    // Randomized attempts across all directions
    for (let attempt = 0; attempt < 400 && !placed; attempt++) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (canPlace(grid, word, r, c, dr, dc, rows, cols)) {
        doPlace(grid, word, r, c, dr, dc);
        placed = true;
      }
    }

    // Systematic fallback (guarantees placement if any position works)
    if (!placed) {
      outer: for (const [dr, dc] of DIRS) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (canPlace(grid, word, r, c, dr, dc, rows, cols)) {
              doPlace(grid, word, r, c, dr, dc);
              placed = true;
              break outer;
            }
          }
        }
      }
    }
  }

  // Fill remaining cells with filler letters
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = fillAlpha[Math.floor(Math.random() * fillAlpha.length)];
      }
    }
  }

  return grid as string[][];
}
