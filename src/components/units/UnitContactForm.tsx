import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormData } from "@/lib/validations";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, CheckCircle } from "lucide-react";

interface UnitContactFormProps {
  unitId: string;
  unitName: string;
}

export function UnitContactForm({ unitId, unitName }: UnitContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: `I'm interested in ${unitName}. Please contact me with more information.`,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    const { error } = await supabase.from("inquiries").insert({
      unit_id: unitId,
      unit_name: unitName,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Inquiry Sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setTimeout(() => {
      reset();
      setIsSubmitted(false);
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <GlassCard variant="subtle" className="p-6 text-center">
        <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Thank You!</h3>
        <p className="text-muted-foreground">Your inquiry has been sent. We'll contact you soon.</p>
      </GlassCard>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <GlassInput id="name" placeholder="Your full name" {...register("name")} className={errors.name ? "border-destructive" : ""} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <GlassInput id="email" type="email" placeholder="your@email.com" {...register("email")} className={errors.email ? "border-destructive" : ""} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <GlassInput id="phone" type="tel" placeholder="+1 (555) 000-0000" {...register("phone")} className={errors.phone ? "border-destructive" : ""} />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" placeholder="Tell us about your interest..." rows={4} {...register("message")} className={`bg-white/5 backdrop-blur-sm border-white/10 resize-none ${errors.message ? "border-destructive" : ""}`} />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <GlassButton type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
        ) : (
          <><Send className="w-4 h-4 mr-2" />Send Inquiry</>
        )}
      </GlassButton>
    </form>
  );
}
