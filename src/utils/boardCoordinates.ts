export interface Point {
  x: number;
  y: number;
}

export interface CellCoordinate {
  square: number;
  col: number; // 0 to 9 (0 is left)
  rowFromBottom: number; // 0 to 9 (0 is bottom)
  screenRow: number; // 0 to 9 (0 is top)
  centerPercent: Point; // {x: 0..100, y: 0..100}
}

/**
 * Returns exact cell coordinate and center point percentages for any square 1-100.
 */
export function getSquareCoordinate(square: number): CellCoordinate {
  const clamped = Math.max(1, Math.min(100, square));
  const index = clamped - 1;
  const rowFromBottom = Math.floor(index / 10);
  const remainder = index % 10;
  
  // Serpentine: even rows (0, 2, 4..) go L->R, odd rows (1, 3, 5..) go R->L
  const isEvenRow = rowFromBottom % 2 === 0;
  const col = isEvenRow ? remainder : 9 - remainder;
  const screenRow = 9 - rowFromBottom;

  const centerPercent: Point = {
    x: (col + 0.5) * 10,
    y: (screenRow + 0.5) * 10,
  };

  return {
    square: clamped,
    col,
    rowFromBottom,
    screenRow,
    centerPercent,
  };
}

/**
 * Offset player tokens when multiple pawns share the exact same cell.
 */
export function getPlayerOffset(playerIndex: number, totalPlayersOnCell: number): Point {
  if (totalPlayersOnCell <= 1) {
    return { x: 0, y: 0 };
  }
  
  // Spread pawns within +/- 2.2% radius so they are all clearly visible
  if (totalPlayersOnCell === 2) {
    return playerIndex === 0 ? { x: -1.6, y: -1.4 } : { x: 1.6, y: 1.4 };
  }
  if (totalPlayersOnCell === 3) {
    const angle = (playerIndex * 2 * Math.PI) / 3 - Math.PI / 2;
    return {
      x: Math.cos(angle) * 2.0,
      y: Math.sin(angle) * 2.0,
    };
  }
  // 4 players in a neat diamond/box
  const offsets = [
    { x: -1.7, y: -1.7 },
    { x: 1.7, y: -1.7 },
    { x: -1.7, y: 1.7 },
    { x: 1.7, y: 1.7 },
  ];
  return offsets[playerIndex % offsets.length];
}

/**
 * Generates an SVG path for a ladder with 2 parallel rails and perpendicular rungs.
 */
export function generateLadderGeometry(bottomSquare: number, topSquare: number) {
  const pBottom = getSquareCoordinate(bottomSquare).centerPercent;
  const pTop = getSquareCoordinate(topSquare).centerPercent;

  const dx = pTop.x - pBottom.x;
  const dy = pTop.y - pBottom.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Normal unit vector (perpendicular to rail direction)
  const nx = -dy / length;
  const ny = dx / length;

  const halfWidth = 1.6; // Width of ladder in percentage coordinates

  // Left rail
  const leftStart = { x: pBottom.x + nx * halfWidth, y: pBottom.y + ny * halfWidth };
  const leftEnd = { x: pTop.x + nx * halfWidth, y: pTop.y + ny * halfWidth };

  // Right rail
  const rightStart = { x: pBottom.x - nx * halfWidth, y: pBottom.y - ny * halfWidth };
  const rightEnd = { x: pTop.x - nx * halfWidth, y: pTop.y - ny * halfWidth };

  // Calculate number of rungs based on ladder length
  const rungSpacing = 3.2;
  const rungCount = Math.max(3, Math.floor(length / rungSpacing));
  const rungs: { p1: Point; p2: Point }[] = [];

  for (let i = 1; i <= rungCount; i++) {
    const t = i / (rungCount + 1);
    const midX = pBottom.x + dx * t;
    const midY = pBottom.y + dy * t;
    rungs.push({
      p1: { x: midX + nx * halfWidth, y: midY + ny * halfWidth },
      p2: { x: midX - nx * halfWidth, y: midY - ny * halfWidth },
    });
  }

  return {
    leftRail: `M ${leftStart.x} ${leftStart.y} L ${leftEnd.x} ${leftEnd.y}`,
    rightRail: `M ${rightStart.x} ${rightStart.y} L ${rightEnd.x} ${rightEnd.y}`,
    rungs,
    pBottom,
    pTop,
  };
}

/**
 * Generates a curved serpentine snake SVG path from Head to Tail with authentic winding body.
 */
export function generateSnakeGeometry(headSquare: number, tailSquare: number) {
  const pHead = getSquareCoordinate(headSquare).centerPercent;
  const pTail = getSquareCoordinate(tailSquare).centerPercent;

  const dx = pTail.x - pHead.x;
  const dy = pTail.y - pHead.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Normal vector
  const nx = -dy / dist;
  const ny = dx / dist;

  // Curvature wiggle amplitude
  const amplitude = Math.min(6, Math.max(3.2, dist * 0.15));

  // Determine wave direction based on head/tail orientation
  const sign = (headSquare % 2 === 0) ? 1 : -1;

  // We can create 2 intermediate wave control points
  const p1 = {
    x: pHead.x + dx * 0.33 + nx * amplitude * sign,
    y: pHead.y + dy * 0.33 + ny * amplitude * sign,
  };
  const p2 = {
    x: pHead.x + dx * 0.67 - nx * amplitude * sign,
    y: pHead.y + dy * 0.67 - ny * amplitude * sign,
  };

  const pathString = `M ${pHead.x} ${pHead.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${pTail.x} ${pTail.y}`;

  // Calculate head rotation angle in degrees
  const headAngle = (Math.atan2(p1.y - pHead.y, p1.x - pHead.x) * 180) / Math.PI;

  return {
    head: pHead,
    tail: pTail,
    p1,
    p2,
    pathString,
    headAngle,
  };
}
