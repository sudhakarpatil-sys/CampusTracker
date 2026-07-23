"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Client-side accounts can request deletion, but actually deleting the auth
 * user (and cascading their profile/data) requires the service role key,
 * which must never ship to the browser — see the `/api/account` note in
 * supabase/README.md for wiring up a real server-side deletion route.
 * Until that exists, this signs the user out and is explicit that the
 * request still needs to be completed manually — it must never imply
 * data was actually deleted when it wasn't.
 */
export function AccountDangerZone() {
  const router = useRouter();
  const [confirmText, setConfirmText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "Account deletion isn't automated yet — contact support to finish removing your data.",
    });
    router.push("/");
    setIsDeleting(false);
  }

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Delete account</CardTitle>
        <CardDescription>
          Signs you out immediately. Full account and data deletion currently requires a support request — this is
          noted so you&apos;re never told something was deleted when it wasn&apos;t.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete my account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                Type <span className="font-mono font-medium text-foreground">DELETE</span> to confirm. You&apos;ll be
                signed out immediately; contact support to complete permanent data deletion.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-delete">Confirmation</Label>
              <Input id="confirm-delete" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" />
            </div>
            <DialogFooter>
              <Button variant="destructive" disabled={confirmText !== "DELETE" || isDeleting} onClick={handleDelete}>
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Permanently delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
