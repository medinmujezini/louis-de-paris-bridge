import type { ScaleCalibration } from '@/qeramika/types/floorPlanDigitizer';
export { pixelsToCm } from '@/qeramika/utils/dimensions';

export function createScaleCalibration(
  pixelDistance: number,
  realWorldCm: number
): ScaleCalibration {
  const pixelsPerCm = pixelDistance / realWorldCm;
  return { pixelsPerCm, calibrated: true } as ScaleCalibration;
}

export function calculatePixelDistance(
  x1: number, y1: number, x2: number, y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function validateCalibration(scale: ScaleCalibration): boolean {
  return scale.pixelsPerCm > 0;
}
