import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  previewNote: string;
}

/** Standard placeholder shell for the Phase 2+ feature pages (Attendance,
 * Assignments, Timetable, Notes, Calendar, Exams, Analytics). */
export function ComingSoonPage({ title, description, icon, previewNote }: ComingSoonProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        title={title}
        description={description}
        actions={
          <Badge variant="accent" className="gap-1">
            <Sparkles className="h-3 w-3" /> Coming soon
          </Badge>
        }
      />
      <EmptyState icon={icon} title="This is reserved for Phase 2" description={previewNote} />
    </div>
  );
}
