"use client";

import * as React from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen,
  ChevronRight,
  User,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StudentOnboardingProps {
  onComplete: () => void;
}

export function FirstTimeStudentOnboarding({ onComplete }: StudentOnboardingProps) {
  const [slide, setSlide] = React.useState<number>(1);
  const [fullName, setFullName] = React.useState("Campus Student");
  const [dept, setDept] = React.useState("Computer Science & Engineering");
  const [semester, setSemester] = React.useState("3");
  const [rollNo, setRollNo] = React.useState("22CSE104");

  return (
    <div className="w-full min-h-[750px] flex flex-col justify-between p-5 bg-gradient-to-b from-[#141923] via-[#0B0F17] to-[#0B0F17] rounded-3xl text-white relative overflow-hidden">
      
      {/* Background Decorative Ambient Orbs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Step Bar */}
      <div className="relative z-10 flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">CampusTracker Mobile</span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                slide === s ? "w-6 bg-purple-500" : "w-2 bg-slate-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* SLIDE 1: WELCOME & VISION */}
      {slide === 1 && (
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6 animate-in fade-in slide-in-from-right duration-300 my-auto">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-500/30 ring-4 ring-purple-500/20">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Official Student Companion
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-display leading-tight">
              Welcome to Your Academic Hub
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Track attendance, simulate safe leave, view official timetables, and access course notes directly synced from your institution.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <p className="font-bold text-xs text-white">75% Attendance Engine</p>
              <p className="text-[10px] text-slate-400">Automated threshold & safe leave alerts</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <Clock className="h-5 w-5 text-purple-400" />
              <p className="font-bold text-xs text-white">Realtime Schedule</p>
              <p className="text-[10px] text-slate-400">Class slots, room numbers & faculty</p>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 2: FEATURE HIGHLIGHTS */}
      {slide === 2 && (
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-5 animate-in fade-in slide-in-from-right duration-300 my-auto">
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Intelligent Features</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Built for Academic Clarity</h2>
            <p className="text-xs text-slate-400">No manual entry required. Your data is synced automatically.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: ShieldCheck,
                color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20",
                title: "Safe-Leave Engine™",
                desc: "Predicts exactly how many lectures you can miss while staying safe above 75%.",
              },
              {
                icon: Clock,
                color: "text-purple-400 bg-purple-500/15 border-purple-500/20",
                title: "Live Class Timeline",
                desc: "Pulsing indicators for ongoing lectures, upcoming rooms, and completed slots.",
              },
              {
                icon: BookOpen,
                color: "text-blue-400 bg-blue-500/15 border-blue-500/20",
                title: "Course Resources & Marks",
                desc: "Read class notes, check internal marks, and view midterm/endterm SGPA results.",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                  <div className={`p-2 rounded-xl border shrink-0 ${f.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{f.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SLIDE 3: STUDENT PROFILE CONFIRMATION */}
      {slide === 3 && (
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-right duration-300 my-auto">
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Step 3 of 3</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Confirm Academic Profile</h2>
            <p className="text-xs text-slate-400">Verify your student enrollment details.</p>
          </div>

          <div className="space-y-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="text-[11px] font-medium text-slate-400">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9 bg-slate-950 border-slate-800 text-white text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-400">Department</label>
              <div className="relative mt-1">
                <Building className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="pl-9 bg-slate-950 border-slate-800 text-white text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-slate-400">Semester</label>
                <Input
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-xs h-10 rounded-xl mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400">Roll Number</label>
                <Input
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-xs h-10 rounded-xl mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Control Bar */}
      <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        {slide > 1 ? (
          <button
            type="button"
            onClick={() => setSlide((s) => s - 1)}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-2 py-1"
          >
            Back
          </button>
        ) : (
          <span className="text-[10px] text-slate-500">Step 1 of 3</span>
        )}

        {slide < 3 ? (
          <Button
            type="button"
            onClick={() => setSlide((s) => s + 1)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold h-10 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/25"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onComplete}
            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:opacity-95 text-white font-bold h-10 px-6 rounded-xl flex items-center gap-2 cursor-pointer shadow-xl shadow-purple-500/40"
          >
            Launch Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
