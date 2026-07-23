import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TaskList } from "@/components/tasks/task-list";

export const metadata: Metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" description="Personal to-dos, kept separate from assignments." />
      <TaskList />
    </div>
  );
}
