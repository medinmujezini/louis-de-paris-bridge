import { useState } from "react";
import { ParkingTypeSelector, ParkingType } from "@/components/parking/ParkingTypeSelector";
import { ParkingBrowser } from "@/components/parking/ParkingBrowser";
import { ParkingPublicInfo } from "@/components/parking/ParkingPublicInfo";

const ParkingPage = () => {
  const [stage, setStage] = useState<ParkingType | null>(null);

  const handleSelect = (type: ParkingType) => {
    setStage(type);
  };

  const handleBack = () => setStage(null);

  return (
    <div className="relative w-full h-[calc(100vh-6rem)]">
      <div className="absolute right-3 top-0 bottom-3 w-[340px] max-w-[85vw] z-10">
        {!stage && <ParkingTypeSelector onSelect={handleSelect} />}
        {stage === "inside" && <ParkingBrowser onBack={handleBack} />}
        {(stage === "outside" || stage === "underground") && (
          <ParkingPublicInfo type={stage} onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

export default ParkingPage;
