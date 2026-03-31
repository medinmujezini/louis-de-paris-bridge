import React from 'react';
import { FloorPlanProvider } from '@/qeramika/contexts/FloorPlanContext';
import { FurnitureProvider } from '@/qeramika/contexts/FurnitureContext';
import { MEPProvider } from '@/qeramika/contexts/MEPContext';
import { MaterialProvider } from '@/qeramika/contexts/MaterialContext';
import EndUserPlatform from '@/qeramika/pages/EndUserPlatform';

const UnitInteriorPage: React.FC = () => {
  return (
    <FloorPlanProvider>
      <FurnitureProvider>
        <MEPProvider>
          <MaterialProvider>
            <EndUserPlatform />
          </MaterialProvider>
        </MEPProvider>
      </FurnitureProvider>
    </FloorPlanProvider>
  );
};

export default UnitInteriorPage;
