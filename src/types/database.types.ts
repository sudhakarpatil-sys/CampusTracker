/**
 * Hand-authored types mirroring supabase/migrations/0001_init.sql and
 * 0002_academic_system.sql. Regenerate with `supabase gen types typescript`
 * once the project is linked, and replace this file — see supabase/README.md.
 *
 * Shape follows @supabase/postgrest-js's GenericSchema exactly (Tables need
 * Row/Insert/Update/Relationships; the schema needs Tables/Views/Functions)
 * — omitting any of these makes the generated query builder types collapse
 * to `never`.
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

type Table<Row extends Record<string, unknown>, InsertExtra extends keyof Row = never> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, InsertExtra>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          college_name: string | null;
          university: string | null;
          department: string | null;
          branch: string | null;
          semester: string | null;
          academic_year: string | null;
          roll_number: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        },
        "id"
      >;
      user_preferences: Table<
        {
          id: string;
          user_id: string;
          theme: "light" | "dark" | "system";
          dashboard_layout: Json;
          notification_prefs: Json;
          timetable_settings: Json;
          created_at: string;
          updated_at: string;
        },
        "user_id"
      >;
      notifications: Table<
        {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: "info" | "success" | "warning" | "error";
          read: boolean;
          created_at: string;
        },
        "user_id" | "title" | "message"
      >;
      subjects: Table<
        {
          id: string;
          user_id: string;
          name: string;
          code: string | null;
          faculty_name: string | null;
          classroom: string | null;
          credits: number | null;
          attendance_target: number;
          color: string;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        },
        "user_id" | "name"
      >;
      timetable_slots: Table<
        {
          id: string;
          user_id: string;
          subject_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          faculty_name: string | null;
          classroom: string | null;
          created_at: string;
          updated_at: string;
        },
        "user_id" | "subject_id" | "day_of_week" | "start_time" | "end_time"
      >;
      attendance_records: Table<
        {
          id: string;
          user_id: string;
          subject_id: string;
          timetable_slot_id: string | null;
          class_date: string;
          status: "present" | "absent" | "cancelled";
          created_at: string;
          updated_at: string;
        },
        "user_id" | "subject_id" | "class_date" | "status"
      >;
      assignments: Table<
        {
          id: string;
          user_id: string;
          subject_id: string | null;
          title: string;
          description: string | null;
          due_date: string | null;
          due_time: string | null;
          priority: "low" | "medium" | "high";
          status: "not_started" | "in_progress" | "submitted" | "completed";
          attachments: Json;
          notes: string | null;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        },
        "user_id" | "title"
      >;
      notes: Table<
        {
          id: string;
          user_id: string;
          subject_id: string | null;
          title: string;
          content: string;
          attachments: Json;
          created_at: string;
          updated_at: string;
        },
        "user_id"
      >;
      tasks: Table<
        {
          id: string;
          user_id: string;
          title: string;
          due_date: string | null;
          priority: "low" | "medium" | "high";
          is_completed: boolean;
          created_at: string;
          updated_at: string;
        },
        "user_id" | "title"
      >;
      events: Table<
        {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: "college" | "workshop" | "hackathon" | "club" | "personal";
          event_date: string;
          start_time: string | null;
          end_time: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        },
        "user_id" | "title" | "event_date"
      >;
      exams: Table<
        {
          id: string;
          user_id: string;
          subject_id: string | null;
          exam_date: string;
          exam_time: string | null;
          venue: string | null;
          syllabus: string | null;
          preparation_status: "not_started" | "in_progress" | "ready";
          created_at: string;
          updated_at: string;
        },
        "user_id" | "exam_date"
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserPreferences = Database["public"]["Tables"]["user_preferences"]["Row"];
export type AppNotification = Database["public"]["Tables"]["notifications"]["Row"];
export type Subject = Database["public"]["Tables"]["subjects"]["Row"];
export type TimetableSlot = Database["public"]["Tables"]["timetable_slots"]["Row"];
export type AttendanceRecord = Database["public"]["Tables"]["attendance_records"]["Row"];
export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type CalendarEvent = Database["public"]["Tables"]["events"]["Row"];
export type Exam = Database["public"]["Tables"]["exams"]["Row"];
