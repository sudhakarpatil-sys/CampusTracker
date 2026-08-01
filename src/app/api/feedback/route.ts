import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { withErrorHandler, createSuccessResponse } from "@/lib/api-error";
import { requireAuth, validateRequestBody } from "@/lib/validate-request";
import { feedbackRateLimiter } from "@/lib/rate-limit";
import { sanitizeString, sanitizeMarkdown } from "@/lib/sanitize";
import { logAuditEvent, AuditAction } from "@/lib/audit-log";
import { MAX_FEEDBACK_LENGTH } from "@/lib/validations/constants";

const feedbackSchema = z.object({
  category: z.enum(["bug", "feature", "ui_ux", "performance", "general"]),
  description: z.string().min(10, "Please write at least 10 characters").max(MAX_FEEDBACK_LENGTH),
  pageUrl: z.string().max(2000).optional(),
  browserInfo: z.record(z.unknown()).optional(),
  deviceInfo: z.record(z.unknown()).optional(),
});

export const POST = withErrorHandler(async (request: Request) => {
  // Rate limit: 5 submissions per hour per IP.
  feedbackRateLimiter.check(request);

  const supabase = await createClient();
  const user = await requireAuth(supabase);
  const data = await validateRequestBody(request, feedbackSchema);

  const { error } = await (supabase as unknown as { from: (table: string) => { insert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }> } }).from("feedback").insert({
    user_id: user.id,
    category: data.category,
    description: sanitizeMarkdown(data.description),
    page_url: data.pageUrl ? sanitizeString(data.pageUrl) : null,
    browser_info: data.browserInfo ?? {},
    device_info: data.deviceInfo ?? {},
  });

  if (error) {
    throw new Error(error.message);
  }

  logAuditEvent(supabase, user.id, {
    action: AuditAction.FEEDBACK_SUBMIT,
    entityType: "feedback",
    metadata: { category: data.category },
  });

  return createSuccessResponse({ submitted: true }, 201);
});
