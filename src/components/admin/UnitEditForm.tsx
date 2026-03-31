import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Unit } from "@/types/units";
import { useUpdateUnit, useCreateUnit } from "@/hooks/useUnits";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { X, Plus, AlertCircle } from "lucide-react";
import { useState } from "react";

// Define Zod schema for unit data validation
const unitSchema = z.object({
  id: z.string().min(1, "ID is required").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1, "Name is required").max(100),
  floor: z.coerce.number().min(0).max(100),
  surface: z.coerce.number().min(1).max(10000),
  bedrooms: z.coerce.number().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(20),
  price: z.coerce.number().min(0),
  available: z.boolean(),
  orientation: z.enum(["north", "south", "east", "west"]),
  thumbnail: z.string().optional(),
  section: z.string().optional(),
});

type UnitFormData = z.infer<typeof unitSchema>;

interface UnitEditFormProps {
  unit: Unit | null;
  open: boolean;
  onClose: () => void;
  isNew?: boolean;
}

export const UnitEditForm = ({ unit, open, onClose, isNew = false }: UnitEditFormProps) => {
  const [features, setFeatures] = useState<string[]>(unit?.features || []);
  const [newFeature, setNewFeature] = useState("");
  const updateUnit = useUpdateUnit();
  const createUnit = useCreateUnit();

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      id: unit?.id || "",
      name: unit?.name || "",
      floor: unit?.floor || 1,
      surface: unit?.surface || 50,
      bedrooms: unit?.bedrooms || 1,
      bathrooms: unit?.bathrooms || 1,
      price: unit?.price || 100000,
      available: unit?.available ?? true,
      orientation: unit?.orientation || "south",
      thumbnail: unit?.thumbnail || "",
      section: unit?.section || "",
    },
  });

  // Reset form when unit changes
  if (unit && form.getValues("id") !== unit.id) {
    form.reset({
      id: unit.id,
      name: unit.name,
      floor: unit.floor,
      surface: unit.surface,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      price: unit.price,
      available: unit.available,
      orientation: unit.orientation || "south",
      thumbnail: unit.thumbnail || "",
      section: unit.section || "",
    });
    setFeatures(unit.features || []);
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature));
  };

  const onSubmit = async (data: UnitFormData) => {
    try {
      const unitData: Unit = {
        id: data.id,
        name: data.name,
        floor: data.floor,
        surface: data.surface,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        price: data.price,
        available: data.available,
        orientation: data.orientation,
        thumbnail: data.thumbnail,
        section: data.section,
        features,
      };

      if (isNew) {
        await createUnit.mutateAsync(unitData);
        toast.success("Unit created successfully");
      } else {
        await updateUnit.mutateAsync(unitData);
        toast.success("Unit updated successfully");
      }
      onClose();
    } catch (error) {
      toast.error(isNew ? "Failed to create unit" : "Failed to update unit");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card glass-card--strong border-0">
        <div className="glass-card__light-bar glass-card__light-bar--strong" aria-hidden="true" />
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add New Unit" : `Edit ${unit?.name}`}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              {/* ID and Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit ID (UE Tag)</FormLabel>
                      <FormControl>
                        <GlassInput
                          {...field}
                          disabled={!isNew}
                          placeholder="unit-a1"
                          className={!isNew ? "opacity-60" : ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {isNew ? (
                          <span className="flex items-center gap-1 text-amber-500">
                            <AlertCircle className="w-3 h-3" />
                            Must match the Tag on the UE cube
                          </span>
                        ) : (
                          "Cannot be changed (linked to UE)"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <GlassInput {...field} placeholder="Unit A1" />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Shown in the UI (can be changed freely)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Floor, Beds, Baths Row */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floor</FormLabel>
                      <FormControl>
                        <GlassInput type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <GlassInput type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <GlassInput type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Surface, Price, Orientation Row */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="surface"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surface (m²)</FormLabel>
                      <FormControl>
                        <GlassInput type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <GlassInput type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orientation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orientation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-white/10 bg-white/5">
                            <SelectValue placeholder="Select orientation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="glass-card glass-card--strong border-white/10">
                          <SelectItem value="north">North</SelectItem>
                          <SelectItem value="south">South</SelectItem>
                          <SelectItem value="east">East</SelectItem>
                          <SelectItem value="west">West</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Availability */}
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-white/10 p-4 bg-white/[0.02]">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Available</FormLabel>
                      <FormDescription>
                        Is this unit available for purchase?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Features */}
              <div className="space-y-2">
                <FormLabel>Features</FormLabel>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                  {features.length === 0 && (
                    <span className="text-sm text-muted-foreground">No features added</span>
                  )}
                  {features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <GlassInput
                    placeholder="Add feature (e.g., Balcony)"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <GlassButton type="button" variant="outline" onClick={handleAddFeature}>
                    <Plus className="w-4 h-4" />
                  </GlassButton>
                </div>
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <GlassInput {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <FormControl>
                        <GlassInput {...field} placeholder="floor-1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <GlassButton type="button" variant="outline" onClick={onClose}>
                  Cancel
                </GlassButton>
                <GlassButton
                  type="submit"
                  disabled={updateUnit.isPending || createUnit.isPending}
                >
                  {updateUnit.isPending || createUnit.isPending
                    ? "Saving..."
                    : isNew
                    ? "Create Unit"
                    : "Save Changes"}
                </GlassButton>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
