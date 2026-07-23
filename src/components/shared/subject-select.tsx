"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Subject } from "@/types/database.types";

interface SubjectSelectProps {
  subjects: Subject[];
  value?: string;
  onChange: (subjectId: string) => void;
  placeholder?: string;
  allowNone?: boolean;
}

export function SubjectSelect({ subjects, value, onChange, placeholder = "Select subject", allowNone }: SubjectSelectProps) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowNone && <SelectItem value="none">No subject</SelectItem>}
        {subjects.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
