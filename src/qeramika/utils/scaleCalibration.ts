import type { ScaleCalibration } from '@/qeramika/types/floorPlanDigitizer';
export { pixelsToCm } from '@/qeramika/utils/dimensions';

type Point = { x: number; y: number };

export function createScaleCalibration(
  point1: Point,
  point2: Point,
  realWorldDistance: number,
  unit: 'cm' | 'mm' | 'in' | 'ft' | 'm'
): ScaleCalibration {
  const pixelDist = Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
  let distInCm = realWorldDistance;
  if (unit === 'mm') distInCm = realWorldDistance / 10;
  else if (unit === 'in') distInCm = realWorldDistance * 2.54;
  else if (unit === 'ft') distInCm = realWorldDistance * 30.48;
  else if (unit === 'm') distInCm = realWorldDistance * 100;

  return {
    point1,
    point2,
    realWorldDistance: distInCm,
    unit,
    pixelsPerCm: pixelDist / distInCm,
  };
}

export function calculatePixelDistance(
  p1: Point,
  p2: Point
): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function validateCalibration(
  scale: ScaleCalibration
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (scale.pixelsPerCm <= 0) errors.push('Invalid scale factor');
  if (scale.pixelsPerCm < 0.1) errors.push('Scale seems too small');
  if (scale.pixelsPerCm > 1000) errors.push('Scale seems too large');
  return { isValid: errors.length === 0, errors };
}
