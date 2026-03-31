import { useNavigate } from "react-router-dom";
import { UnitsBrowser } from "@/components/units/UnitsBrowser";
import { useSelectedUnit, SelectedUnitProvider } from "@/contexts/SelectedUnitContext";
import { Eye, Box } from "lucide-react";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";

function ViewDetailsButton() {
  const { selectedUnit, openDetail } = useSelectedUnit();
  const navigate = useNavigate();

  if (!selectedUnit) return null;

  const isSold = !selectedUnit.available;

  const handleEnter3D = () => {
    if (isSold) return;
    enter(selectedUnit);
    navigate("/interioredit");
  };

  const ctaButtonClass = "group relative px-8 py-3 rounded-xl overflow-visible flex items-center gap-3 text-base font-bold text-foreground transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105";
  const ctaButtonStyle = {
    background: "linear-gradient(180deg, hsl(var(--primary) / 0.3) 0%, hsl(var(--primary) / 0.08) 100%)",
    boxShadow: "0 0 20px hsl(var(--primary) / 0.25), 0 0 6px hsl(var(--primary) / 0.15), 0 8px 32px rgba(0,0,0,0.4)",
    backdropFilter: "blur(12px)",
  };

  return (
    <div className="absolute bottom-20 z-10 flex flex-col items-center gap-3" style={{ left: "44.5%", transform: "translateX(-50%)" }}>
      <button
        onClick={handleEnter3D}
        disabled={isSold}
        className={`group relative px-8 py-3 rounded-xl overflow-visible flex items-center gap-3 text-base font-bold transition-all duration-300 border ${
          isSold
            ? "text-foreground/40 border-white/5 cursor-not-allowed opacity-50"
            : "text-foreground border-white/20 hover:border-white/30 hover:scale-105"
        }`}
        style={{
          background: isSold
            ? "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
          boxShadow: isSold ? "none" : "0 0 20px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
        }}
        title={isSold ? "This unit has been sold" : undefined}
      >
        {!isSold && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-all duration-300 group-hover:w-full" aria-hidden="true" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[4px] blur-[4px] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-300 group-hover:w-3/4 group-hover:blur-[6px]" aria-hidden="true" />
            <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
              boxShadow: "0 0 36px rgba(255,255,255,0.15), 0 0 14px rgba(255,255,255,0.1)",
            }} />
          </>
        )}
        <Box className="w-5 h-5" />
        {isSold ? "SOLD" : "3D VIEW"}
      </button>
      <button
        onClick={openDetail}
        className={ctaButtonClass}
        style={ctaButtonStyle}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300 group-hover:w-full" aria-hidden="true" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[4px] blur-[4px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300 group-hover:w-3/4 group-hover:blur-[6px]" aria-hidden="true" />
        <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          boxShadow: "0 0 36px hsl(var(--primary) / 0.4), 0 0 14px hsl(var(--primary) / 0.2)",
        }} />
        <Eye className="w-5 h-5" />
        VIEW DETAILS
      </button>
    </div>
  );
}

function UnitsPageContent() {
  const threeDMode = useThreeDMode();
  const isInterior = threeDMode.active;

  return (
    <div className="relative w-full h-[calc(100vh-6rem)]">
      {/* View Details CTA - hidden in interior */}
      {!isInterior && <ViewDetailsButton />}
      {/* Floating strip on the right - hidden in interior */}
      {!isInterior && (
        <div className="absolute right-3 top-0 bottom-3 w-[340px] max-w-[85vw] z-10">
          <UnitsBrowser />
        </div>
      )}
    </div>
  );
}

const UnitsPage = () => {
  return (
    <SelectedUnitProvider>
      <UnitsPageContent />
    </SelectedUnitProvider>
  );
};

export default UnitsPage;
