import { ShieldCheck } from "lucide-react";

export function ResponsibleAINotice() {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-primary-soft/60 p-4">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-burgundy" />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-burgundy">Responsible AI</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          AI-generated content may contain inaccuracies or omissions. Always review and verify
          AI-generated information before using it for important workplace decisions or
          communications. Do not enter confidential, sensitive, or personal information.
        </p>
      </div>
    </div>
  );
}
