import type { Wall, Point } from '@/qeramika/types/floorPlan';

export interface WallElevationShape {
  points: Point[];
  width: number;
  height: number;
}

export const calculateWallElevationShape = (wall: Wall, ...args: any[]): WallElevationShape => {
  return {
    points: [],
    width: wall.height ?? 2.7,
    height: wall.height ?? 2.7,
  };
};
