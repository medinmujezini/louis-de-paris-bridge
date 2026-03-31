import React from 'react';
export const BlueprintImportWizard: React.FC<any> = ({ onClose }: { onClose?: () => void }) => (
  <div className="p-4 text-muted-foreground text-sm">
    Blueprint import wizard — coming soon
    {onClose && <button onClick={onClose} className="ml-2 underline">Close</button>}
  </div>
);
