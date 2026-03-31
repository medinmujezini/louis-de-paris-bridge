import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Unit, UnitType } from "@/types/units";
import { mockUnits } from "@/data/mock-units";
import { isMockMode } from "@/lib/ue-bridge";

const mapDbUnit = (unit: any): Unit => ({
  id: unit.id,
  name: unit.name,
  floor: unit.floor,
  surface: Number(unit.surface),
  bedrooms: unit.bedrooms,
  bathrooms: unit.bathrooms,
  price: Number(unit.price),
  available: unit.available,
  orientation: unit.orientation as Unit["orientation"],
  features: unit.features || [],
  thumbnail: unit.thumbnail || undefined,
  section: unit.section || undefined,
  building: unit.building || undefined,
  unitType: (unit.unit_type as UnitType) || "apartment",
  terrace: unit.terrace ? Number(unit.terrace) : undefined,
  duplexTotal: unit.duplex_total ? Number(unit.duplex_total) : undefined,
  isDemo: unit.is_demo || false,
});

// Fetch all units from database or mock data
export const useUnits = () => {
  return useQuery({
    queryKey: ["units"],
    queryFn: async (): Promise<Unit[]> => {
      if (isMockMode()) {
        try {
          const { data, error } = await supabase
            .from("units")
            .select("*")
            .order("floor", { ascending: true });

          if (error) throw error;
          return data.map(mapDbUnit);
        } catch {
          return mockUnits;
        }
      }

      const { data, error } = await supabase
        .from("units")
        .select("*")
        .order("floor", { ascending: true });

      if (error) throw error;
      return data.map(mapDbUnit);
    },
  });
};

// Update a unit
export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unit: Partial<Unit> & { id: string }) => {
      const { error } = await supabase
        .from("units")
        .update({
          name: unit.name,
          floor: unit.floor,
          surface: unit.surface,
          bedrooms: unit.bedrooms,
          bathrooms: unit.bathrooms,
          price: unit.price,
          available: unit.available,
          orientation: unit.orientation,
          features: unit.features,
          thumbnail: unit.thumbnail,
          section: unit.section,
          building: unit.building,
          unit_type: unit.unitType,
          terrace: unit.terrace,
          duplex_total: unit.duplexTotal,
        })
        .eq("id", unit.id);

      if (error) throw error;
      return unit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};

// Create a new unit
export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unit: Unit) => {
      const { error } = await supabase.from("units").insert({
        id: unit.id,
        name: unit.name,
        floor: unit.floor,
        surface: unit.surface,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        price: unit.price,
        available: unit.available,
        orientation: unit.orientation,
        features: unit.features || [],
        thumbnail: unit.thumbnail,
        section: unit.section,
        building: unit.building,
        unit_type: unit.unitType || "apartment",
        terrace: unit.terrace,
        duplex_total: unit.duplexTotal,
      });

      if (error) throw error;
      return unit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};

// Delete a unit
export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase.from("units").delete().eq("id", unitId);

      if (error) throw error;
      return unitId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};

// Toggle unit availability
export const useToggleUnitAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, available }: { id: string; available: boolean }) => {
      const { error } = await supabase
        .from("units")
        .update({ available })
        .eq("id", id);

      if (error) throw error;
      return { id, available };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};
