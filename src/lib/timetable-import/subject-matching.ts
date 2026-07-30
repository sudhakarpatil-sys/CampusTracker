/**
 * Common abbreviation → full name expansions, extended with the ones
 * observed in a real MIT Mumbai CSE/AIML/IT/EE timetable. Intentionally a
 * starting point, not exhaustive — the AI prompt also expands
 * abbreviations using document context; this mainly normalizes AI output
 * before matching against a student's existing subjects.
 */
const KNOWN_ABBREVIATIONS: Record<string, string> = {
  aoa: "Analysis of Algorithms",
  coa: "Computer Organization & Architecture",
  fsjp: "Full Stack Java Programming",
  mce: "Mathematics for Computer Engineering",
  ed: "Entrepreneurship Development",
  evs: "Environmental Science",
  ese: "Environmental Science for Engineers",
  oe: "Open Elective",
  dsa: "Data Structures and Algorithms",
  os: "Operating Systems",
  cn: "Computer Networks",
  dbms: "Database Management Systems",
  se: "Software Engineering",
  toc: "Theory of Computation",
  at: "Automata Theory",
  amt: "Applied Mathematics Thinking",
  dmsa: "Database Management System & Application",
  enas: "Electrical Networks Analysis & Synthesis",
  miii: "Mathematics-III",
  eds: "Embedded Design & Systems",
};

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function expandKnownAbbreviation(name: string): string {
  return KNOWN_ABBREVIATIONS[normalize(name)] ?? name;
}

/**
 * Cheap, dependency-free similarity — good enough for short subject
 * names/codes, not general-purpose fuzzy search.
 */
function similarity(a: string, b: string): number {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  if (x.includes(y) || y.includes(x)) return 0.85;

  const dp: number[][] = Array.from({ length: x.length + 1 }, () => new Array(y.length + 1).fill(0));
  for (let i = 0; i <= x.length; i++) dp[i]![0] = i;
  for (let j = 0; j <= y.length; j++) dp[0]![j] = j;
  for (let i = 1; i <= x.length; i++) {
    for (let j = 1; j <= y.length; j++) {
      dp[i]![j] = x[i - 1] === y[j - 1] ? dp[i - 1]![j - 1]! : 1 + Math.min(dp[i - 1]![j - 1]!, dp[i - 1]![j]!, dp[i]![j - 1]!);
    }
  }
  return 1 - dp[x.length]![y.length]! / Math.max(x.length, y.length);
}

const MATCH_THRESHOLD = 0.82;

export interface ExistingSubject {
  id: string;
  name: string;
  code: string | null;
}

/**
 * Resolves an AI-detected subject against the student's existing subjects.
 * Deliberately conservative — near-exact match only. Ambiguous cases fall
 * through as "create new" rather than risk silently merging two distinct
 * subjects (e.g. a real timetable has both "OE" as a short generic label
 * and "Open Elective (Financial Management)" as its full form on
 * different pages — these should resolve to the same subject once
 * abbreviation-expanded, but two genuinely different subjects should not).
 */
export function matchExistingSubject(
  detectedName: string,
  detectedCode: string | null,
  existingSubjects: ExistingSubject[]
): ExistingSubject | null {
  const expandedName = expandKnownAbbreviation(detectedName);
  let best: { subject: ExistingSubject; score: number } | null = null;

  for (const existing of existingSubjects) {
    const nameScore = Math.max(similarity(expandedName, existing.name), similarity(detectedName, existing.name));
    const codeScore = detectedCode && existing.code ? similarity(detectedCode, existing.code) : 0;
    const score = Math.max(nameScore, codeScore);
    if (score >= MATCH_THRESHOLD && (!best || score > best.score)) {
      best = { subject: existing, score };
    }
  }
  return best?.subject ?? null;
}
