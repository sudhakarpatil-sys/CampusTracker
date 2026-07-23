import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AssignmentsView } from "@/components/assignments/assignments-view";

export const metadata: Metadata = { title: "Assignments" };

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Track every deadline across Kanban, list, and calendar views." />
      <AssignmentsView />
    </div>
  );
}
