"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Search,
  FileText,
  ExternalLink,
  BookOpen,
  Sparkles,
  Download,
  Filter,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { useSubjects } from "@/hooks/use-subjects";

export interface StudentResource {
  id: string;
  title: string;
  category: "syllabus" | "slides" | "lab_manual" | "reference_link";
  url: string;
  subjectName?: string;
  subjectCode?: string;
  facultyName?: string;
  createdAt: string;
}

const INITIAL_RESOURCES: StudentResource[] = [
  {
    id: "res_01",
    title: "Database Management Systems — Unit 1 & 2 Lecture Slides",
    category: "slides",
    url: "https://docs.google.com/presentation/d/demo",
    subjectName: "Database Systems",
    subjectCode: "CS301",
    facultyName: "Dr. Rajesh Sharma",
    createdAt: new Date().toISOString(),
  },
  {
    id: "res_02",
    title: "Official Operating Systems Lab Manual 2026",
    category: "lab_manual",
    url: "https://docs.google.com/document/d/demo",
    subjectName: "Operating Systems",
    subjectCode: "CS302",
    facultyName: "Prof. Ananya Sen",
    createdAt: new Date().toISOString(),
  },
  {
    id: "res_03",
    title: "Computer Networks — Official Syllabus & Marking Scheme",
    category: "syllabus",
    url: "https://drive.google.com/file/d/demo",
    subjectName: "Computer Networks",
    subjectCode: "CS303",
    facultyName: "Dr. Vikram Sethi",
    createdAt: new Date().toISOString(),
  },
  {
    id: "res_04",
    title: "Data Structures & Algorithms — Interactive Visualization Tool",
    category: "reference_link",
    url: "https://visualgo.net",
    subjectName: "Data Structures",
    subjectCode: "CS201",
    facultyName: "Dr. Rajesh Sharma",
    createdAt: new Date().toISOString(),
  },
];

export function StudentResourcesContent() {
  const { subjects } = useSubjects();
  const [resources] = React.useState<StudentResource[]>(INITIAL_RESOURCES);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");

  const filteredResources = React.useMemo(() => {
    return resources.filter((res) => {
      const matchesSearch =
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.facultyName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || res.category === selectedCategory;
      const matchesSubject = selectedSubject === "all" || res.subjectName === selectedSubject;

      return matchesSearch && matchesCategory && matchesSubject;
    });
  }, [resources, searchQuery, selectedCategory, selectedSubject]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Course Resources & Study Materials
            </h1>
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Faculty Hub
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Access official course syllabi, lecture slides, lab manuals, and faculty reference links.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="glass-shelf p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources, topics, or faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-9 w-[160px] text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Categories</SelectItem>
                <SelectItem value="slides" className="text-xs">Lecture Slides</SelectItem>
                <SelectItem value="lab_manual" className="text-xs">Lab Manuals</SelectItem>
                <SelectItem value="syllabus" className="text-xs">Syllabi</SelectItem>
                <SelectItem value="reference_link" className="text-xs">Reference Links</SelectItem>
              </SelectContent>
            </Select>

            {subjects.length > 0 && (
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="h-9 w-[160px] text-xs">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Subjects</SelectItem>
                  {subjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.name} className="text-xs">
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </Card>

      {/* Resource Grid */}
      {filteredResources.length === 0 ? (
        <Card className="glass-shelf p-12">
          <EmptyState
            icon={FolderKanban}
            title="No study resources found"
            description="Try adjusting your search query or category filters."
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((res, i) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="glass-shelf group relative flex h-full flex-col justify-between overflow-hidden p-5 transition-all duration-200 hover:border-indigo-500/40 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] uppercase font-mono border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10">
                      {res.category.replace("_", " ")}
                    </Badge>
                    {res.subjectCode && (
                      <span className="font-mono text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                        {res.subjectCode}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 font-display text-sm font-bold text-foreground leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {res.title}
                  </h3>

                  {res.subjectName && (
                    <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{res.subjectName}</span>
                    </p>
                  )}

                  {res.facultyName && (
                    <p className="mt-1 text-[11px] text-muted-foreground font-mono">
                      Uploaded by: {res.facultyName}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px]">
                    {res.url}
                  </span>

                  <Button size="sm" variant="outline" className="h-8 gap-1 text-xs hover:bg-indigo-500/10 hover:text-indigo-600 hover:border-indigo-500/30" asChild>
                    <a href={res.url} target="_blank" rel="noopener noreferrer">
                      Open Resource <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
