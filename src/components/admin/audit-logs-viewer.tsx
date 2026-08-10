"use client";

import * as React from "react";
import { ShieldCheck, Search, Filter, RefreshCw, User, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import { cn, formatDate } from "@/lib/utils";

export function AuditLogsViewerContent() {
  const { data: logsData, isLoading, refetch } = useSupabaseCollection<any>({
    table: "audit_logs",
    orderBy: { column: "created_at", ascending: false },
  });

  const [search, setSearch] = React.useState("");

  const filteredLogs = React.useMemo(() => {
    if (!logsData) return [];
    if (!search.trim()) return logsData;
    const q = search.toLowerCase();
    return logsData.filter(
      (l: any) =>
        l.action?.toLowerCase().includes(q) ||
        l.entity_type?.toLowerCase().includes(q) ||
        l.user_id?.toLowerCase().includes(q)
    );
  }, [logsData, search]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Security & System Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground">
            Immutable audit record of administrative actions, connector alterations, and sync operations.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 gap-1.5 text-xs">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Audit Trail
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by action, resource, or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      {/* Table */}
      <Card className="glass-shelf overflow-hidden">
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No audit logs recorded"
              description={search ? "Try adjusting your search query." : "Audit log events will appear here as administrative actions occur."}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 bg-muted/40 font-mono uppercase text-[10px] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Resource Entity</th>
                    <th className="px-4 py-3">Entity ID</th>
                    <th className="px-4 py-3">User ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground font-mono">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        <Badge variant="outline" className="text-[10px] font-mono border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono">
                        {log.entity_type || "system"}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                        {log.entity_id ? `${log.entity_id.substring(0, 8)}...` : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                        {log.user_id ? `${log.user_id.substring(0, 8)}...` : "system"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
