import type { Metadata } from "next";
import { TasksHero } from "@/components/tasks/tasks-hero";
import { TaskList } from "@/components/tasks/task-list";

export const metadata: Metadata = { title: "Tasks — CampusTracker" };

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <TasksHero />
      <TaskList />
    </div>
  );
}
