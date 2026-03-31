import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Unit } from "@/types/units";
import { useToggleUnitAvailability, useDeleteUnit } from "@/hooks/useUnits";
import { Pencil, Trash2, Search, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UnitsTableProps {
  units: Unit[];
  onEdit: (unit: Unit) => void;
  onAdd: () => void;
}

export const UnitsTable = ({ units, onEdit, onAdd }: UnitsTableProps) => {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toggleAvailability = useToggleUnitAvailability();
  const deleteUnit = useDeleteUnit();

  const filteredUnits = units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(search.toLowerCase()) ||
      unit.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleAvailability = async (unit: Unit) => {
    try {
      await toggleAvailability.mutateAsync({
        id: unit.id,
        available: !unit.available,
      });
      toast.success(`${unit.name} marked as ${!unit.available ? "available" : "unavailable"}`);
    } catch (error) {
      toast.error("Failed to update availability. Are you an admin?");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUnit.mutateAsync(deleteId);
      toast.success("Unit deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete unit. Are you an admin?");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <GlassInput
            placeholder="Search by ID or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <GlassButton onClick={onAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Unit
        </GlassButton>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-white/5 border-b border-white/10">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Floor</TableHead>
              <TableHead className="text-center">Beds</TableHead>
              <TableHead className="text-center">Baths</TableHead>
              <TableHead className="text-right">Surface</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No units found
                </TableCell>
              </TableRow>
            ) : (
              filteredUnits.map((unit) => (
                <TableRow key={unit.id} className="group border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {unit.id}
                  </TableCell>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell className="text-center">{unit.floor}</TableCell>
                  <TableCell className="text-center">{unit.bedrooms}</TableCell>
                  <TableCell className="text-center">{unit.bathrooms}</TableCell>
                  <TableCell className="text-right">{unit.surface} m²</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(unit.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={unit.available}
                      onCheckedChange={() => handleToggleAvailability(unit)}
                      disabled={toggleAvailability.isPending}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GlassButton
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(unit)}
                        className="h-8 w-8"
                      >
                        <Pencil className="w-4 h-4" />
                      </GlassButton>
                      <GlassButton
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(unit.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{units.length} total units</span>
        <span className="text-white/10">•</span>
        <span>{units.filter((u) => u.available).length} available</span>
        <span className="text-white/10">•</span>
        <span>{units.filter((u) => !u.available).length} sold/reserved</span>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card glass-card--strong border-0">
          <div className="glass-card__light-bar glass-card__light-bar--strong" aria-hidden="true" />
          <div className="relative z-10">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Delete Unit
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this unit? This action cannot be undone.
                <br />
                <br />
                <strong>Warning:</strong> Make sure to also remove the corresponding cube/marker
                in Unreal Engine with the matching ID tag.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
