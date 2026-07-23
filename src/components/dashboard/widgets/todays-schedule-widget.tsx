import { CalendarClock } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { TodaysSchedule } from "@/components/attendance/todays-schedule";
import { UpcomingFallback } from "@/components/dashboard/upcoming-fallback";

export function TodaysScheduleWidget(props: { onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }) {
  return (
    <WidgetShell title="Today's schedule" icon={CalendarClock} {...props}>
      <TodaysSchedule fallback={<UpcomingFallback />} />
    </WidgetShell>
  );
}
