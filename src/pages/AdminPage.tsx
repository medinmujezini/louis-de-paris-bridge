import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { UnitsTable } from "@/components/admin/UnitsTable";
import { UnitEditForm } from "@/components/admin/UnitEditForm";
import { InquiriesTable } from "@/components/admin/InquiriesTable";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUnits } from "@/hooks/useUnits";
import { Unit } from "@/types/units";
import { Building2, LogOut, Shield, AlertCircle, Loader2, ArrowLeft, LayoutDashboard, Home, MessageSquare } from "lucide-react";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { data: units = [], isLoading: unitsLoading, error } = useUnits();
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onSuccess={() => {}} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <GlassCard variant="strong" className="max-w-md w-full p-8 text-center relative z-10">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges. Please contact an administrator if you believe this is an error.
          </p>
          <div className="flex gap-3 justify-center">
            <GlassButton variant="outline" onClick={() => navigate("/")}>Go Home</GlassButton>
            <GlassButton onClick={handleLogout}>Sign Out</GlassButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[50%] right-[20%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GlassCard variant="strong" className="w-12 h-12 flex items-center justify-center !p-0">
              <Building2 className="w-6 h-6 text-primary" />
            </GlassCard>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground">Manage units, inquiries, and overview</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Signed in as <span className="text-foreground font-medium">{user.email}</span>
            </span>
            <GlassButton variant="secondary" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />Back
            </GlassButton>
            <GlassButton variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />Sign Out
            </GlassButton>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-white/10">
              <LayoutDashboard className="w-4 h-4" />Dashboard
            </TabsTrigger>
            <TabsTrigger value="units" className="gap-2 data-[state=active]:bg-white/10">
              <Home className="w-4 h-4" />Units
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2 data-[state=active]:bg-white/10">
              <MessageSquare className="w-4 h-4" />Inquiries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="units">
            {/* Info Banner */}
            <GlassCard variant="strong" className="p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-500">Important: Unit IDs are linked to Unreal Engine</p>
                  <p className="text-muted-foreground mt-1">
                    The <code className="bg-white/5 px-1 rounded">id</code> field corresponds to the{" "}
                    <code className="bg-white/5 px-1 rounded">Tag</code> on BP_UnitMarker cubes in UE.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="strong" className="p-6">
              {error ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <p className="text-destructive font-medium">Failed to load units</p>
                  <p className="text-muted-foreground text-sm mt-1">{String(error)}</p>
                </div>
              ) : unitsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <UnitsTable
                  units={units}
                  onEdit={(unit) => { setIsCreating(false); setEditingUnit(unit); }}
                  onAdd={() => { setEditingUnit(null); setIsCreating(true); }}
                />
              )}
            </GlassCard>

            <UnitEditForm
              unit={editingUnit}
              open={!!editingUnit || isCreating}
              onClose={() => { setEditingUnit(null); setIsCreating(false); }}
              isNew={isCreating}
            />
          </TabsContent>

          <TabsContent value="inquiries">
            <GlassCard variant="strong" className="p-6">
              <InquiriesTable />
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
