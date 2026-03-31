import type { Wall, Point } from '@/qeramika/types/floorPlan';

export interface WallElevationShape {
  points: Point[];
  width: number;
  height: number;
}

export interface SlopePreset {
  label: string;
  angle: number;
  description: string;
}

export const SLOPE_PRESETS: SlopePreset[] = [
  { label: 'Flat', angle: 0, description: 'No slope' },
  { label: 'Low', angle: 5, description: 'Gentle 5° slope' },
  { label: 'Medium', angle: 15, description: 'Moderate 15° slope' },
  { label: 'Steep', angle: 30, description: 'Steep 30° slope' },
  { label: 'Mansard', angle: 45, description: 'Mansard 45° slope' },
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
  wallLength: number,
  angle: number,
  direction: string = 'descending'
): number {
  const delta = Math.tan((angle * Math.PI) / 180) * wallLength;
  return direction === 'ascending' ? baseHeight + delta : baseHeight - delta;
}

export function calculateAngleFromHeights(
  startHeight: number,
  endHeight: number,
  wallLength: number
): number {
  if (wallLength === 0) return 0;
  return (Math.atan(Math.abs(endHeight - startHeight) / wallLength) * 180) / Math.PI;
}

export interface HeightMismatch {
  wallId: string;
  message: string;
  walls: { wallId: string }[];
}

export function detectHeightMismatches(
  _walls: Wall[],
  _points: Point[]
): HeightMismatch[] {
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
