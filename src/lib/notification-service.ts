/**
 * Reusable notification service.
 *
 * Wraps the existing toast() with semantic methods (success, error,
 * warning, info) and consistent styling per variant. Replaces direct
 * toast() calls across the codebase.
 *
 * Usage:
 * ```ts
 * import { notify } from "@/lib/notification-service";
 *
 * notify.success("Assignment created");
 * notify.error("Couldn't save attendance", error.message);
 * notify.warning("You're running low on skippable classes");
 * notify.info("Theme preference saved");
 * ```
 */

import { toast } from "@/hooks/use-toast";

type NotifyOptions = {
  /** Primary message (shown as toast title). */
  title: string;
  /** Optional detail message (shown as toast description). */
  description?: string;
  /** Duration override in ms (default 4000). */
  duration?: number;
};

function createNotify(variant: "default" | "success" | "destructive") {
  return (title: string, description?: string, duration?: number) => {
    toast({
      title,
      description,
      variant,
      duration,
    });
  };
}

export const notify = {
  /**
   * Success notification — green accent. Use after successful CRUD ops.
   * `notify.success("Assignment created")`
   */
  success: createNotify("success"),

  /**
   * Error notification — red accent. Use for failed operations.
   * `notify.error("Couldn't save", "Network timeout")`
   */
  error: createNotify("destructive"),

  /**
   * Warning notification — default accent with warning semantics.
   * `notify.warning("Attendance below target")`
   */
  warning: (title: string, description?: string, duration?: number) => {
    toast({
      title: `⚠️ ${title}`,
      description,
      variant: "default",
      duration,
    });
  },

  /**
   * Info notification — neutral. Use for non-critical messages.
   * `notify.info("Theme preference saved")`
   */
  info: createNotify("default"),

  /**
   * Low-level access to the raw toast API for custom variants.
   */
  custom: toast,
};
