import type { Fixture } from '@/qeramika/types/floorPlan';

export const FIXTURE_CLEARANCES: Record<string, number> = {};

export function checkFixtureCollisions(
  _fixture: Fixture,
  _allFixtures: Fixture[]
): { colliding: boolean; collidingWith: string[] } {
  return { colliding: false, collidingWith: [] };
}

export function getClearanceZone(
  _fixture: Fixture
): { x: number; y: number; width: number; height: number } | null {
  return null;
}
