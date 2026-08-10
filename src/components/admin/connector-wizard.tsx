"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ColumnMapper } from "@/components/admin/column-mapper";
import { SheetConnector } from "@/lib/sync-engine/sheet-connector";
import type { FieldMapping, SyncFrequency } from "@/types/sync";
import { CheckCircle2, AlertCircle, RefreshCw, Sparkles } from "lucide-react";

interface ConnectorWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    connectorType: "google_sheets" | "excel" | "csv" | "erp_api";
    config: Record<string, any>;
    fieldMappings: FieldMapping[];
    syncFrequency: SyncFrequency;
  }) => Promise<any>;
}

export function ConnectorWizard({ open, onOpenChange, onSubmit }: ConnectorWizardProps) {
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState("");
  const [datasetType, setDatasetType] = React.useState("student_master");
  const [sheetUrl, setSheetUrl] = React.useState("");
  const [worksheetName, setWorksheetName] = React.useState("Sheet1");
  const [headerRowIndex, setHeaderRowIndex] = React.useState(1);
  const [dataStartRowIndex, setDataStartRowIndex] = React.useState(2);
  const [syncFrequency, setSyncFrequency] = React.useState<SyncFrequency>("daily");
  const [fieldMappings, setFieldMappings] = React.useState<FieldMapping[]>([]);
  const [detectedHeaders, setDetectedHeaders] = React.useState<string[]>([]);
  const [testResult, setTestResult] = React.useState<{
    isHealthy?: boolean;
    status?: string;
    message?: string;
    latencyMs?: number;
  } | null>(null);
  const [isTesting, setIsTesting] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function resetForm() {
    setStep(1);
    setName("");
    setDatasetType("student_master");
    setSheetUrl("");
    setWorksheetName("Sheet1");
    setHeaderRowIndex(1);
    setDataStartRowIndex(2);
    setSyncFrequency("daily");
    setFieldMappings([]);
    setDetectedHeaders([]);
    setTestResult(null);
  }

  async function handleTestConnection() {
    setIsTesting(true);
    setTestResult(null);

    const helper = new SheetConnector();
    const parsed = helper.extractSpreadsheetId(sheetUrl);

    try {
      const res = await fetch("/api/sync/connectors/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectorType: "google_sheets",
          config: {
            sheetUrl,
            spreadsheetId: parsed?.spreadsheetId,
            gid: parsed?.gid || "0",
            worksheetName,
            headerRowIndex,
            dataStartRowIndex,
          },
          fieldMappings,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setTestResult(json.data);
        if (json.data.detectedHeaders) {
          setDetectedHeaders(json.data.detectedHeaders);
        }
      } else {
        setTestResult({
          isHealthy: false,
          status: "CONFIG_ERROR",
          message: json.error?.message || "Test request failed",
        });
      }
    } catch (err: any) {
      setTestResult({
        isHealthy: false,
        status: "NETWORK_ERROR",
        message: err.message,
      });
    } finally {
      setIsTesting(false);
    }
  }

  async function handleFinish() {
    if (!name.trim()) return;
    setIsSubmitting(true);

    const helper = new SheetConnector();
    const parsed = helper.extractSpreadsheetId(sheetUrl);

    try {
      await onSubmit({
        name,
        connectorType: "google_sheets",
        config: {
          sheetUrl,
          spreadsheetId: parsed?.spreadsheetId,
          gid: parsed?.gid || "0",
          worksheetName,
          headerRowIndex,
          dataStartRowIndex,
          datasetType,
          healthStatus: testResult?.isHealthy ? "CONNECTED" : "DISCONNECTED",
        },
        fieldMappings,
        syncFrequency,
      });

      onOpenChange(false);
      resetForm();
    } catch (err) {
      // Handled by hook toast
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if (!val) resetForm(); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="font-display text-lg">Configure Google Sheets Connector</DialogTitle>
            <Badge variant="outline" className="border-indigo-500/30 text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
              Step {step} of 3
            </Badge>
          </div>
          <DialogDescription className="text-xs">
            Connect live Google Sheets spreadsheets to sync official student, attendance, and marks datasets automatically.
          </DialogDescription>
        </DialogHeader>

        {/* Wizard Steps */}
        <div className="py-2 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Connector Name</Label>
                <Input
                  placeholder="e.g. CSE Department Attendance Sheet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Target Academic Dataset</Label>
                <Select value={datasetType} onValueChange={setDatasetType}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student_master" className="text-xs">Student Master Registry</SelectItem>
                    <SelectItem value="attendance" className="text-xs">Attendance Records</SelectItem>
                    <SelectItem value="internal_marks" className="text-xs">Internal Assessment Marks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Google Sheet Public Shareable URL</Label>
                <Input
                  placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?gid=0"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Sheet must be shared as &quot;Anyone with the link can view&quot; or accessible via service account.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Header Row Index</Label>
                  <Input
                    type="number"
                    min={1}
                    value={headerRowIndex}
                    onChange={(e) => setHeaderRowIndex(parseInt(e.target.value, 10) || 1)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Data Start Row Index</Label>
                  <Input
                    type="number"
                    min={2}
                    value={dataStartRowIndex}
                    onChange={(e) => setDataStartRowIndex(parseInt(e.target.value, 10) || 2)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Synchronization Frequency (Polling Interval)</Label>
                <Select value={syncFrequency} onValueChange={(val: any) => setSyncFrequency(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual" className="text-xs">Manual Sync Only</SelectItem>
                    <SelectItem value="hourly" className="text-xs">Hourly (Every 60 minutes)</SelectItem>
                    <SelectItem value="daily" className="text-xs">Daily (Once per day)</SelectItem>
                    <SelectItem value="weekly" className="text-xs">Weekly (Once per week)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Automated background polling checks the Google Sheet export for modifications and ingests changes seamlessly.
                </p>
              </div>

              <ColumnMapper
                datasetType={datasetType}
                detectedHeaders={detectedHeaders}
                fieldMappings={fieldMappings}
                onChange={setFieldMappings}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2 text-xs">
                <h4 className="font-semibold text-foreground">Connector Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>Name: <span className="font-medium text-foreground">{name}</span></div>
                  <div>Dataset: <span className="font-medium text-foreground capitalize">{datasetType}</span></div>
                  <div>Frequency: <span className="font-medium text-foreground capitalize">{syncFrequency}</span></div>
                  <div>Mappings: <span className="font-medium text-foreground">{fieldMappings.length} fields</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 p-3.5">
                <div>
                  <p className="text-xs font-semibold text-foreground">Test Source Connection</p>
                  <p className="text-[11px] text-muted-foreground">Verify Google Sheet URL, CSV exportability, and headers.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={isTesting || !sheetUrl.trim()}
                  className="h-8 gap-1.5 text-xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? "animate-spin" : ""}`} />
                  {isTesting ? "Testing..." : "Test Connection"}
                </Button>
              </div>

              {testResult && (
                <div className={`rounded-xl border p-3.5 text-xs flex items-start gap-2.5 ${
                  testResult.isHealthy
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}>
                  {testResult.isHealthy ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{testResult.isHealthy ? "Connection Successful" : "Connection Failed"}</p>
                    <p className="mt-0.5 text-[11px] opacity-90">{testResult.message}</p>
                    {testResult.latencyMs && (
                      <p className="mt-1 font-mono text-[10px]">Response latency: {testResult.latencyMs}ms</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          {step > 1 ? (
            <Button variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          ) : <div />}

          {step < 3 ? (
            <Button
              size="sm"
              disabled={step === 1 && (!name.trim() || !sheetUrl.trim())}
              onClick={() => setStep((s) => s + 1)}
            >
              Next Step
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={isSubmitting || !name.trim() || !sheetUrl.trim()}
              onClick={handleFinish}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
            >
              {isSubmitting ? "Activating..." : "Save & Activate Connector"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
