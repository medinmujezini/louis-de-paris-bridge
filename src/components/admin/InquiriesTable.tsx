import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useInquiries, useUpdateInquiryStatus, useUpdateInquiryNotes, useDeleteInquiry,
  type Inquiry,
} from "@/hooks/useInquiries";
import {
  Search, Trash2, AlertTriangle, MessageSquare, Loader2, StickyNote, Save, X,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  contacted: { label: "Contacted", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  closed: { label: "Closed", className: "bg-green-500/20 text-green-400 border-green-500/30" },
};

export const InquiriesTable = () => {
  const { data: inquiries = [], isLoading, error } = useInquiries();
  const updateStatus = useUpdateInquiryStatus();
  const updateNotes = useUpdateInquiryNotes();
  const deleteInquiry = useDeleteInquiry();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");

  const filtered = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      inq.unit_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      await updateNotes.mutateAsync({ id, admin_notes: notesText });
      toast.success("Notes saved");
      setEditingNotesId(null);
    } catch {
      toast.error("Failed to save notes");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteInquiry.mutateAsync(deleteId);
      toast.success("Inquiry deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete inquiry");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <p className="text-destructive font-medium">Failed to load inquiries</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <GlassInput
            placeholder="Search by name, email, unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-white/5 border-white/10">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-white/5 border-b border-white/10">
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((inq) => (
                <TableRow key={inq.id} className="group border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(inq.created_at), "MMM d, yyyy")}
                    <br />
                    <span className="text-[10px]">{format(new Date(inq.created_at), "HH:mm")}</span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {inq.name}
                    {inq.phone && (
                      <span className="block text-xs text-muted-foreground">{inq.phone}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{inq.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inq.unit_name}</TableCell>
                  <TableCell className="text-center">
                    <Select
                      value={inq.status}
                      onValueChange={(val) => handleStatusChange(inq.id, val)}
                    >
                      <SelectTrigger className="w-[120px] h-7 border-0 bg-transparent p-0 justify-center">
                        <Badge className={statusConfig[inq.status]?.className ?? "bg-muted text-muted-foreground"}>
                          {statusConfig[inq.status]?.label ?? inq.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {editingNotesId === inq.id ? (
                      <div className="flex items-center gap-1">
                        <Textarea
                          value={notesText}
                          onChange={(e) => setNotesText(e.target.value)}
                          className="h-16 text-xs bg-white/5 border-white/10 resize-none"
                          placeholder="Admin notes..."
                        />
                        <div className="flex flex-col gap-1">
                          <GlassButton
                            variant="ghost" size="icon"
                            className="h-7 w-7"
                            onClick={() => handleSaveNotes(inq.id)}
                          >
                            <Save className="w-3 h-3" />
                          </GlassButton>
                          <GlassButton
                            variant="ghost" size="icon"
                            className="h-7 w-7"
                            onClick={() => setEditingNotesId(null)}
                          >
                            <X className="w-3 h-3" />
                          </GlassButton>
                        </div>
                      </div>
                    ) : (
                      <GlassButton
                        variant="ghost" size="sm"
                        className="text-xs gap-1 h-7"
                        onClick={() => {
                          setEditingNotesId(inq.id);
                          setNotesText(inq.admin_notes ?? "");
                        }}
                      >
                        <StickyNote className="w-3 h-3" />
                        {inq.admin_notes ? "Edit" : "Add"}
                      </GlassButton>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <GlassButton
                      variant="ghost" size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setDeleteId(inq.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </GlassButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{inquiries.length} total</span>
        <span className="text-white/10">•</span>
        <span>{inquiries.filter((i) => i.status === "new").length} new</span>
        <span className="text-white/10">•</span>
        <span>{inquiries.filter((i) => i.status === "contacted").length} contacted</span>
        <span className="text-white/10">•</span>
        <span>{inquiries.filter((i) => i.status === "closed").length} closed</span>
      </div>

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card glass-card--strong border-0">
          <div className="glass-card__light-bar glass-card__light-bar--strong" aria-hidden="true" />
          <div className="relative z-10">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Delete Inquiry
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This will permanently remove this inquiry.
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
