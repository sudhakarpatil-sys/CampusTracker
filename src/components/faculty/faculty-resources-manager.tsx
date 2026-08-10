"use client";

import * as React from "react";
import { FolderKanban, Plus, FileText, Link2, Download, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useFaculty } from "@/hooks/use-faculty";
import { toast } from "@/hooks/use-toast";

export interface AcademicResource {
  id: string;
  title: string;
  category: "syllabus" | "slides" | "lab_manual" | "reference_link";
  url: string;
  subjectId?: string;
  createdAt: string;
}

export function FacultyResourcesManagerContent() {
  const { assignedSubjects } = useFaculty();
  const [resources, setResources] = React.useState<AcademicResource[]>([
    {
      id: "res_01",
      title: "DBMS Lecture Slides — Unit 1 & 2",
      category: "slides",
      url: "https://docs.google.com/presentation/d/demo",
      createdAt: new Date().toISOString(),
    },
    {
      id: "res_02",
      title: "Official Operating Systems Lab Manual 2026",
      category: "lab_manual",
      url: "https://docs.google.com/document/d/demo",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<any>("slides");
  const [url, setUrl] = React.useState("");
  const [subjectId, setSubjectId] = React.useState("");

  function handleAddResource() {
    if (!title.trim() || !url.trim()) return;

    const newRes: AcademicResource = {
      id: `res_${Date.now()}`,
      title,
      category,
      url,
      subjectId: subjectId || undefined,
      createdAt: new Date().toISOString(),
    };

    setResources([newRes, ...resources]);
    toast({ title: "Resource added", description: `'${title}' is now accessible to students.` });
    setTitle("");
    setUrl("");
  }

  function handleDeleteResource(id: string) {
    setResources(resources.filter((r) => r.id !== id));
    toast({ title: "Resource removed" });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Learning Resource Repository
        </h1>
        <p className="text-sm text-muted-foreground">
          Repository for sharing course syllabi, lab manuals, lecture slides, and reference links with students.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add Resource Form */}
        <Card className="glass-shelf lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4 text-indigo-500" /> Share Resource
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Resource Title</label>
              <Input
                placeholder="e.g. Unit 2 — OS Process Synchronization Slides"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Category</label>
              <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slides" className="text-xs">Lecture Slides</SelectItem>
                  <SelectItem value="lab_manual" className="text-xs">Lab Manual</SelectItem>
                  <SelectItem value="syllabus" className="text-xs">Syllabus</SelectItem>
                  <SelectItem value="reference_link" className="text-xs">Reference Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Resource Link / Document URL</label>
              <Input
                placeholder="https://drive.google.com/file/d/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>

            <Button
              onClick={handleAddResource}
              disabled={!title.trim() || !url.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Share Resource
            </Button>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <Card className="glass-shelf lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Shared Learning Resources ({resources.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {resources.length === 0 ? (
              <EmptyState
                icon={FolderKanban}
                title="No resources shared yet"
                description="Share course materials, PDFs, and slide links with your classes."
              />
            ) : (
              <div className="space-y-3">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 p-3.5 transition-all hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{res.title}</p>
                          <Badge variant="outline" className="text-[10px] uppercase font-mono border-indigo-500/30 text-indigo-500">
                            {res.category.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-sm mt-0.5">
                          {res.url}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <a href={res.url} target="_blank" rel="noopener noreferrer" title="Open Link">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteResource(res.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                        title="Delete Resource"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
