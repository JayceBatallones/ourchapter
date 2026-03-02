export type LayoutNode = {
  cx: number;
  cy: number;
  r: number;
  index: number;
};

/**
 * Simple hash from a string to a number between 0 and 1.
 */
function hashToFloat(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash % 10000) / 10000;
}

/**
 * Place members in concentric rings within a 100x100 viewBox.
 * Uses member ID for deterministic jitter so positions are stable.
 */
export function layoutNodes(memberIds: string[]): LayoutNode[] {
  const count = memberIds.length;
  if (count === 0) return [];

  const center = 50;
  // Scale max radius based on count, capped between 30 and 44
  const maxRadius = Math.min(44, Math.max(30, 10 + count * 2));
  // How many members fit per ring (grows with circumference)
  const ringCapacity = (ring: number) => Math.max(4, Math.floor(ring * 5));

  const nodes: LayoutNode[] = [];
  let placed = 0;
  let ring = 1;

  while (placed < count) {
    const capacity = ringCapacity(ring);
    const ringRadius = (ring / (ring + 2)) * maxRadius;
    const membersInRing = Math.min(capacity, count - placed);

    for (let i = 0; i < membersInRing; i++) {
      const id = memberIds[placed];
      const jitter = hashToFloat(id);
      const angle = ((2 * Math.PI) / membersInRing) * i + jitter * 0.4;
      const rJitter = 1 + (jitter - 0.5) * 0.3;

      const cx = center + Math.cos(angle) * ringRadius * rJitter;
      const cy = center + Math.sin(angle) * ringRadius * rJitter;
      // Node radius between 2.5 and 4.5, varied by hash
      const r = 2.5 + jitter * 2;

      nodes.push({
        cx: Math.max(5, Math.min(95, cx)),
        cy: Math.max(5, Math.min(95, cy)),
        r,
        index: placed,
      });
      placed++;
    }
    ring++;
  }

  return nodes;
}

/**
 * Connect each node to its 2 nearest neighbors.
 */
export function generateEdges(nodes: LayoutNode[]): [number, number][] {
  if (nodes.length < 2) return [];

  const edges = new Set<string>();
  const result: [number, number][] = [];

  for (let i = 0; i < nodes.length; i++) {
    // Compute distances to all other nodes
    const distances = nodes
      .map((n, j) => ({
        j,
        dist: Math.hypot(n.cx - nodes[i].cx, n.cy - nodes[i].cy),
      }))
      .filter((d) => d.j !== i)
      .sort((a, b) => a.dist - b.dist);

    // Connect to 2 nearest
    for (let k = 0; k < Math.min(2, distances.length); k++) {
      const a = Math.min(i, distances[k].j);
      const b = Math.max(i, distances[k].j);
      const key = `${a}-${b}`;
      if (!edges.has(key)) {
        edges.add(key);
        result.push([a, b]);
      }
    }
  }

  return result;
}

/**
 * Extract 1-2 letter initials from a full name.
 */
export function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
