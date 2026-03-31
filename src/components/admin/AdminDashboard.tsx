import { GlassCard } from "@/components/ui/glass-card";
import { useUnits } from "@/hooks/useUnits";
import { useInquiries } from "@/hooks/useInquiries";
import { Building2, CheckCircle, MessageSquare, AlertCircle, Loader2 } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
}

const StatCard = ({ icon, label, value, sub }: StatCardProps) => (
  <GlassCard variant="subtle" className="p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
    </div>
  </GlassCard>
);

export const AdminDashboard = () => {
  const { data: units = [], isLoading: unitsLoading } = useUnits();
  const { data: inquiries = [], isLoading: inquiriesLoading } = useInquiries();

  if (unitsLoading || inquiriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const availableUnits = units.filter((u) => u.available).length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Building2 className="w-5 h-5 text-primary" />}
        label="Total Units"
        value={units.length}
        sub={`${availableUnits} available`}
      />
      <StatCard
        icon={<CheckCircle className="w-5 h-5 text-green-400" />}
        label="Sold / Reserved"
        value={units.length - availableUnits}
        sub={`${Math.round(((units.length - availableUnits) / (units.length || 1)) * 100)}% sold`}
      />
      <StatCard
        icon={<MessageSquare className="w-5 h-5 text-blue-400" />}
        label="Total Inquiries"
        value={inquiries.length}
        sub={`${inquiries.filter((i) => i.status === "contacted").length} contacted`}
      />
      <StatCard
        icon={<AlertCircle className="w-5 h-5 text-amber-400" />}
        label="New Inquiries"
        value={newInquiries}
        sub={newInquiries > 0 ? "Needs attention" : "All caught up"}
      />
    </div>
  );
};
