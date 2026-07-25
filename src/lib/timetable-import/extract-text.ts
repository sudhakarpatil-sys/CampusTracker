import pdfParse from "pdf-parse";

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
}

/**
 * Deterministic, no-AI text extraction from a PDF's existing text layer.
 * Always tried first, per "extract text directly before OCR" — cheaper,
 * faster, and exact where it works. Verified against a real 4-page
 * multi-branch MIT timetable PDF: extracts cleanly, ~600+ chars/page.
 */
export async function extractPdfText(buffer: Buffer): Promise<PdfExtractionResult> {
  const result = await pdfParse(buffer);
  return { text: result.text ?? "", pageCount: result.numpages ?? 1 };
}

/**
 * Below this density, a PDF's "text layer" is almost certainly noise (a
 * handful of stray characters from a scanned image's embedded metadata)
 * rather than real content. Below the threshold, the document is treated
 * as scanned/image-only and handed to the vision-capable AI step instead
 * of trusting this text.
 */
const MIN_CHARS_PER_PAGE = 40;

export function hasUsableTextLayer(text: string, pageCount: number): boolean {
  const density = text.trim().length / Math.max(pageCount, 1);
  return density >= MIN_CHARS_PER_PAGE;
}
