import type { Wall, Point } from '@/qeramika/types/floorPlan';

export interface WallElevationShape {
  points: Point[];
  width: number;
  height: number;
}

export interface SlopePreset {
  label: string;
  angle: number;
}

export const SLOPE_PRESETS: SlopePreset[] = [
  { label: 'Flat', angle: 0 },
  { label: 'Low (5°)', angle: 5 },
  { label: 'Medium (15°)', angle: 15 },
  { label: 'Steep (30°)', angle: 30 },
  { label: 'Mansard (45°)', angle: 45 },
];

export const calculateWallElevationShape = (wall: Wall, ..._args: any[]): WallElevationShape => {
  return {
    points: [],
    width: wall.height ?? 2.7,
    height: wall.height ?? 2.7,
  };
};

export function calculateHeightFromAngle(
  baseHeight: number,
  angle: number,
  wallLength: number
): number {
  return baseHeight + Math.tan((angle * Math.PI) / 180) * wallLength;
}

export function calculateAngleFromHeights(
  startHeight: number,
  endHeight: number,
  wallLength: number
): number {
  if (wallLength === 0) return 0;
  return (Math.atan((endHeight - startHeight) / wallLength) * 180) / Math.PI;
}

export function detectHeightMismatches(
  _walls: Wall[],
  _points: Point[]
): { wallId: string; message: string }[] {
  return [];
}

export function getConnectedWalls(
  wallId: string,
  walls: Wall[]
): Wall[] {
  const wall = walls.find(w => w.id === wallId);
  if (!wall) return [];
  return walls.filter(
    w => w.id !== wallId && 
    (w.startPointId === wall.startPointId || 
     w.startPointId === wall.endPointId ||
     w.endPointId === wall.startPointId || 
     w.endPointId === wall.endPointId)
  );
}
