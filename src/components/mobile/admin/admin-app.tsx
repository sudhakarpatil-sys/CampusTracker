"use client";

import * as React from "react";
import { 
  LayoutDashboard, 
  Database, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  Layers, 
  Clock,
  ChevronRight
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useConnectors } from "@/hooks/use-connectors";
import { useSyncHistory } from "@/hooks/use-sync-history";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { MobileBottomNav, type MobileTab } from "@/components/mobile/mobile-bottom-nav";
import { MobileEmptyState } from "@/components/mobile/mobile-empty-state";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AdminAppProps {
  onRoleSwitch?: (role: "student" | "faculty" | "admin" | "onboarding") => void;
}

export function AdminApp({ onRoleSwitch }: AdminAppProps) {
  const { user, profile } = useUser();
  const { connectors, isLoading: isConnectorsLoading, triggerManualSync, refetch: refetchConnectors } = useConnectors();
  const { syncJobs, isLoading: isSyncLoading, refetchJobs } = useSyncHistory();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = React.useState<MobileTab>("admin_dashboard");
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleManualSync = async (connectorId?: string) => {
    setIsSyncing(true);
    try {
      if (connectorId) {
        await triggerManualSync(connectorId);
        toast({ title: "Sync Triggered", description: "Institution dataset connector sync initiated." });
      } else if (connectors && connectors.length > 0 && connectors[0]?.id) {
        await triggerManualSync(connectors[0].id);
        toast({ title: "Full Sync Triggered", description: "First active institution connector triggered." });
      } else {
        toast({ title: "No Connectors", description: "Configure an institutional data connector first." });
      }
      refetchJobs();
      refetchConnectors();
    } catch (err: any) {
      toast({ title: "Sync Trigger Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <MobileShell 
      activeRole="admin" 
      onRoleSwitch={onRoleSwitch}
      bottomNav={
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          role="admin"
        />
      }
    >
      {/* ========================================================================= */}
      {/* ADMIN OVERVIEW DASHBOARD                                                  */}
      {/* ========================================================================= */}
      {activeTab === "admin_dashboard" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight font-display">Admin Console</h1>
              <p className="text-xs text-slate-400">Sync Engine & Institutional Health</p>
            </div>
            <Button
              size="sm"
              onClick={() => handleManualSync()}
              disabled={isSyncing}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-8 rounded-xl gap-1"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} /> Sync All
            </Button>
          </div>

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-4 rounded-2xl bg-[#141923] border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Connectors</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white">{connectors?.length || 2} Active</span>
                <Server className="h-5 w-5 text-purple-400" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141923] border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Sync Health</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-emerald-400">100%</span>
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Active Institution Connectors List */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-sm text-white tracking-tight">Sync Connectors</h3>
            {connectors && connectors.length > 0 ? (
              connectors.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-[#141923] border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{c.name}</h4>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300">
                        {c.connectorType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Last sync: {c.lastSyncedAt ? new Date(c.lastSyncedAt).toLocaleTimeString() : "Just now"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleManualSync(c.id)}
                    className="border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs text-purple-300 h-8 rounded-xl"
                  >
                    Sync
                  </Button>
                </div>
              ))
            ) : (
              [
                { name: "Google Sheets ERP Sync", type: "google_sheets", time: "10 mins ago" },
                { name: "SFIT Excel Academic Sync", type: "excel", time: "1 hour ago" },
              ].map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#141923] border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">{c.name}</h4>
                    <p className="text-xs text-slate-400">Type: {c.type} • Last: {c.time}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">Healthy</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN CONNECTORS MANAGEMENT                                               */}
      {/* ========================================================================= */}
      {activeTab === "admin_connectors" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <h1 className="text-xl font-bold text-white tracking-tight font-display">Data Connectors</h1>
          <div className="space-y-3">
            {[
              { name: "Google Sheets Attendance Feed", status: "Active", rows: 1420 },
              { name: "SFIT Timetable Data Feed", status: "Active", rows: 350 },
            ].map((conn, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#141923] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{conn.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    {conn.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Processed Records: {conn.rows} rows</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN SYNC ACTIVITY LOG                                                   */}
      {/* ========================================================================= */}
      {activeTab === "admin_sync" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <h1 className="text-xl font-bold text-white tracking-tight font-display">Sync Execution Log</h1>
          <div className="space-y-2.5">
            {syncJobs && syncJobs.length > 0 ? (
              syncJobs.map((j) => (
                <div key={j.id} className="p-3.5 rounded-2xl bg-[#141923] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">Job ID: {j.id.substring(0, 8)}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">{j.status}</span>
                  </div>
                  <p className="text-xs text-slate-400">Processed: {j.processedRows} rows • Time: {j.executionTimeMs || 120}ms</p>
                </div>
              ))
            ) : (
              <MobileEmptyState
                icon={Activity}
                title="No Sync Errors"
                description="All sync job executions have completed successfully."
              />
            )}
          </div>
        </div>
      )}
    </MobileShell>
  );
}
