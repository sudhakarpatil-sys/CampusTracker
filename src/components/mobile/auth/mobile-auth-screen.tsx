"use client";

import * as React from "react";
import { 
  Sparkles, 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Building,
  KeyRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { detectRoleFromEmail } from "@/lib/validations/auth";

interface MobileAuthScreenProps {
  onSuccessLogin?: (role: "student" | "faculty" | "admin" | "onboarding") => void;
}

export function MobileAuthScreen({ onSuccessLogin }: MobileAuthScreenProps) {
  const [authMode, setAuthMode] = React.useState<"login" | "signup">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const detectedRole = React.useMemo(() => {
    return detectRoleFromEmail(email);
  }, [email]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    if (authMode === "signup" && password !== confirmPassword) {
      toast({ title: "Password mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      if (authMode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        toast({ title: "Welcome back!", description: `Signed in as ${data.user.email}` });
        
        // Fetch role from profile or use detected role
        const { data: prof } = await supabase.from("profiles").select("role, onboarding_completed").eq("id", data.user.id).single();
        const role = prof?.role || detectedRole;
        
        if (onSuccessLogin) {
          onSuccessLogin(role as any);
        } else {
          window.location.reload();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;

        toast({ 
          title: "Account Created!", 
          description: detectedRole === "faculty" 
            ? "Official Faculty email detected! Redirecting to Faculty Portal..." 
            : "Welcome to CampusTracker! Let's set up your profile." 
        });

        if (onSuccessLogin) {
          onSuccessLogin(detectedRole === "faculty" ? "faculty" : "onboarding");
        } else {
          window.location.reload();
        }
      }
    } catch (err: any) {
      toast({ title: "Authentication Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-4 sm:p-6 bg-[#0B0F17] text-white animate-in fade-in duration-300">
      {/* Brand Header */}
      <div className="space-y-4 text-center pt-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 p-0.5 mx-auto shadow-2xl shadow-purple-500/30">
          <div className="w-full h-full bg-[#0E131F] rounded-[22px] flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-white font-display">CampusTracker</h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Official Academic Hub & ERP Attendance Engine
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setAuthMode("login")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === "login"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("signup")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === "signup"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Auth Card */}
      <div className="my-6 p-5 rounded-3xl bg-[#141923] border border-slate-800/80 shadow-2xl space-y-4">
        {/* Dynamic Role Badge Indicator */}
        {email.length > 3 && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-purple-400" /> Domain Detection:
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {detectedRole === "faculty" ? "Faculty Member" : detectedRole === "admin" ? "Administrator" : "Student"}
            </span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-3.5">
          {authMode === "signup" && (
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="e.g. Prof. Rajesh Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9 bg-slate-900 border-slate-800 text-white rounded-xl h-10 text-xs focus:border-purple-500"
                  required={authMode === "signup"}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300">College / Institutional Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                type="email"
                placeholder="prof@college.edu.in or roll@student.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-slate-900 border-slate-800 text-white rounded-xl h-10 text-xs focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-slate-300">Password</Label>
              {authMode === "login" && (
                <button type="button" className="text-[11px] text-purple-400 hover:underline">
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-slate-900 border-slate-800 text-white rounded-xl h-10 text-xs focus:border-purple-500"
                required
              />
            </div>
          </div>

          {authMode === "signup" && (
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Confirm Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 bg-slate-900 border-slate-800 text-white rounded-xl h-10 text-xs focus:border-purple-500"
                  required
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold h-11 rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{authMode === "login" ? "Sign In to CampusTracker" : "Create Account & Get Started"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="text-center space-y-2 pb-2">
        <p className="text-[11px] text-slate-500">
          Official College Management Engine • Protected by Supabase Auth
        </p>
      </div>
    </div>
  );
}
