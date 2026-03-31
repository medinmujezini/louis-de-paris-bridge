import type { Fixture } from '@/qeramika/types/floorPlan';

export const FIXTURE_CLEARANCES: Record<string, number> = {};

export function checkFixtureCollisions(
  fixture: Fixture,
  allFixtures: Fixture[],
  _excludeId?: string
): { fixtureId: string; overlap: number }[] {
  return [];
}

export function getClearanceZone(
  _fixture: Fixture
): { x: number; y: number; width: number; height: number } | null {
  return null;
}
